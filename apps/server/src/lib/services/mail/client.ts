import { Resend } from 'resend';
// import nodemailer, { Transporter } from 'nodemailer';
// import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
// import { lookup } from 'dns/promises';
import { MailConfig } from '@config/services/mail/index.js';

let resendClient: Resend | null = null;
let mailConfig: MailConfig | null = null;

export async function createTransporter(config: MailConfig): Promise<Resend> {
  mailConfig = config;
  resendClient = new Resend(config.resendApiKey);
  console.log('✅ Mail service connected (Resend)');
  return resendClient;
}

export function getTransporter(): Resend {
  if (!resendClient) {
    throw new Error('Mail client not initialized. Call createTransporter first.');
  }
  return resendClient;
}

export function getMailConfig(): MailConfig {
  if (!mailConfig) {
    throw new Error('Mail config not initialized.');
  }
  return mailConfig;
}

export async function disconnect(): Promise<void> {
  resendClient = null;
  console.log('Mail service disconnected');
}
