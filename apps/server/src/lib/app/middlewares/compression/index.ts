import { Application } from 'express';
import { CompressionConfig } from '@config/app/middlewares/compression/index.js';
import compression from 'compression';

function init(config: CompressionConfig, appObj: Application) {
  appObj.use(
    compression({
      level: config.level,
      threshold: config.threshold,
    })
  );
}

export { init };
