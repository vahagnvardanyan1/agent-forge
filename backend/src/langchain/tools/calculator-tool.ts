import { Injectable, Logger } from '@nestjs/common';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

export interface CalculatorToolInput {
  expression: string;
}

export interface CalculatorToolOutput {
  success: boolean;
  result: number;
  expression: string;
}

/**
 * Safe recursive-descent math parser.
 * Supports: +, -, *, /, %, parentheses, unary minus, decimal numbers.
 * Does NOT use Function() or eval().
 */
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

const mathParser = new SafeMathParser();

@Injectable()
export class CalculatorTool {
  private readonly logger = new Logger(CalculatorTool.name);

  readonly name = 'calculator';
  readonly description = 'Evaluate mathematical expressions safely';

  execute(input: CalculatorToolInput): CalculatorToolOutput {
    this.logger.log(`Calculator: ${input.expression}`);

    try {
      const result = mathParser.parse(input.expression);
      return {
        success: !isNaN(result) && isFinite(result),
        result,
        expression: input.expression,
      };
    } catch (error) {
      this.logger.warn(`Calculator parse error: ${(error as Error).message}`);
      return {
        success: false,
        result: NaN,
        expression: input.expression,
      };
    }
  }

  toLangChainTool() {
    return tool(
      (input) => {
        const result = this.execute(input);
        return JSON.stringify(result);
      },
      {
        name: 'calculator',
        description:
          'Evaluate mathematical expressions safely. Supports basic arithmetic: +, -, *, /, %, parentheses',
        schema: z.object({
          expression: z
            .string()
            .describe(
              'The mathematical expression to evaluate (e.g., "2 + 3 * 4")',
            ),
        }),
      },
    );
  }
}
