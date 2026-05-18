import type { AxiosInstance } from 'axios';
import { getDB, saveDB } from './db';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const setupMockAdapter = (instance: AxiosInstance) => {
  const originalAdapter = instance.defaults.adapter;

  instance.defaults.adapter = async (config: any) => {
    const fullUrl = (config.baseURL || '') + (config.url || '');
    
    if (fullUrl.startsWith('/api')) {
      await delay(500);

      const url = fullUrl.replace('/api', '');
      const method = config.method?.toLowerCase();
      const db = getDB();
      const token = config.headers?.Authorization;

      const requireAuth = url !== '/auth/login';
      if (requireAuth && token !== 'Bearer mock-token-123') {
        return {
          data: { code: 401, message: 'Unauthorized', data: null },
          status: 401,
          statusText: 'Unauthorized',
          headers: {},
          config,
        };
      }

      let responseData = null;

      try {
        if (url === '/auth/login' && method === 'post') {
          const body = JSON.parse(config.data);
          if (body.username === 'admin' && body.password === '123456') {
            responseData = { code: 200, message: 'success', data: { token: 'mock-token-123', user: db.users[0] } };
          } else {
            responseData = { code: 400, message: 'Invalid username or password (use admin/123456)', data: null };
          }
        } 
        else if (url === '/currentUser' && method === 'get') {
          responseData = { code: 200, message: 'success', data: db.users[0] };
        }
        else if (url.startsWith('/users')) {
          if (method === 'get') {
            responseData = { code: 200, message: 'success', data: db.users, total: db.users.length };
          } else if (method === 'post') {
            const newUser = { ...JSON.parse(config.data), id: Date.now().toString(), createdAt: new Date().toISOString() };
            db.users.unshift(newUser);
            saveDB(db);
            responseData = { code: 200, message: 'success', data: newUser };
          } else if (method === 'put') {
            const id = url.split('/')[2];
            const updates = JSON.parse(config.data);
            db.users = db.users.map(u => u.id === id ? { ...u, ...updates } : u);
            saveDB(db);
            responseData = { code: 200, message: 'success', data: null };
          } else if (method === 'delete') {
            const id = url.split('/')[2];
            db.users = db.users.filter(u => u.id !== id);
            saveDB(db);
            responseData = { code: 200, message: 'success', data: null };
          }
        }
        else if (url.startsWith('/roles')) {
          if (method === 'get') {
            responseData = { code: 200, message: 'success', data: db.roles, total: db.roles.length };
          } else if (method === 'post') {
            const newRole = { ...JSON.parse(config.data), id: Date.now().toString() };
            db.roles.push(newRole);
            saveDB(db);
            responseData = { code: 200, message: 'success', data: newRole };
          } else if (method === 'put') {
            const id = url.split('/')[2];
            const updates = JSON.parse(config.data);
            db.roles = db.roles.map(r => r.id === id ? { ...r, ...updates } : r);
            saveDB(db);
            responseData = { code: 200, message: 'success', data: null };
          } else if (method === 'delete') {
             const id = url.split('/')[2];
             db.roles = db.roles.filter(r => r.id !== id);
             saveDB(db);
             responseData = { code: 200, message: 'success', data: null };
          }
        }

        if (responseData) {
          return { data: responseData, status: 200, statusText: 'OK', headers: {}, config };
        }
        return { data: { code: 404, message: 'Not found', data: null }, status: 404, statusText: 'Not Found', headers: {}, config };
      } catch (e: any) {
         return { data: { code: 500, message: e.message || 'Internal Error', data: null }, status: 500, statusText: 'Internal Error', headers: {}, config };
      }
    }

    if (originalAdapter) {
       // Support Axios 1.x adapter signature
       if (typeof originalAdapter === 'function') {
         return originalAdapter(config);
       }
    }
    return Promise.reject(new Error('No adapter'));
  };
};
