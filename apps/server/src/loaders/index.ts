import loadConfig, { AppConfig } from './config.loader.js';
export interface LoaderResults {
  config: AppConfig;
}

async function loaders() {
  const config = await loadConfig();
  // TO-DO : OTHER TODO
  console.log('All loaders completed');
  return { config };
}

export default loaders;
