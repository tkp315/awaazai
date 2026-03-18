import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { lookup } from 'dns/promises';
import { MailConfig } from '@config/services/mail/index.js';

let transporter: Transporter | null = null;
let mailConfig: MailConfig | null = null;

export async function createTransporter(config: MailConfig): Promise<Transporter> {
  mailConfig = config;

  const { address: resolvedHost } = await lookup(config.host, 4);
  const options = {
    host: resolvedHost,
    port: config.port,
    secure: config.secure,
    tls: config.tls,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
  } as SMTPTransport.Options;
  transporter = nodemailer.createTransport(options);

  // Verify connection
  try {
    await transporter.verify();
    console.log('✅ Mail service connected');
  } catch (error) {
    console.error('❌ Mail service connection failed:', error);
  }

  return transporter;
}

export function getTransporter(): Transporter {
  if (!transporter) {
    throw new Error('Mail transporter not initialized. Call createTransporter first.');
  }
  return transporter;
}

export function getMailConfig(): MailConfig {
  if (!mailConfig) {
    throw new Error('Mail config not initialized.');
  }
  return mailConfig;
}

export async function disconnect(): Promise<void> {
  if (transporter) {
    transporter.close();
    transporter = null;
    console.log('Mail service disconnected');
  }
}
