import { getTransporter, getMailConfig } from './client.js';
import { getOTPTemplate } from './templates/index.js';

export interface SendMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface OTPMailOptions {
  to: string;
  otp: string;
  type: 'SIGNUP' | 'PASSWORD_RESET';
  expiryMinutes?: number;
}

// Generic send mail
export async function sendMail(options: SendMailOptions): Promise<boolean> {
  try {
    const resend = getTransporter();
    const config = getMailConfig();

    const { data, error } = await resend.emails.send({
      from: `${config.from.name} <${config.from.email}>`,
      to: options.to,
      subject: options.subject,
      ...(options.html ? { html: options.html } : { text: options.text ?? '' }),
    });

    if (error) {
      console.error(`❌ Resend error:`, error);
      throw new Error(error.message);
    }
    console.log(`📧 Email sent to: ${options.to} | id: ${data?.id}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Send OTP mail
export async function sendOTPMail(options: OTPMailOptions): Promise<boolean> {
  const subject =
    options.type === 'SIGNUP' ? 'Verify Your Email - AwaazAI' : 'Reset Your Password - AwaazAI';

  const html = getOTPTemplate({
    otp: options.otp,
    type: options.type,
    expiryMinutes: options.expiryMinutes,
  });

  return sendMail({
    to: options.to,
    subject,
    html,
  });
}

// Send welcome mail
export async function sendWelcomeMail(to: string, name: string): Promise<boolean> {
  return sendMail({
    to,
    subject: 'Welcome to AwaazAI!',
    html: `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for joining AwaazAI. We're excited to have you on board.</p>
    `,
  });
}
