const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getUserInfo = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};
export const setUserInfo = (user: any) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const removeUserInfo = () => localStorage.removeItem(USER_KEY);
