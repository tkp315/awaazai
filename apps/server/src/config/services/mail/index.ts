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
  tls: {
    rejectUnauthorized: boolean;
  };
  dnsLookup?: (hostname: string, options: unknown, callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void) => void;
}

async function mailConfig(): Promise<MailConfig> {
  const { lookup } = await import('dns');
  const isProduction = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production';

  return {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: isProduction ? 465 : parseInt(process.env.MAIL_PORT || '587', 10),
    secure: isProduction,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.MAIL_USER || '',
      pass: process.env.MAIL_PASSWORD || '',
    },
    from: {
      name: process.env.MAIL_FROM_NAME || 'AwaazAI',
      email: process.env.MAIL_FROM_EMAIL || 'noreply@awaazai.com',
    },
    dnsLookup: (hostname, _opts, cb) => lookup(hostname, 4, cb),
  };
}

export default mailConfig;
