export interface PassportConfig {
  google: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  };
}

export default function getPassportConfig(): PassportConfig {
  return {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    },
  };
}
