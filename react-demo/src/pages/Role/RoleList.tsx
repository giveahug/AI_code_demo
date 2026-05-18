import React, { useEffect, useState } from 'react';
import { Card, List, Button, Modal, Form, Input, Checkbox, message, Tag, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import request from '../../utils/request';
import type { Role } from '../../types';

const { Text } = Typography;

const permissionsOptions = [
  { label: '所有权限 (All)', value: 'all' },
  { label: '读取 (Read)', value: 'read' },
  { label: '写入 (Write)', value: 'write' },
  { label: '删除 (Delete)', value: 'delete' },
];

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res: any = await request.get('/roles');
      setRoles(res.data);
    } catch (error) {
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await request.delete(`/roles/${id}`);
      message.success('删除成功');
      fetchRoles();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const openModal = (role?: Role) => {
    setEditingRole(role || null);
    if (role) {
      form.setFieldsValue(role);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        await request.put(`/roles/${editingRole.id}`, values);
        message.success('更新成功');
      } else {
        await request.post('/roles', values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchRoles();
    } catch (error) {}
  };

  return (
    <div className="role-list-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2>角色管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)', border: 'none' }}>
          新建角色
        </Button>
      </div>

      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        dataSource={roles}
        loading={loading}
        renderItem={role => (
          <List.Item>
            <Card
              hoverable
              actions={[
                <EditOutlined key="edit" onClick={() => openModal(role)} />,
                <DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} onClick={() => handleDelete(role.id)} />
              ]}
              style={{ borderRadius: 12, borderTop: '4px solid #a855f7' }}
            >
              <Card.Meta
                avatar={<div style={{ padding: 12, background: 'rgba(168, 85, 247, 0.1)', borderRadius: '50%', color: '#a855f7' }}><SafetyCertificateOutlined style={{ fontSize: 24 }} /></div>}
                title={role.name}
                description={<div style={{ minHeight: 44 }}><Text type="secondary">{role.description}</Text></div>}
              />
              <div style={{ marginTop: 16 }}>
                {role.permissions.map(p => (
                  <Tag color={p === 'all' ? 'purple' : 'default'} key={p}>{p}</Tag>
                ))}
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingRole ? '编辑角色' : '新建角色'}
        open={modalVisible}
        onOk={onOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="角色名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="permissions" label="权限" rules={[{ required: true }]}>
            <Checkbox.Group options={permissionsOptions} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleList;
