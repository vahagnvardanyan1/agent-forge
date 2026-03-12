import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QueryKnowledgeDto {
  @ApiProperty()
  @IsString()
  query: string;

  @ApiPropertyOptional({ default: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  topK?: number;
}
