import { ConfigResult } from '@config/index.js';

export interface AwaazAI {
  config: ConfigResult;
  helper: Record<string, any>;
  services: Record<string, any>;
  utils: Record<string, any>;
}
