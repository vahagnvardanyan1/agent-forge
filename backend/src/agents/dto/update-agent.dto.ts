import { PartialType } from '@nestjs/swagger';
import { CreateAgentDto } from './create-agent.dto';
import { IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAgentDto extends PartialType(CreateAgentDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  flowConfig?: Record<string, unknown>;
}
