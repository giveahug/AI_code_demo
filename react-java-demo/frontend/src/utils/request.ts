import axios from 'axios';
import { getToken, removeToken, removeUserInfo } from './auth';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res && res.code === 401) {
      removeToken();
      removeUserInfo();
      window.location.href = '/login';
      return Promise.reject(new Error(res.message || 'Unauthorized'));
    }
    if (res && res.code !== 200) {
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      removeUserInfo();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default request;
