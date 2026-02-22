import { Application } from 'express';
import { CookieConfig } from '@config/app/middlewares/cookie/index.js';
import cookieParser from 'cookie-parser';

function init(config: CookieConfig, appObj: Application) {
  appObj.use(cookieParser());
}
export { init };
