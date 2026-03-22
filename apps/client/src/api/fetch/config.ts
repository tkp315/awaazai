import Constants from 'expo-constants';
const getIPAddress = () => {
  const debuggerHost =
    Constants?.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;

  if (!debuggerHost) {
    console.error('Debugger host not found');
    return 'localhost';
  }
  const ip = debuggerHost.split(':')[0];
  return ip;
};

const PROD_URL = Constants?.expoConfig?.extra?.PROD_BACKEND_URL || 'https://awaazai.onrender.com/api';

const url = () => {
  if (__DEV__) {
    const ip = getIPAddress();
    const backendPort = Constants?.expoConfig?.extra?.BACKEND_PORT || 5000;
    console.log(`backend port ${backendPort}`);
    // return `http://${ip}:${backendPort}/api`;
      return `${PROD_URL}/api`;
  }
  return `${PROD_URL}/api`;
};

export const BASE_URL = url();
export const PRODUCTION_URL = PROD_URL;
