import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DynamicStructuredTool } from '@langchain/core/tools';
import type { StructuredToolInterface } from '@langchain/core/tools';
import type { ToolDefinition, UserIntegration } from '@prisma/client';
import { z } from 'zod';
import { jsonSchemaToZod } from './json-schema-to-zod';
import { InterpolationEngine } from './interpolation-engine.js';
import type {
  StepExecutor,
  StepContext,
  ToolStep,
} from './steps/step-executor.interface';
import { HttpStepExecutor } from './steps/http-step.executor';
import { LlmStepExecutor } from './steps/llm-step.executor';
import { CodeStepExecutor } from './steps/code-step.executor';
import { KnowledgeSearchStepExecutor } from './steps/knowledge-search-step.executor';
import { TransformStepExecutor } from './steps/transform-step.executor';

interface TestStepResult {
  name: string;
  durationMs: number;
  output?: string;
  error?: string;
}

export interface TestToolResult {
  success: boolean;
  output?: string;
  error?: string;
  steps: TestStepResult[];
}

@Injectable()
export class ToolFactoryService {
  private readonly logger = new Logger(ToolFactoryService.name);
  private readonly stepExecutors: Map<string, StepExecutor>;
  private readonly schemaCache = new Map<
    string,
    { schema: z.ZodObject<any>; updatedAt: Date }
  >();

  constructor(
    private readonly prisma: PrismaService,
    private readonly interpolationEngine: InterpolationEngine,
    private readonly httpStepExecutor: HttpStepExecutor,
    private readonly llmStepExecutor: LlmStepExecutor,
    private readonly codeStepExecutor: CodeStepExecutor,
    private readonly knowledgeSearchStepExecutor: KnowledgeSearchStepExecutor,
    private readonly transformStepExecutor: TransformStepExecutor,
  ) {
    this.stepExecutors = new Map<string, StepExecutor>([
      ['http', this.httpStepExecutor],
      ['llm', this.llmStepExecutor],
      ['code', this.codeStepExecutor],
      ['knowledge_search', this.knowledgeSearchStepExecutor],
      ['transform', this.transformStepExecutor],
    ]);
  }

  async createTools(
    toolNames: string[],
    userId: string,
  ): Promise<StructuredToolInterface[]> {
    if (toolNames.length === 0) return [];

    const definitions = await this.prisma.toolDefinition.findMany({
      where: { name: { in: toolNames } },
    });

    const defByName = new Map(definitions.map((d) => [d.name, d]));

    const integrations = await this.prisma.userIntegration.findMany({
      where: { userId },
    });

    const authMap = this.resolveAllAuth(definitions, integrations);
    const tools: StructuredToolInterface[] = [];

    for (const name of toolNames) {
      const def = defByName.get(name);
      if (!def) {
        this.logger.warn(
          `Tool definition "${name}" not found in database — skipping`,
        );
        continue;
      }
      tools.push(this.buildDynamicTool(def, authMap.get(def.name) ?? {}));
    }

    return tools;
  }

  async testTool(
    toolName: string,
    input: Record<string, unknown>,
    userId: string,
  ): Promise<TestToolResult> {
    const def = await this.prisma.toolDefinition.findUnique({
      where: { name: toolName },
    });
    if (!def) {
      return {
        success: false,
        error: `Tool definition "${toolName}" not found`,
        steps: [],
      };
    }

    const integrations = await this.prisma.userIntegration.findMany({
      where: { userId },
    });
    const authMap = this.resolveAllAuth([def], integrations);
    const auth = authMap.get(def.name) ?? {};

    const steps = def.steps as unknown as ToolStep[];
    const context: StepContext = { input, steps: {}, auth };
    const stepResults: TestStepResult[] = [];

    try {
      for (const step of steps) {
        const executor = this.stepExecutors.get(step.type);
        if (!executor) {
          throw new Error(`Unknown step type: ${step.type}`);
        }

        const resolvedConfig = this.interpolationEngine.interpolateConfig(
          step.config,
          context,
        );
        const stepStart = Date.now();

        try {
          const timeoutMs =
            (step.config.timeoutMs as number | undefined) ?? 15_000;
          const result = await Promise.race([
            executor.execute(resolvedConfig, context),
            new Promise<never>((_, reject) =>
              setTimeout(
                () => reject(new Error(`Step "${step.name}" timed out`)),
                timeoutMs,
              ),
            ),
          ]);

          context.steps[step.name] = { output: result };
          stepResults.push({
            name: step.name,
            durationMs: Date.now() - stepStart,
            output: result,
          });
        } catch (error) {
          const errorMsg = (error as Error).message;
          stepResults.push({
            name: step.name,
            durationMs: Date.now() - stepStart,
            error: errorMsg,
          });
          throw error;
        }
      }

      const output = this.interpolationEngine.interpolateString(
        def.outputMapping,
        context,
      );
      return { success: true, output, steps: stepResults };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        steps: stepResults,
      };
    }
  }

  private buildDynamicTool(
    def: ToolDefinition,
    auth: Record<string, string>,
  ): StructuredToolInterface {
    const zodSchema = this.getOrCreateZodSchema(def);

    return new DynamicStructuredTool({
      name: def.name,
      description: def.description,
      schema: zodSchema,
      func: async (input: Record<string, unknown>) => {
        return this.executeStepChain(def, input, auth);
      },
    });
  }

  private async executeStepChain(
    def: ToolDefinition,
    input: Record<string, unknown>,
    auth: Record<string, string>,
  ): Promise<string> {
    const steps = def.steps as unknown as ToolStep[];
    const context: StepContext = { input, steps: {}, auth };

    for (const step of steps) {
      const executor = this.stepExecutors.get(step.type);
      if (!executor) {
        throw new Error(`Unknown step type: ${step.type}`);
      }

      const resolvedConfig = this.interpolationEngine.interpolateConfig(
        step.config,
        context,
      );
      const timeoutMs = (step.config.timeoutMs as number | undefined) ?? 15_000;

      try {
        const result = await Promise.race([
          executor.execute(resolvedConfig, context),
          new Promise<never>((_, reject) =>
            setTimeout(
              () => reject(new Error(`Step "${step.name}" timed out`)),
              timeoutMs,
            ),
          ),
        ]);

        context.steps[step.name] = { output: result };
      } catch (error) {
        throw new Error(
          `Tool "${def.name}" failed at step "${step.name}": ${(error as Error).message}`,
        );
      }
    }

    return this.interpolationEngine.interpolateString(
      def.outputMapping,
      context,
    );
  }

  private resolveAllAuth(
    definitions: ToolDefinition[],
    integrations: UserIntegration[],
  ): Map<string, Record<string, string>> {
    const result = new Map<string, Record<string, string>>();

    for (const def of definitions) {
      if (!def.authConfig) {
        result.set(def.name, {});
        continue;
      }

      const authConfig = def.authConfig as Record<string, unknown>;
      const auth: Record<string, string> = {};

      if (authConfig.envVar) {
        const envValue = process.env[authConfig.envVar as string];
        if (envValue) {
          auth.apiKey = envValue;
        }
      }

      if (authConfig.integrationType) {
        const integration = integrations.find(
          (i) => i.type === authConfig.integrationType,
        );
        if (integration) {
          auth.apiKey = integration.accessToken;
          if (
            integration.metadata &&
            typeof integration.metadata === 'object'
          ) {
            const meta = integration.metadata as Record<string, unknown>;
            for (const [key, value] of Object.entries(meta)) {
              if (typeof value === 'string') {
                auth[key] = value;
              }
            }
          }
        }
      }

      result.set(def.name, auth);
    }

    return result;
  }

  private getOrCreateZodSchema(def: ToolDefinition): z.ZodObject<any> {
    const cached = this.schemaCache.get(def.id);
    if (cached && cached.updatedAt.getTime() === def.updatedAt.getTime()) {
      return cached.schema;
    }

    const schema = jsonSchemaToZod(def.inputSchema as Record<string, unknown>);
    this.schemaCache.set(def.id, { schema, updatedAt: def.updatedAt });
    return schema;
  }
}
