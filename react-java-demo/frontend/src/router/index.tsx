import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthRoute from '../components/AuthRoute';
import AdminLayout from '../components/Layout/AdminLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import UserList from '../pages/User/UserList';
import RoleList from '../pages/Role/RoleList';
import Profile from '../pages/Profile';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <AuthRoute>
        <AdminLayout />
      </AuthRoute>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'users', element: <UserList /> },
      { path: 'roles', element: <RoleList /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;
