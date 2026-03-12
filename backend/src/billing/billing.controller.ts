import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { BillingService, BillingPlan } from './billing.service';
import type { StripeCheckoutSession } from './stripe.service';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get available billing plans' })
  getPlans(): BillingPlan[] {
    return this.billingService.getPlans();
  }

  @Get('subscription')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current subscription' })
  getSubscription(@CurrentUser('id') userId: string) {
    return this.billingService.getSubscription(userId);
  }

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create checkout session' })
  createCheckout(
    @CurrentUser('id') userId: string,
    @Body() body: { planId: string },
  ): Promise<StripeCheckoutSession> {
    return this.billingService.createCheckoutSession(userId, body.planId);
  }

  @Post('cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel subscription' })
  cancel(@CurrentUser('id') userId: string) {
    return this.billingService.cancelSubscription(userId);
  }

  @Get('usage')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current usage' })
  getUsage(@CurrentUser('id') userId: string) {
    return this.billingService.getUsage(userId);
  }
}
