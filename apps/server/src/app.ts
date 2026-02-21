import express from 'express';
import configLoader from '@config/index.js';
import initLibs from '@lib/index.js';

const app = express();

async function init() {
  // 1. Load all configs dynamically
  const config = await configLoader();
  app.config = config;
  await initLibs(config);
  return app;
}

export { app, init };
