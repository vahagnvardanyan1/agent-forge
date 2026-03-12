import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService, StripeCheckoutSession } from './stripe.service';

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  agentLimit: number;
  executionsPerMonth: number;
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripe: StripeService,
  ) {}

  getPlans(): BillingPlan[] {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['3 agents', '100 executions/month', 'Community support'],
        agentLimit: 3,
        executionsPerMonth: 100,
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 29,
        features: [
          'Unlimited agents',
          '10,000 executions/month',
          'Priority support',
          'Custom integrations',
        ],
        agentLimit: -1,
        executionsPerMonth: 10000,
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        features: [
          'Unlimited everything',
          'Dedicated support',
          'SLA',
          'Custom deployment',
        ],
        agentLimit: -1,
        executionsPerMonth: -1,
      },
    ];
  }

  async getSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    return {
      plan: 'FREE',
      userId: user?.id,
    };
  }

  async createCheckoutSession(
    userId: string,
    planId: string,
  ): Promise<StripeCheckoutSession> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const customer = this.stripe.createCustomer(user.email);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return this.stripe.createCheckoutSession(
      customer.id,
      planId,
      `${frontendUrl}/billing/success`,
      `${frontendUrl}/billing/cancel`,
    );
  }

  async cancelSubscription(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    this.logger.log(`Cancel subscription requested for user ${userId}`);
    return { success: true, message: 'Subscription cancelled' };
  }

  async getUsage(userId: string) {
    const [agentCount, executionCount] = await Promise.all([
      this.prisma.agent.count({ where: { authorId: userId } }),
      this.prisma.execution.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);
    return { agentCount, executionCount };
  }
}
