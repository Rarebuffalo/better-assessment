export type BillingCycle = 'monthly' | 'yearly';

export interface Subscription {
  id: number;
  name: string;
  cost: number;
  billing_cycle: BillingCycle;
  next_billing_date: string;
  category: string;
  is_active: boolean;
}

export type SubscriptionCreate = Omit<Subscription, 'id'>;
export type SubscriptionUpdate = Partial<SubscriptionCreate>;
