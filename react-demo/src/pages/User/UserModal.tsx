import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Switch, message } from 'antd';
import request from '../../utils/request';
import type { User } from '../../types';

interface UserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  user: User | null;
  roles: {id: string, name: string}[];
}

const UserModal: React.FC<UserModalProps> = ({ visible, onCancel, onSuccess, user, roles }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (user) {
        form.setFieldsValue({ ...user, status: user.status === 'active' });
      } else {
        form.resetFields();
      }
    }
  }, [visible, user, form]);

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = { ...values, status: values.status ? 'active' : 'inactive' };
      if (user) {
        await request.put(`/users/${user.id}`, payload);
        message.success('更新成功');
      } else {
        await request.post('/users', payload);
        message.success('创建成功');
      }
      onSuccess();
    } catch (error) {
      // Validate failed or API error
    }
  };

  return (
    <Modal
      title={user ? '编辑用户' : '新建用户'}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ status: true }}>
        <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="请输入用户名" disabled={!!user} />
        </Form.Item>
        <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
          <Input placeholder="请输入真实姓名" />
        </Form.Item>
        <Form.Item name="roleId" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
          <Select placeholder="请选择角色">
            {roles.map(r => <Select.Option key={r.id} value={r.id}>{r.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="status" label="状态" valuePropName="checked">
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
