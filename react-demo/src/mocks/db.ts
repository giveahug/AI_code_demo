import type { User, Role } from '../types';

const DB_KEY = 'mock_db';

export interface DBState {
  users: User[];
  roles: Role[];
}

const defaultRoles: Role[] = [
  { id: '1', name: 'Super Admin', description: 'Has all permissions', permissions: ['all'] },
  { id: '2', name: 'Editor', description: 'Can edit content', permissions: ['read', 'write'] },
  { id: '3', name: 'Viewer', description: 'Read only access', permissions: ['read'] },
];

const defaultUsers: User[] = [
  { id: '1', username: 'admin', name: 'System Admin', roleId: '1', status: 'active', createdAt: new Date().toISOString() },
  { id: '2', username: 'john_doe', name: 'John Doe', roleId: '2', status: 'active', createdAt: new Date().toISOString() },
  { id: '3', username: 'jane_smith', name: 'Jane Smith', roleId: '3', status: 'inactive', createdAt: new Date().toISOString() },
];

export const getDB = (): DBState => {
  const dbStr = localStorage.getItem(DB_KEY);
  if (dbStr) {
    return JSON.parse(dbStr);
  }
  const defaultDB: DBState = { users: defaultUsers, roles: defaultRoles };
  saveDB(defaultDB);
  return defaultDB;
};

export const saveDB = (db: DBState) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};
