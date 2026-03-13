import { Injectable } from '@nestjs/common';
import type { StepContext } from './steps/step-executor.interface.js';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ParsedExpression {
  path: string;
  filters: ParsedFilter[];
}

interface ParsedFilter {
  name: string;
  args: (string | number | boolean)[];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TEMPLATE_RE = /\{\{(.+?)\}\}/g;
const ARRAY_CAP = 10_000;
const DEPTH_LIMIT = 20;

/* ------------------------------------------------------------------ */
/*  InterpolationEngine                                                */
/* ------------------------------------------------------------------ */

@Injectable()
export class InterpolationEngine {
  /**
   * Interpolate all `{{ expr }}` placeholders in a template string.
   */
  interpolateString(template: string, context: StepContext): string {
    return template.replace(TEMPLATE_RE, (_match, raw: string) => {
      const expr = raw.trim();

      // Special case: steps.last.output
      if (expr === 'steps.last.output') {
        const stepKeys = Object.keys(context.steps);
        if (stepKeys.length === 0) return '';
        const lastKey = stepKeys[stepKeys.length - 1];
        return context.steps[lastKey]?.output ?? '';
      }

      const parsed = this.parseExpression(expr);
      let value: unknown = this.resolvePath(
        parsed.path,
        context as unknown as Record<string, unknown>,
        context,
      );

      for (const filter of parsed.filters) {
        value = this.applyFilter(filter, value);
      }

      if (value === undefined || value === null) return '';
      return typeof value === 'object'
        ? JSON.stringify(value)
        : String(value as string | number | boolean);
    });
  }

  /**
   * Recursively interpolate all string values in a config object.
   */
  interpolateConfig(
    config: Record<string, unknown>,
    context: StepContext,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(config)) {
      if (typeof value === 'string') {
        result[key] = this.interpolateString(value, context);
      } else if (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        result[key] = this.interpolateConfig(
          value as Record<string, unknown>,
          context,
        );
      } else if (Array.isArray(value)) {
        result[key] = (value as unknown[]).map((item: unknown) => {
          if (typeof item === 'string') {
            return this.interpolateString(item, context);
          }
          if (item !== null && typeof item === 'object') {
            return this.interpolateConfig(
              item as Record<string, unknown>,
              context,
            );
          }
          return item;
        });
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /* ---------------------------------------------------------------- */
  /*  Expression parser (recursive-descent)                            */
  /* ---------------------------------------------------------------- */

  private parseExpression(expr: string): ParsedExpression {
    const parts = this.splitOnPipes(expr);
    const path = parts[0].trim();
    const filters: ParsedFilter[] = [];

    for (let i = 1; i < parts.length; i++) {
      filters.push(this.parseFilter(parts[i].trim()));
    }

    return { path, filters };
  }

  /**
   * Split expression on `|` delimiters, respecting parenthesised args.
   * e.g. `path | filter("a|b")` should NOT split inside the string.
   */
  private splitOnPipes(expr: string): string[] {
    const parts: string[] = [];
    let current = '';
    let depth = 0;
    let inString: string | null = null;

    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i];

      if (inString) {
        current += ch;
        if (ch === inString && expr[i - 1] !== '\\') {
          inString = null;
        }
        continue;
      }

      if (ch === '"' || ch === "'") {
        inString = ch;
        current += ch;
        continue;
      }

      if (ch === '(') {
        depth++;
        current += ch;
        continue;
      }

      if (ch === ')') {
        depth--;
        current += ch;
        continue;
      }

      if (ch === '|' && depth === 0) {
        parts.push(current);
        current = '';
        continue;
      }

      current += ch;
    }

    parts.push(current);
    return parts;
  }

  /**
   * Parse a single filter: `name` or `name(arg1, "arg2", 3, true)`
   */
  private parseFilter(raw: string): ParsedFilter {
    const parenIdx = raw.indexOf('(');
    if (parenIdx === -1) {
      return { name: raw, args: [] };
    }

    const name = raw.slice(0, parenIdx).trim();
    const argsStr = raw.slice(parenIdx + 1, raw.lastIndexOf(')')).trim();
    if (argsStr === '') {
      return { name, args: [] };
    }

    const args = this.parseArgs(argsStr);
    return { name, args };
  }

  /**
   * Parse comma-separated arguments, handling quoted strings.
   */
  private parseArgs(argsStr: string): (string | number | boolean)[] {
    const args: (string | number | boolean)[] = [];
    let current = '';
    let inString: string | null = null;

    for (let i = 0; i < argsStr.length; i++) {
      const ch = argsStr[i];

      if (inString) {
        if (ch === inString && argsStr[i - 1] !== '\\') {
          inString = null;
        } else {
          current += ch;
        }
        continue;
      }

      if (ch === '"' || ch === "'") {
        inString = ch;
        continue;
      }

      if (ch === ',') {
        args.push(this.coerceArg(current.trim()));
        current = '';
        continue;
      }

      current += ch;
    }

    const last = current.trim();
    if (last !== '') {
      args.push(this.coerceArg(last));
    }

    return args;
  }

  private coerceArg(raw: string): string | number | boolean {
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    const num = Number(raw);
    if (!Number.isNaN(num) && raw !== '') return num;
    return raw;
  }

  /* ---------------------------------------------------------------- */
  /*  Path resolution                                                  */
  /* ---------------------------------------------------------------- */

  /**
   * Resolve a dot/bracket path against a context object.
   * Supports the `.data` virtual property that JSON.parses step output.
   */
  private resolvePath(
    path: string,
    obj: unknown,
    _context: StepContext,
  ): unknown {
    const segments = this.tokenizePath(path);

    if (segments.length > DEPTH_LIMIT) {
      return undefined;
    }

    // Cache for parsed JSON outputs keyed by step name
    const jsonCache = new Map<string, unknown>();

    let current: unknown = obj;
    let i = 0;

    while (i < segments.length) {
      if (current == null || typeof current !== 'object') return undefined;

      const seg = segments[i];

      // Detect `.data` virtual property on step output
      if (
        seg === 'data' &&
        i >= 2 &&
        segments[0] === 'steps' &&
        current !== null &&
        typeof current === 'object' &&
        'output' in (current as Record<string, unknown>)
      ) {
        const stepName = segments[1];
        if (!jsonCache.has(stepName)) {
          const raw = (current as Record<string, unknown>).output;
          if (typeof raw !== 'string') return undefined;
          try {
            jsonCache.set(stepName, JSON.parse(raw));
          } catch {
            return undefined;
          }
        }
        current = jsonCache.get(stepName);
        i++;
        continue;
      }

      // Bracket access: segment like "0", "1", etc. on arrays
      if (Array.isArray(current)) {
        const idx = Number(seg);
        if (Number.isNaN(idx)) return undefined;
        current = (current as unknown[])[idx];
        i++;
        continue;
      }

      current = (current as Record<string, unknown>)[seg];
      i++;
    }

    return current;
  }

  /**
   * Tokenize a path string into segments.
   * Handles dot notation and bracket notation:
   *   `steps.fetch.data.results[0].title` → ['steps','fetch','data','results','0','title']
   */
  private tokenizePath(path: string): string[] {
    const segments: string[] = [];
    let current = '';

    for (let i = 0; i < path.length; i++) {
      const ch = path[i];

      if (ch === '.') {
        if (current !== '') {
          segments.push(current);
          current = '';
        }
        continue;
      }

      if (ch === '[') {
        if (current !== '') {
          segments.push(current);
          current = '';
        }
        // Read until closing bracket
        const closeBracket = path.indexOf(']', i + 1);
        if (closeBracket === -1) {
          // Malformed — treat rest as literal
          current = path.slice(i);
          break;
        }
        segments.push(path.slice(i + 1, closeBracket));
        i = closeBracket;
        continue;
      }

      current += ch;
    }

    if (current !== '') {
      segments.push(current);
    }

    return segments;
  }

  /* ---------------------------------------------------------------- */
  /*  Filter catalog                                                   */
  /* ---------------------------------------------------------------- */

  private applyFilter(filter: ParsedFilter, value: unknown): unknown {
    switch (filter.name) {
      case 'default':
        return this.filterDefault(value, filter.args);
      case 'pick':
        return this.filterPick(value, filter.args);
      case 'map':
        return this.filterMap(value, filter.args);
      case 'first':
        return this.filterFirst(value);
      case 'last':
        return this.filterLast(value);
      case 'at':
        return this.filterAt(value, filter.args);
      case 'join':
        return this.filterJoin(value, filter.args);
      case 'slice':
        return this.filterSlice(value, filter.args);
      case 'length':
        return this.filterLength(value);
      case 'stringify':
        return JSON.stringify(value);
      case 'truncate':
        return this.filterTruncate(value, filter.args);
      case 'if_contains':
        return this.filterIfContains(value, filter.args);
      case 'if_truthy':
        return value ? value : undefined;
      case 'ternary':
        return this.filterTernary(value, filter.args);
      case 'replace':
        return this.filterReplace(value, filter.args);
      case 'lowercase':
        return typeof value === 'string' ? value.toLowerCase() : value;
      case 'urlencode':
        return typeof value === 'string' ? encodeURIComponent(value) : value;
      default:
        // Unknown filter — pass through unchanged (closed registry, just ignore)
        return value;
    }
  }

  /* -- Individual filters ------------------------------------------ */

  private filterDefault(
    value: unknown,
    args: (string | number | boolean)[],
  ): unknown {
    const fallback = args[0] ?? '';
    if (value === undefined || value === null || value === '') return fallback;
    return value;
  }

  private filterPick(
    value: unknown,
    args: (string | number | boolean)[],
  ): unknown {
    const fields = args.map(String);
    if (Array.isArray(value)) {
      return value.slice(0, ARRAY_CAP).map((item: unknown) => {
        if (item !== null && typeof item === 'object') {
          return this.pickFields(item as Record<string, unknown>, fields);
        }
        return item;
      });
    }
    if (value !== null && typeof value === 'object') {
      return this.pickFields(value as Record<string, unknown>, fields);
    }
    return value;
  }

  private pickFields(
    obj: Record<string, unknown>,
    fields: string[],
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const f of fields) {
      if (f in obj) result[f] = obj[f];
    }
    return result;
  }

  private filterMap(
    value: unknown,
    args: (string | number | boolean)[],
  ): unknown {
    if (!Array.isArray(value)) return value;
    const field = String(args[0] ?? '');
    return value.slice(0, ARRAY_CAP).map((item) => {
      if (item !== null && typeof item === 'object') {
        return (item as Record<string, unknown>)[field];
      }
      return undefined;
    });
  }

  private filterFirst(value: unknown): unknown {
    if (Array.isArray(value)) return value[0];
    return value;
  }

  private filterLast(value: unknown): unknown {
    if (Array.isArray(value)) return value[value.length - 1];
    return value;
  }

  private filterAt(
    value: unknown,
    args: (string | number | boolean)[],
  ): unknown {
    if (!Array.isArray(value)) return value;
    const idx = Number(args[0] ?? 0);
    return value[idx];
  }

  private filterJoin(
    value: unknown,
    args: (string | number | boolean)[],
  ): unknown {
    if (!Array.isArray(value)) return value;
    const sep = String(args[0] ?? ',');
    return value.join(sep);
  }

  private filterSlice(
    value: unknown,
    args: (string | number | boolean)[],
  ): unknown {
    if (typeof value === 'string' || Array.isArray(value)) {
      const start = Number(args[0] ?? 0);
      const end = args[1] !== undefined ? Number(args[1]) : undefined;
      return value.slice(start, end);
    }
    return value;
  }

  private filterLength(value: unknown): unknown {
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length;
    }
    return value;
  }

  private filterTruncate(
    value: unknown,
    args: (string | number | boolean)[],
  ): unknown {
    if (typeof value !== 'string') return value;
    const maxLen = Number(args[0] ?? 100);
    if (value.length <= maxLen) return value;
    return value.slice(0, maxLen) + '...';
  }

  private filterIfContains(
    value: unknown,
    args: (string | number | boolean)[],
  ): unknown {
    if (typeof value !== 'string') return undefined;
    const substr = String(args[0] ?? '');
    const result = args[1] ?? value;
    return value.includes(substr) ? result : undefined;
  }

  private filterTernary(
    value: unknown,
    args: (string | number | boolean)[],
  ): unknown {
    const trueVal = args[0] ?? '';
    const falseVal = args[1] ?? '';
    return value ? trueVal : falseVal;
  }

  private filterReplace(
    value: unknown,
    args: (string | number | boolean)[],
  ): unknown {
    if (typeof value !== 'string') return value;
    const search = String(args[0] ?? '');
    const replacement = String(args[1] ?? '');
    return value.split(search).join(replacement);
  }
}
