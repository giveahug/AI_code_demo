import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Breadcrumb, theme } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  UserOutlined, 
  TeamOutlined, 
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useUser } from '../../store/UserContext';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const { token } = theme.useToken();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/users', icon: <UserOutlined />, label: '用户管理' },
    { key: '/roles', icon: <TeamOutlined />, label: '角色管理' },
  ];

  const userMenuItems = [
    { key: 'profile', icon: <SettingOutlined />, label: '个人中心', onClick: () => navigate('/profile') },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true, onClick: logout },
  ];

  const getBreadcrumbs = () => {
    const pathSnippets = location.pathname.split('/').filter(i => i);
    const extraBreadcrumbItems = pathSnippets.map((_, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const item = menuItems.find(m => m.key === url);
      return { key: url, title: item ? item.label : pathSnippets[index] };
    });
    return [{ key: 'home', title: '首页' }].concat(extraBreadcrumbItems);
  };

  return (
    <Layout className="admin-layout">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="glass-sider"
        width={240}
      >
        <div className="logo-container">
          <div className="logo-icon" />
          {!collapsed && <span className="logo-text">Admin Pro</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="transparent-menu"
        />
      </Sider>
      <Layout className="site-layout-bg">
        <Header className="glass-header" style={{ padding: '0 24px', background: token.colorBgContainer }}>
          <div className="header-left">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
            <Breadcrumb items={getBreadcrumbs()} style={{ margin: '0 16px' }} />
          </div>
          <div className="header-right">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="user-dropdown">
                <Avatar style={{ backgroundColor: token.colorPrimary, marginRight: 8 }}>
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
                <span className="user-name">{user?.name || 'User'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="main-content">
          <div className="content-inner">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
