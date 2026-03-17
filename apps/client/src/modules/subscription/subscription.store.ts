import { create } from 'zustand';
import * as subscriptionService from './subscription.service';
import type { IPlan, ISubscription, IMyLimits, IUsageData, IPaymentRecord, BillingCycle } from './subscription.types';

interface SubscriptionState {
  subscription: ISubscription | null;
  plans: IPlan[];
  limits: IMyLimits | null;
  usage: IUsageData | null;
  payments: IPaymentRecord[];
  loading: boolean;
  loadingPlans: boolean;
  loadingLimits: boolean;
  loadingUsage: boolean;
  loadingPayments: boolean;
  error: string | null;

  // Actions
  fetchSubscription: () => Promise<void>;
  fetchPlans: () => Promise<void>;
  fetchLimits: () => Promise<void>;
  fetchUsage: () => Promise<void>;
  fetchPayments: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  clearError: () => void;

  // Computed helpers (called as functions since Zustand doesn't support getters)
  getPlanName: () => string;
  isFreePlan: () => boolean;
  canCloneVoice: () => boolean;
  canCreateChat: () => boolean;
  canCreateBot: () => boolean;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: null,
  plans: [],
  limits: null,
  usage: null,
  payments: [],
  loading: false,
  loadingPlans: false,
  loadingLimits: false,
  loadingUsage: false,
  loadingPayments: false,
  error: null,

  fetchSubscription: async () => {
    set({ loading: true, error: null });
    try {
      const subscription = await subscriptionService.getMySubscription();
      set({ subscription, loading: false });
    } catch (err) {
      set({ error: subscriptionService.handleError(err, 'Failed to load subscription'), loading: false });
    }
  },

  fetchPlans: async () => {
    set({ loadingPlans: true, error: null });
    try {
      const plans = await subscriptionService.getPlans();
      set({ plans, loadingPlans: false });
    } catch (err) {
      set({ error: subscriptionService.handleError(err, 'Failed to load plans'), loadingPlans: false });
    }
  },

  fetchLimits: async () => {
    set({ loadingLimits: true, error: null });
    try {
      const limits = await subscriptionService.getMyLimits();
      set({ limits, loadingLimits: false });
    } catch (err) {
      set({ error: subscriptionService.handleError(err, 'Failed to load limits'), loadingLimits: false });
    }
  },

  fetchUsage: async () => {
    set({ loadingUsage: true, error: null });
    try {
      const usage = await subscriptionService.getMyUsage();
      set({ usage, loadingUsage: false });
    } catch (err) {
      set({ error: subscriptionService.handleError(err, 'Failed to load usage'), loadingUsage: false });
    }
  },

  fetchPayments: async () => {
    set({ loadingPayments: true, error: null });
    try {
      const payments = await subscriptionService.getMyPayments();
      set({ payments, loadingPayments: false });
    } catch (err) {
      set({ error: subscriptionService.handleError(err, 'Failed to load payments'), loadingPayments: false });
    }
  },

  cancelSubscription: async () => {
    set({ loading: true, error: null });
    try {
      await subscriptionService.cancelSubscription();
      // Refresh subscription after cancel
      const subscription = await subscriptionService.getMySubscription();
      set({ subscription, loading: false });
    } catch (err) {
      set({ error: subscriptionService.handleError(err, 'Failed to cancel subscription'), loading: false });
    }
  },

  clearError: () => set({ error: null }),

  getPlanName: () => {
    const { subscription } = get();
    return subscription?.plan?.name ?? 'Free';
  },

  isFreePlan: () => {
    const { subscription } = get();
    return !subscription || subscription.plan.slug === 'free';
  },

  canCloneVoice: () => {
    const { limits } = get();
    if (!limits) return true;
    return limits.VOICE_CLONES.allowed;
  },

  canCreateChat: () => {
    const { limits } = get();
    if (!limits) return true;
    return limits.VOICE_CHATS.allowed;
  },

  canCreateBot: () => {
    const { limits } = get();
    if (!limits) return true;
    return limits.AI_BOTS.allowed;
  },
}));
