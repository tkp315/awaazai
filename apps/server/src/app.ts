import express from 'express';
import configLoader from '@config/index.js';
import initLibs from '@lib/index.js';
import { setConfig, setLibs } from 'globals/index.js';
import routes from './routes/index.js';
import { applyErrorHandlers } from '@lib/app/middlewares/errorHandler/index.js';
import { initTrainingWorker } from '@modules/bot/workers/training.worker.js';
import { initCloningWorker } from '@modules/voice/workers/cloning.worker.js';

const app = express();

async function init() {
  // 1. Load all configs dynamically
  const config = await configLoader();
  app.config = config;
  setConfig(config);
  const libs = await initLibs(config, app);
  setLibs(libs);

  // 2. Setup routes
  app.use('/api', routes);

  // 3. Init workers (after services — Redis is ready now)
  initTrainingWorker();
  initCloningWorker();

  // 4. Error handlers (must be after routes)
  applyErrorHandlers(app);
}

export { app, init };
