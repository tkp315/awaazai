import { ConfigResult } from '@config/index.js';
import { LibResult } from '@lib/index.js';

interface AwaazAI {
  config: ConfigResult;
  libs: LibResult;
}

const AA: AwaazAI = {
  config: {} as ConfigResult,
  libs: {} as LibResult,
};

export function setConfig(config: ConfigResult) {
  AA.config = config;
}

export function setLibs(libs: LibResult) {
  AA.libs = libs;
}

//   export function setUtils(utils: Record<string, any>) {
//     AA.utils = utils;
//   }

export default AA;
