import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompletionDto } from './completion.dto.js';

export class StreamingCompletionDto extends CompletionDto {
  @ApiProperty({ description: 'Enable streaming response', default: true })
  @IsBoolean()
  stream: boolean = true;

  @ApiPropertyOptional({
    description: 'Callback URL for streaming events (server-sent events)',
  })
  @IsOptional()
  @IsString()
  callbackUrl?: string;

  @ApiPropertyOptional({
    description: 'Unique identifier for the streaming session',
  })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
