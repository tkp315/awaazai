import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ConfigResult {
  app: Record<string, unknown>;
  services: Record<string, unknown>;
  helper: Record<string, unknown>;
}

async function configLoader(): Promise<ConfigResult> {
  const items = fs.readdirSync(__dirname);

  const configDirs = items.filter(item => {
    const itemPath = path.join(__dirname, item);
    return fs.statSync(itemPath).isDirectory();
  });

  const configs = await Promise.all(
    configDirs.map(async dir => {
      const module = await import(`./${dir}/index.js`);
      const config = await module.default();
      return { [dir]: config };
    })
  );

  return Object.assign({}, ...configs) as ConfigResult;
}

export default configLoader;
