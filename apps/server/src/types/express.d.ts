import { ConfigResult } from '@config/index.js';

declare global {
  namespace Express {
    interface Application {
      config: ConfigResult;
    }
  }
}

export {};
