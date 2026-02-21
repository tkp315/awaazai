import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export interface AppConfig {
  [key: string]: unknown;
}

async function configLoader(): Promise<AppConfig> {
  const items = fs.readdirSync(__dirname); // reading whole dir

  const configDirs = items.filter(item => {
    const itemPath = path.join(__dirname, item);
    return fs.statSync(itemPath).isDirectory();
  });

  const configs = await Promise.all(
    configDirs.map(async dir => {
      const module = await import(`./${dir}/index.ts`);
      const config = await module.default;
      return { [dir]: config };
    })
  );
  return Object.assign({}, ...configs);
}

export default configLoader;
