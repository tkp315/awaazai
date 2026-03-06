import axios from 'axios';
import { BASE_URL as url } from './config';
import { STORAGE_KEYS } from '@/shared/utils/constants';
import { getToken } from '@/shared/utils/storage';
import { router } from 'expo-router';
import { useAuthStore } from '@/modules/auth/auth.store';

const BASE_URL = url;
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
// interceptor
/*  
request interceptor 
1. if token hai to aage jaane do 
response
2. access token nhi mili to refresh token lo 
3. call refreshToken api 
4. save token in secure_storage 
5. process the api with new token 
*/

// request interceptor
const redirectToLogin = async () => {
  await useAuthStore.getState().clearTokens();
  router.replace('/(auth)/login');
};
axiosInstance.interceptors.request.use(
  async config => {
    const accessToken = await getToken(STORAGE_KEYS.AUTH_TOKEN);
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// response interceptor
let isRefreshing = false;
const failedQueue: any[] = [];

const processQueue = (err: any, token: string | null) => {
  for (const req of failedQueue) {
    if (token) {
      req.resolve(token);
    } else {
      req.reject(err);
    }
  }
  failedQueue.length = 0; // Clear queue
};

axiosInstance.interceptors.response.use(
  response => response,
  async err => {
    // check
    console.log('AXIOS RESPONSE ERR', err);
    const originalRequest = err?.config;

    if (!err?.response) {
      return Promise.reject(err);
    }
    const message = err.response?.data?.message;
    const statusCode = err.response?.data?.statusCode; //dummy
    if ((message === 'TokenExpired' || statusCode == 401) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = await getToken(STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
         await redirectToLogin()
          console.error('Refresh Token not found');
          return Promise.reject(err);
        }
        // call refreshApi
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // set new tokens
        // TODO: saveTokens(accessToken, newRefreshToken) - implement in asyncStorage

        processQueue(null, accessToken);
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (error) {
        processQueue(error, null);
        await redirectToLogin();
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);
export default axiosInstance;
