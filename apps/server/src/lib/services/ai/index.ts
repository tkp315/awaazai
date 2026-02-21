import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AIConfig } from '../../../config/services/ai/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AILib {
  [key: string]: unknown;
}

export async function init(config: AIConfig): Promise<AILib> {
  const items = fs.readdirSync(__dirname);

  const aiDirs = items.filter(item => {
    return fs.statSync(path.join(__dirname, item)).isDirectory();
  });

  const libs: AILib = {};

  for (const dir of aiDirs) {
    const module = await import(`./${dir}/index.js`);
    if (module.init) {
      const aiConfig = (config as Record<string, unknown>)[dir];
      libs[dir] = await module.init(aiConfig);
    }
  }

  return libs;
}

// Re-export individual services for direct access
export * as openai from './openai/index.js';
export * as elevenlabs from './elevenlabs/index.js';

export default { init };
