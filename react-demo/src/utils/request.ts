import axios from 'axios';
import { getToken, removeToken, removeUserInfo } from './auth';
import { setupMockAdapter } from '../mocks/adapter';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// If we want to use the mock, we apply the adapter
setupMockAdapter(request);

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
    // In our mock, we return {code, message, data, total}.
    if (res && res.code !== 200) {
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res; // Note: returning the unwrapped data {code, message, data}
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
