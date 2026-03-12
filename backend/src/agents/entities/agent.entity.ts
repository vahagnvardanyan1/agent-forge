import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsEnum,
  IsDateString,
  IsInt,
  IsJSON,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AgentStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum AIProvider {
  ANTHROPIC = 'ANTHROPIC',
  OPENAI = 'OPENAI',
  GOOGLE = 'GOOGLE',
  CUSTOM = 'CUSTOM',
}

export class AgentEntity {
  @ApiProperty({ description: 'Unique identifier' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Agent name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL-friendly slug' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Agent description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'System prompt for the agent' })
  @IsString()
  systemPrompt: string;

  @ApiProperty({ description: 'Seed for avatar generation' })
  @IsString()
  avatarSeed: string;

  @ApiProperty({
    enum: AgentStatus,
    description: 'Current status of the agent',
  })
  @IsEnum(AgentStatus)
  status: AgentStatus;

  @ApiProperty({ enum: AIProvider, description: 'AI provider' })
  @IsEnum(AIProvider)
  provider: AIProvider;

  @ApiProperty({ description: 'Model identifier', default: 'gpt-4o' })
  @IsString()
  model: string;

  @ApiProperty({ description: 'Temperature for generation', default: 0.7 })
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature: number;

  @ApiProperty({ description: 'Maximum tokens for generation', default: 4096 })
  @IsInt()
  maxTokens: number;

  @ApiPropertyOptional({ description: 'Flow configuration as JSON' })
  @IsOptional()
  @IsJSON()
  flowConfig?: unknown;

  @ApiProperty({
    description: 'Whether the agent is published',
    default: false,
  })
  @IsBoolean()
  isPublished: boolean;

  @ApiPropertyOptional({ description: 'Price for marketplace', default: 0 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ description: 'Category for marketplace' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Tags for search and filtering', type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ description: 'Number of downloads', default: 0 })
  @IsInt()
  downloads: number;

  @ApiProperty({ description: 'Average rating', default: 0 })
  @IsNumber()
  rating: number;

  @ApiPropertyOptional({ description: 'LangChain chain type' })
  @IsOptional()
  @IsString()
  chainType?: string;

  @ApiPropertyOptional({ description: 'Memory type for conversation history' })
  @IsOptional()
  @IsString()
  memoryType?: string;

  @ApiProperty({ description: 'Author user ID' })
  @IsString()
  authorId: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @IsDateString()
  updatedAt: Date;
}
