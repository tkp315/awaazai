import configLoader from '../config/index.js';

export interface AppConfig {
  [key: string]: unknown;
}
let appConfig: AppConfig;

async function loadConfig(): Promise<AppConfig> {
  appConfig = await configLoader();
  console.log('✅ Config loaded');
  return appConfig;
}

export function getConfig(): AppConfig {
  return appConfig;
}

export default loadConfig;
