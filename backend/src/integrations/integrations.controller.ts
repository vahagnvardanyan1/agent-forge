import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IntegrationsService } from './integrations.service';

@ApiTags('Integrations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get('available')
  @ApiOperation({ summary: 'List available integration types' })
  getAvailable() {
    return this.integrationsService.getAvailableIntegrations();
  }

  @Get()
  @ApiOperation({ summary: 'List user integrations' })
  list(@CurrentUser('id') userId: string) {
    return this.integrationsService.listIntegrations(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get integration by ID' })
  getOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.integrationsService.getIntegration(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new integration' })
  create(
    @CurrentUser('id') userId: string,
    @Body()
    body: { type: string; name: string; config: Record<string, unknown> },
  ) {
    return this.integrationsService.createIntegration(userId, body);
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test integration connection' })
  test(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.integrationsService.testConnection(id, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an integration' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.integrationsService.deleteIntegration(id, userId);
  }
}
