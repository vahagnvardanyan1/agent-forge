import {
  IsString,
  IsArray,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class MessageDto {
  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class CompletionDto {
  @ApiProperty({ enum: ['openai', 'anthropic', 'google'] })
  @IsString()
  provider: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ type: [MessageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxTokens?: number;
}
