import { Injectable, Logger } from '@nestjs/common';
import type { StepExecutor, StepContext } from './step-executor.interface';

class SafeMathParser {
  private pos = 0;
  private input = '';

  parse(expression: string): number {
    this.input = expression.replace(/\s+/g, '');
    this.pos = 0;
    const result = this.parseExpression();
    if (this.pos < this.input.length) {
      throw new Error(`Unexpected character: ${this.input[this.pos]}`);
    }
    return result;
  }

  private parseExpression(): number {
    let left = this.parseTerm();
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (ch === '+') {
        this.pos++;
        left = left + this.parseTerm();
      } else if (ch === '-') {
        this.pos++;
        left = left - this.parseTerm();
      } else {
        break;
      }
    }
    return left;
  }

  private parseTerm(): number {
    let left = this.parseUnary();
    while (this.pos < this.input.length) {
      const ch = this.input[this.pos];
      if (ch === '*') {
        this.pos++;
        left = left * this.parseUnary();
      } else if (ch === '/') {
        this.pos++;
        const right = this.parseUnary();
        if (right === 0) throw new Error('Division by zero');
        left = left / right;
      } else if (ch === '%') {
        this.pos++;
        const right = this.parseUnary();
        if (right === 0) throw new Error('Modulo by zero');
        left = left % right;
      } else {
        break;
      }
    }
    return left;
  }

  private parseUnary(): number {
    if (this.pos < this.input.length && this.input[this.pos] === '-') {
      this.pos++;
      return -this.parsePrimary();
    }
    if (this.pos < this.input.length && this.input[this.pos] === '+') {
      this.pos++;
    }
    return this.parsePrimary();
  }

  private parsePrimary(): number {
    if (this.pos >= this.input.length) {
      throw new Error('Unexpected end of expression');
    }
    if (this.input[this.pos] === '(') {
      this.pos++;
      const result = this.parseExpression();
      if (this.pos >= this.input.length || this.input[this.pos] !== ')') {
        throw new Error('Missing closing parenthesis');
      }
      this.pos++;
      return result;
    }
    return this.parseNumber();
  }

  private parseNumber(): number {
    const start = this.pos;
    while (
      this.pos < this.input.length &&
      (this.isDigit(this.input[this.pos]) || this.input[this.pos] === '.')
    ) {
      this.pos++;
    }
    if (this.pos === start) {
      throw new Error(
        `Expected number at position ${this.pos}: "${this.input.slice(this.pos, this.pos + 10)}"`,
      );
    }
    const num = Number(this.input.slice(start, this.pos));
    if (isNaN(num)) {
      throw new Error(`Invalid number: ${this.input.slice(start, this.pos)}`);
    }
    return num;
  }

  private isDigit(ch: string): boolean {
    return ch >= '0' && ch <= '9';
  }
}

type CodeHandler = (
  input: Record<string, unknown>,
  context: StepContext,
) => string;

const mathParser = new SafeMathParser();

@Injectable()
export class CodeStepExecutor implements StepExecutor {
  private readonly logger = new Logger(CodeStepExecutor.name);
  private readonly handlers = new Map<string, CodeHandler>();

  constructor() {
    this.handlers.set('calculator', (input) => {
      const expression = input.expression as string;
      if (!expression)
        throw new Error('Calculator requires "expression" input');
      const result = mathParser.parse(expression);
      return JSON.stringify({ result, expression });
    });

    this.handlers.set('json_transform', (input) => {
      const data = input.data;
      const pick = input.pick as string[] | undefined;
      if (pick && typeof data === 'object' && data !== null) {
        const picked: Record<string, unknown> = {};
        for (const key of pick) {
          picked[key] = (data as Record<string, unknown>)[key];
        }
        return JSON.stringify(picked);
      }
      return JSON.stringify(data);
    });
  }

  execute(
    config: Record<string, unknown>,
    context: StepContext,
  ): Promise<string> {
    const handler = config.handler as string;
    if (!handler) {
      throw new Error('Code step requires a "handler" config field');
    }

    const fn = this.handlers.get(handler);
    if (!fn) {
      throw new Error(
        `Unknown code handler: "${handler}". Available: ${Array.from(this.handlers.keys()).join(', ')}`,
      );
    }

    this.logger.log(`Code step: handler=${handler}`);
    return Promise.resolve(fn(context.input, context));
  }
}
