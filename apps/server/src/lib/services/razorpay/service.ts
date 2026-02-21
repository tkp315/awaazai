import crypto from 'crypto';
import { getClient, getConfig } from './client.js';

// ============================================
// ORDER OPERATIONS
// ============================================

export interface CreateOrderOptions {
  amount: number; // in paise (100 paise = 1 INR)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createOrder(options: CreateOrderOptions) {
  const client = getClient();
  const config = getConfig();

  return client.orders.create({
    amount: options.amount,
    currency: options.currency || config.currency,
    receipt: options.receipt,
    notes: options.notes,
  });
}

export async function getOrder(orderId: string) {
  const client = getClient();
  return client.orders.fetch(orderId);
}

export async function getOrderPayments(orderId: string) {
  const client = getClient();
  return client.orders.fetchPayments(orderId);
}

// ============================================
// PAYMENT OPERATIONS
// ============================================

export async function getPayment(paymentId: string) {
  const client = getClient();
  return client.payments.fetch(paymentId);
}

export async function capturePayment(paymentId: string, amount: number, currency?: string) {
  const client = getClient();
  const config = getConfig();

  return client.payments.capture(paymentId, amount, currency || config.currency);
}

export async function refundPayment(
  paymentId: string,
  amount?: number,
  notes?: Record<string, string>
) {
  const client = getClient();

  return client.payments.refund(paymentId, {
    amount,
    notes,
  });
}

// ============================================
// SUBSCRIPTION OPERATIONS
// ============================================

export interface CreateSubscriptionOptions {
  planId: string;
  customerId: string;
  totalCount?: number;
  notes?: Record<string, string>;
}

export async function createSubscription(options: CreateSubscriptionOptions) {
  const client = getClient();

  return client.subscriptions.create({
    plan_id: options.planId,
    customer_id: options.customerId,
    total_count: options.totalCount || 12, // Default 12 months
    notes: options.notes,
  });
}

export async function getSubscription(subscriptionId: string) {
  const client = getClient();
  return client.subscriptions.fetch(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string, cancelAtCycleEnd: boolean = true) {
  const client = getClient();
  return client.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
}

export async function pauseSubscription(subscriptionId: string) {
  const client = getClient();
  return client.subscriptions.pause(subscriptionId);
}

export async function resumeSubscription(subscriptionId: string) {
  const client = getClient();
  return client.subscriptions.resume(subscriptionId);
}

// ============================================
// CUSTOMER OPERATIONS
// ============================================

export interface CreateCustomerOptions {
  name: string;
  email: string;
  contact: string;
  notes?: Record<string, string>;
}

export async function createCustomer(options: CreateCustomerOptions) {
  const client = getClient();

  return client.customers.create({
    name: options.name,
    email: options.email,
    contact: options.contact,
    notes: options.notes,
  });
}

export async function getCustomer(customerId: string) {
  const client = getClient();
  return client.customers.fetch(customerId);
}

// ============================================
// PLAN OPERATIONS
// ============================================

export function getPlanConfig(planType: 'basic' | 'pro' | 'enterprise') {
  const config = getConfig();
  return config.plans[planType];
}

export async function getPlan(planId: string) {
  const client = getClient();
  return client.plans.fetch(planId);
}

// ============================================
// WEBHOOK VERIFICATION
// ============================================

export function verifyWebhookSignature(body: string, signature: string): boolean {
  const config = getConfig();

  const expectedSignature = crypto
    .createHmac('sha256', config.webhookSecret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const config = getConfig();

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', config.keySecret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

// ============================================
// UTILITY
// ============================================

export function amountToPaise(amount: number): number {
  return Math.round(amount * 100);
}

export function paiseToAmount(paise: number): number {
  return paise / 100;
}
