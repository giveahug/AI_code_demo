export interface User {
  id: string;
  username: string;
  name: string;
  roleId: string;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface ApiResult<T = any> {
  code: number;
  message: string;
  data: T;
  total?: number;
}
