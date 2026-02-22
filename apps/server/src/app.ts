import express from 'express';
import configLoader from '@config/index.js';
import initLibs from '@lib/index.js';
import { setConfig, setLibs } from 'globals/index.js';

const app = express();

async function init() {
  // 1. Load all configs dynamically
  const config = await configLoader();
  app.config = config;
  setConfig(config);
  const libs = await initLibs(config, app);
  setLibs(libs);
}

export { app, init };
