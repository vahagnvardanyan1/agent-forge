import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum OrchestrationStrategy {
  SEQUENTIAL = 'SEQUENTIAL',
  PARALLEL = 'PARALLEL',
  ROUND_ROBIN = 'ROUND_ROBIN',
  ADAPTIVE = 'ADAPTIVE',
}

export class OrchestrateDto {
  @ApiProperty()
  @IsString()
  input: string;

  @ApiPropertyOptional({ enum: OrchestrationStrategy })
  @IsOptional()
  @IsEnum(OrchestrationStrategy)
  strategy?: OrchestrationStrategy;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;
}
