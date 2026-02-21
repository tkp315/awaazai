export interface ClientConfig {
  id: string;
  name: string;
  type: 'mobile' | 'web' | 'dashboard';
  allowedOrigins: string[];
  rateLimit: {
    windowMs: number;
    max: number;
  };
  features: string[];
}

export interface ClientsConfig {
  headerName: string;
  versionHeader: string;
  clients: ClientConfig[];
}

async function clientsConfig(): Promise<ClientsConfig> {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    headerName: 'X-Client-Id',
    versionHeader: 'X-App-Version',

    clients: [
      {
        id: 'awaazai-mobile',
        name: 'AwaazAI Mobile App',
        type: 'mobile',
        allowedOrigins: ['*'],
        rateLimit: { windowMs: 15 * 60 * 1000, max: 200 },
        features: ['voice-clone', 'chat', 'voice-message'],
      },
      {
        id: 'awaazai-web',
        name: 'AwaazAI Web App',
        type: 'web',
        allowedOrigins: isProduction ? ['https://app.awaazai.com'] : ['http://localhost:3000'],
        rateLimit: { windowMs: 15 * 60 * 1000, max: 100 },
        features: ['voice-clone', 'chat'],
      },
      {
        id: 'awaazai-dashboard',
        name: 'AwaazAI B2B Dashboard',
        type: 'dashboard',
        allowedOrigins: isProduction
          ? ['https://dashboard.awaazai.com']
          : ['http://localhost:3001'],
        rateLimit: { windowMs: 15 * 60 * 1000, max: 150 },
        features: ['voice-clone', 'chat', 'meeting', 'analytics', 'team'],
      },
    ],
  };
}

export default clientsConfig;
