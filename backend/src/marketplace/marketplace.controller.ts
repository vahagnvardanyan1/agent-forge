import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { MarketplaceService } from './marketplace.service';
import { PublishAgentDto } from './dto/publish-agent.dto';
import { ReviewAgentDto } from './dto/review-agent.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  @ApiOperation({ summary: 'Browse marketplace agents' })
  browse(
    @Query() pagination: PaginationDto,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.marketplaceService.browse(pagination, category, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get marketplace agent detail' })
  getDetail(@Param('id') id: string) {
    return this.marketplaceService.getAgentDetail(id);
  }

  @Post('publish')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Publish agent to marketplace' })
  publish(@CurrentUser('id') userId: string, @Body() dto: PublishAgentDto) {
    return this.marketplaceService.publish(userId, dto);
  }

  @Post(':id/reviews')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add review to agent' })
  addReview(
    @Param('id') agentId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ReviewAgentDto,
  ) {
    return this.marketplaceService.addReview(agentId, userId, dto);
  }
}
