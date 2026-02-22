import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export interface MiddlewareConfig {
  [key: string]: unknown;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function middlewareConfig(): Promise<MiddlewareConfig> {
  const items = fs.readdirSync(__dirname);

  const dirs = items.filter(item => {
    return fs.statSync(path.join(__dirname, item)).isDirectory();
  });

  const configs = await Promise.all(
    dirs.map(async dir => {
      const module = await import(`./${dir}/index.js`);
      const config = typeof module.default === 'function' ? await module.default() : module.default;
      return { [dir]: config };
    })
  );

  return Object.assign({}, ...configs);
}

export default middlewareConfig;
