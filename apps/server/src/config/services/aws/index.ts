import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AwsConfig {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
  services: {
    [key: string]: unknown;
  };
}

async function awsConfig(): Promise<AwsConfig> {
  const items = fs.readdirSync(__dirname);

  // Load all service folders dynamically
  const serviceDirs = items.filter(item => {
    return fs.statSync(path.join(__dirname, item)).isDirectory();
  });

  const services = await Promise.all(
    serviceDirs.map(async dir => {
      const module = await import(`./${dir}/index.js`);
      const config = await module.default();
      return { [dir]: config };
    })
  );

  return {
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    services: Object.assign({}, ...services),
  };
}

export default awsConfig;
