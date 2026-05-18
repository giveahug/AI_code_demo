import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../store/UserContext';
import request from '../utils/request';
import { setToken, setUserInfo } from '../utils/auth';
import './Login.css';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res: any = await request.post('/auth/login', values);
      if (res.code === 200) {
        message.success('登录成功');
        setToken(res.data.token);
        setUserInfo(res.data.user);
        setUser(res.data.user);
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        message.error(res.message);
      }
    } catch (error: any) {
      message.error(error.message || '登录失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <div className="login-logo">
            <div className="logo-icon-large"></div>
          </div>
          <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>欢迎回来</Title>
          <Text type="secondary">Admin Pro 后台管理系统</Text>
        </div>
        
        <Form
          name="login"
          size="large"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名 (admin)" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码 (123456)" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-btn" loading={loading} block>
              登录系统
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
