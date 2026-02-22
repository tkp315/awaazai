import { CorsConfig } from '@config/app/middlewares/cors/index.js';
import { Application } from 'express';
import cors from 'cors';

async function init(config: CorsConfig, appObj: Application) {
  appObj.use(
    cors({
      origin: config.origins,
      methods: config.methods,
      allowedHeaders: config.allowedHeaders,
      exposedHeaders: config.exposedHeaders,
      credentials: config.credentials,
      maxAge: config.maxAge,
    })
  );
}

export { init };
