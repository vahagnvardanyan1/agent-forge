import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  AnalyticsService,
  DashboardStats,
  AgentAnalytics,
} from './analytics.service';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard analytics' })
  getDashboard(@CurrentUser('id') userId: string): Promise<DashboardStats> {
    return this.analyticsService.getDashboard(userId);
  }

  @Get('agents/:id')
  @ApiOperation({ summary: 'Get agent analytics' })
  getAgentAnalytics(
    @Param('id') agentId: string,
    @CurrentUser('id') userId: string,
  ): Promise<AgentAnalytics> {
    return this.analyticsService.getAgentAnalytics(agentId, userId);
  }

  @Get('tokens')
  @ApiOperation({ summary: 'Get token usage analytics' })
  getTokenUsage(
    @CurrentUser('id') userId: string,
    @Query('period') period?: 'day' | 'week' | 'month',
  ) {
    return this.analyticsService.getTokenUsage(userId, period);
  }
}
