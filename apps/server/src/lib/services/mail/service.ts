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
    const transporter = getTransporter();
    const config = getMailConfig();

    await transporter.sendMail({
      from: `"${config.from.name}" <${config.from.email}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`📧 Email sent to: ${options.to}`);
    return true;
  } catch (error) {
    throw error;
    console.error('Failed to send email:', error);
    return false;
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
