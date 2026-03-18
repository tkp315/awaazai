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

const url = () => {
  const isDev = __DEV__;
  const backendPort = Constants?.expoConfig?.extra?.BACKEND_PORT;
  console.log(`Port :`, Constants.expoConfig?.extra);
  if (isDev) {
    const ip = getIPAddress();
    // return `http://${ip}:${backendPort}/api`;
    console.log(`Backend url: ${Constants?.expoConfig?.extra?.PROD_BACKEND_URL}`)
    return Constants?.expoConfig?.extra?.PROD_BACKEND_URL
  } else {
    return Constants?.expoConfig?.extra?.PROD_BACKEND_URL
  }
};

export const BASE_URL = url();
