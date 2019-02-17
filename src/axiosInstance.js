import axios from 'axios';
import { AsyncStorage } from 'react-native';

var axiosInstance = axios.create();

axiosInstance.CancelToken = axios.CancelToken
axiosInstance.isCancel = axios.isCancel

axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem('token');

  if (accessToken) {
        config.headers.authorization = `Bearer ${accessToken}`;
  }
  return config;
}, (error) => {
   return Promise.reject(error);
});

export default axiosInstance;