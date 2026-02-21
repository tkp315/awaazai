export interface JwtConfig {
  accessToken: {
    secret: string;
    expiresIn: string;
  };
  refreshToken: {
    secret: string;
    expiresIn: string;
  };
  issuer: string;
  audience: string;
}
async function jwtConfig(): Promise<JwtConfig> {
  return {
    accessToken: {
      secret: process.env.JWT_ACCESS_SECRET || 'access-secret-change-in-production',
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m', //15 minutes
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-change-in-production',
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d', // 7days
    },
    issuer: 'awaazai',
    audience: 'awaazai-users',
  };
}

export default jwtConfig;
