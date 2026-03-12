import { Injectable, Logger } from '@nestjs/common';

export interface CalculatorToolInput {
  expression: string;
}

export interface CalculatorToolOutput {
  success: boolean;
  result: number;
  expression: string;
}

@Injectable()
export class CalculatorTool {
  private readonly logger = new Logger(CalculatorTool.name);

  readonly name = 'calculator';
  readonly description = 'Evaluate mathematical expressions safely';

  execute(input: CalculatorToolInput): CalculatorToolOutput {
    this.logger.log(`Calculator: ${input.expression}`);

    const sanitized = input.expression.replace(/[^0-9+\-*/().%\s]/g, '');
    let result: number;

    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call
      result = Function(`"use strict"; return (${sanitized})`)() as number;
    } catch {
      result = NaN;
    }

    return {
      success: !isNaN(result),
      result,
      expression: input.expression,
    };
  }
}
