import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, message, Card, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import type { User } from '../../types';
import UserModal from './UserModal';

const UserList: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<{id: string, name: string}[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/users');
      setData(res.data);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res: any = await request.get('/roles');
      setRoles(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await request.delete(`/users/${id}`);
      message.success('删除成功');
      fetchUsers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const openModal = (user?: User) => {
    setEditingUser(user || null);
    setModalVisible(true);
  };

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const columns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { 
      title: '角色', 
      dataIndex: 'roleId', 
      key: 'roleId',
      render: (roleId: string) => <Tag color="blue">{getRoleName(roleId)}</Tag>
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      )
    },
    { 
      title: '创建时间', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />} onClick={() => openModal(record)}>编辑</Button>
          <Popconfirm title="确定删除此用户吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card bordered={false} style={{ borderRadius: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>
          <Input placeholder="搜索用户名或姓名" prefix={<SearchOutlined />} style={{ width: 250 }} />
          <Button type="primary">搜索</Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', border: 'none' }}>
          新建用户
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <UserModal 
        visible={modalVisible} 
        onCancel={() => setModalVisible(false)} 
        onSuccess={() => { setModalVisible(false); fetchUsers(); }}
        user={editingUser}
        roles={roles}
      />
    </Card>
  );
};

export default UserList;
