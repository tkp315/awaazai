export interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    email: string;
  };
}

async function mailConfig(): Promise<MailConfig> {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587', 10),
    secure: isProduction, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PASSWORD || '', // Gmail app password
    },
    from: {
      name: process.env.MAIL_FROM_NAME || 'AwaazAI',
      email: process.env.MAIL_FROM_EMAIL || 'noreply@awaazai.com',
    },
  };
}

export default mailConfig;
