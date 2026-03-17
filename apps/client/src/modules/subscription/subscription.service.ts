import axiosInstance from '@/api/fetch/client';
import { AxiosError } from 'axios';
import type {
  IPlan,
  ISubscription,
  IMyLimits,
  ICreateOrderPayload,
  ICreateOrderResponse,
  IVerifyPaymentPayload,
  IUsageData,
  IPaymentRecord,
} from './subscription.types';

export function handleError(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export function isLimitReached(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 403 && error.response?.data?.code === 'LIMIT_REACHED';
  }
  return false;
}

// ── API Calls ─────────────────────────────────────────────────────────────────

export const getMySubscription = async (): Promise<ISubscription> => {
  const res = await axiosInstance.get<{ success: boolean; data: ISubscription }>('/subscriptions/me');
  return res.data.data;
};

export const getPlans = async (): Promise<IPlan[]> => {
  const res = await axiosInstance.get<{ success: boolean; data: IPlan[] }>('/subscriptions/plans');
  return res.data.data;
};

export const getMyLimits = async (): Promise<IMyLimits> => {
  const res = await axiosInstance.get<{ success: boolean; data: IMyLimits }>('/subscriptions/limits');
  return res.data.data;
};

export const createOrder = async (payload: ICreateOrderPayload): Promise<ICreateOrderResponse> => {
  const res = await axiosInstance.post<{ success: boolean; data: ICreateOrderResponse }>('/subscriptions/create-order', payload);
  return res.data.data;
};

export const verifyPayment = async (payload: IVerifyPaymentPayload): Promise<ISubscription> => {
  const res = await axiosInstance.post<{ success: boolean; data: ISubscription }>('/subscriptions/verify', payload);
  return res.data.data;
};

export const cancelSubscription = async (): Promise<void> => {
  await axiosInstance.post('/subscriptions/cancel');
};

export const getMyUsage = async (): Promise<IUsageData> => {
  const res = await axiosInstance.get<{ success: boolean; data: IUsageData }>('/subscriptions/usage');
  return res.data.data;
};

export const getMyPayments = async (): Promise<IPaymentRecord[]> => {
  const res = await axiosInstance.get<{ success: boolean; data: IPaymentRecord[] }>('/subscriptions/payments');
  return res.data.data;
};
