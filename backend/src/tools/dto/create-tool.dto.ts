import {
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  IsArray,
  IsInt,
  Min,
  Max,
  Matches,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

class ToolStepDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    enum: ['http', 'llm', 'code', 'knowledge_search', 'transform'],
  })
  @IsEnum(['http', 'llm', 'code', 'knowledge_search', 'transform'])
  type: string;

  @ApiProperty()
  @IsObject()
  config: Record<string, unknown>;
}

export class CreateToolDto {
  @ApiProperty()
  @IsString()
  @Matches(/^[a-z0-9_]+$/, {
    message: 'name must be lowercase alphanumeric with underscores',
  })
  name: string;

  @ApiProperty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty()
  @IsObject()
  inputSchema: Record<string, unknown>;

  @ApiProperty({ type: [ToolStepDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToolStepDto)
  steps: ToolStepDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  outputMapping?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requiresAuth?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  authConfig?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(120000)
  timeoutMs?: number;
}

export class UpdateToolDto extends PartialType(CreateToolDto) {}
