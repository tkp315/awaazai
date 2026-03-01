import configLoader, { ConfigResult } from '../config/index.js';

let appConfig: ConfigResult;

async function loadConfig(): Promise<ConfigResult> {
  appConfig = await configLoader();
  console.log('✅ Config loaded');
  return appConfig;
}

export function getConfig(): ConfigResult {
  return appConfig;
}

export default loadConfig;
