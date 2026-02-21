import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ServicesLib {
  [key: string]: unknown;
}

async function initServices(config: Record<string, unknown>): Promise<ServicesLib> {
  const items = fs.readdirSync(__dirname);

  const serviceDirs = items.filter(item => {
    return fs.statSync(path.join(__dirname, item)).isDirectory();
  });

  const services: ServicesLib = {};

  for (const dir of serviceDirs) {
    const module = await import(`./${dir}/index.js`);
    if (module.init) {
      const serviceConfig = (config as Record<string, unknown>)[dir];
      services[dir] = await module.init(serviceConfig);
      console.log(`  ✅ service/${dir} initialized`);
    }
  }

  return services;
}

export default initServices;
