import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DatabaseConfig {
  [key: string]: unknown;
}

async function databaseConfig(): Promise<DatabaseConfig> {
  const items = fs.readdirSync(__dirname);

  // filter only directories
  const dbdirs = items.filter(item => {
    return fs.statSync(path.join(__dirname, item)).isDirectory();
  });

  // import dynamically from each dir

  const configs = await Promise.all(
    dbdirs.map(async dir => {
      const module = await import(`./${dir}/index.js`);
      const config = typeof module.default === 'function' ? await module.default() : module.default;
      return {
        [dir]: config,
      };
    })
  );

  return Object.assign({}, ...configs);
}

export default databaseConfig;
