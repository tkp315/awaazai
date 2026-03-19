export interface MailConfig {
  resendApiKey: string;
  // SMTP (commented out — use Resend instead)
  // host: string;
  // port: number;
  // secure: boolean;
  // tls: { rejectUnauthorized: boolean };
  // auth: { user: string; pass: string };
  from: {
    name: string;
    email: string;
  };
}

async function mailConfig(): Promise<MailConfig> {
  return {
    resendApiKey: process.env.RESEND_API_KEY || '',
    from: {
      name: process.env.MAIL_FROM_NAME || 'AwaazAI',
      email: process.env.MAIL_FROM_EMAIL || 'onboarding@resend.dev',
    },
  };
}

export default mailConfig;
