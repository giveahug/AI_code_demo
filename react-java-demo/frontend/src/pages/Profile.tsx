import React from 'react';
import { Card, Avatar, Typography, Tabs, Form, Input, Button, message } from 'antd';
import { UserOutlined, SafetyOutlined } from '@ant-design/icons';
import { useUser } from '../store/UserContext';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const { user } = useUser();
  const [form] = Form.useForm();

  if (!user) return null;

  const handleUpdate = () => {
    message.success('更新个人信息成功 (Mock)');
  };

  const handlePassword = () => {
    message.success('修改密码成功 (Mock)');
  };

  return (
    <div className="profile-container" style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card bordered={false} style={{ borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ height: 120, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', margin: '-24px -24px 0 -24px' }}></div>
        <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: -40, padding: '0 24px', marginBottom: 24 }}>
          <Avatar size={100} icon={<UserOutlined />} style={{ border: '4px solid white', backgroundColor: '#64748b' }} />
          <div style={{ marginLeft: 24, marginBottom: 12 }}>
            <Title level={3} style={{ margin: 0 }}>{user.name}</Title>
            <Text type="secondary">@{user.username} • 管理员</Text>
          </div>
        </div>

        <Tabs defaultActiveKey="1" items={[
          {
            key: '1',
            label: <span><UserOutlined />基本信息</span>,
            children: (
              <div style={{ paddingTop: 24 }}>
                <Form form={form} layout="vertical" initialValues={user} onFinish={handleUpdate}>
                  <Form.Item name="username" label="用户名">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item name="name" label="姓名">
                    <Input />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">保存更新</Button>
                  </Form.Item>
                </Form>
              </div>
            )
          },
          {
            key: '2',
            label: <span><SafetyOutlined />安全设置</span>,
            children: (
              <div style={{ paddingTop: 24 }}>
                <Form layout="vertical" onFinish={handlePassword}>
                  <Form.Item name="oldPassword" label="当前密码" rules={[{ required: true }]}>
                    <Input.Password />
                  </Form.Item>
                  <Form.Item name="newPassword" label="新密码" rules={[{ required: true }]}>
                    <Input.Password />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" danger>修改密码</Button>
                  </Form.Item>
                </Form>
              </div>
            )
          }
        ]} />
      </Card>
    </div>
  );
};

export default Profile;
