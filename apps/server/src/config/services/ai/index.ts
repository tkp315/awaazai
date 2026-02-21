import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AIConfig {
  [key: string]: unknown;
}

async function aiConfig(): Promise<AIConfig> {
  const items = fs.readdirSync(__dirname);

  const aiDirs = items.filter(item => {
    return fs.statSync(path.join(__dirname, item)).isDirectory();
  });

  const configs = await Promise.all(
    aiDirs.map(async dir => {
      const module = await import(`./${dir}/index.js`);
      const config = await module.default();
      return { [dir]: config };
    })
  );

  return Object.assign({}, ...configs);
}

export default aiConfig;
