import { Injectable, Logger } from '@nestjs/common';

interface StripeCustomer {
  id: string;
  email: string;
}

interface StripeSubscription {
  id: string;
  customerId: string;
  status: string;
  plan: string;
  currentPeriodEnd: string;
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
}

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);

  createCustomer(email: string): StripeCustomer {
    this.logger.log(`Creating Stripe customer for ${email}`);
    return {
      id: `cus_${Date.now().toString(36)}`,
      email,
    };
  }

  createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    _cancelUrl: string,
  ): StripeCheckoutSession {
    this.logger.log(`Creating checkout session for customer ${customerId}`);
    return {
      id: `cs_${Date.now().toString(36)}`,
      url: `${successUrl}?session_id=cs_${Date.now().toString(36)}`,
    };
  }

  getSubscription(subscriptionId: string): StripeSubscription {
    this.logger.log(`Getting subscription ${subscriptionId}`);
    return {
      id: subscriptionId,
      customerId: 'cus_mock',
      status: 'active',
      plan: 'pro',
      currentPeriodEnd: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
  }

  cancelSubscription(subscriptionId: string): StripeSubscription {
    this.logger.log(`Cancelling subscription ${subscriptionId}`);
    return {
      id: subscriptionId,
      customerId: 'cus_mock',
      status: 'canceled',
      plan: 'pro',
      currentPeriodEnd: new Date().toISOString(),
    };
  }

  createPortalSession(customerId: string, returnUrl: string): { url: string } {
    this.logger.log(`Creating portal session for customer ${customerId}`);
    return { url: `${returnUrl}?portal=true` };
  }
}
