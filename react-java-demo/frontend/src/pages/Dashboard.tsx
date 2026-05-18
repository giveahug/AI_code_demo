import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Typography, Timeline } from 'antd';
import { UserOutlined, TeamOutlined, SafetyCertificateOutlined, RiseOutlined } from '@ant-design/icons';
import request from '../utils/request';
import './Dashboard.css';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ users: 0, roles: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          request.get('/users'),
          request.get('/roles')
        ]);
        setStats({
          users: (usersRes as any).total || 0,
          roles: (rolesRes as any).total || 0
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <Title level={4} style={{ marginBottom: 24 }}>仪表盘总览</Title>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card primary-gradient" bordered={false}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>总用户数</span>}
              value={stats.users}
              valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
              prefix={<UserOutlined style={{ opacity: 0.8 }} />}
            />
            <div className="card-decoration">
              <RiseOutlined />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card purple-gradient" bordered={false}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>系统角色数</span>}
              value={stats.roles}
              valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
              prefix={<TeamOutlined style={{ opacity: 0.8 }} />}
            />
            <div className="card-decoration">
              <SafetyCertificateOutlined />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card pink-gradient" bordered={false}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>今日活跃访问</span>}
              value={128}
              valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
              prefix={<RiseOutlined style={{ opacity: 0.8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card blue-gradient" bordered={false}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>系统状态</span>}
              value={'运行中'}
              valueStyle={{ color: '#fff', fontSize: '32px', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="系统动态图表" bordered={false} className="chart-card">
            <div className="mock-chart">
              <div className="bar" style={{ height: '40%' }}><span>Mon</span></div>
              <div className="bar" style={{ height: '60%' }}><span>Tue</span></div>
              <div className="bar" style={{ height: '35%' }}><span>Wed</span></div>
              <div className="bar" style={{ height: '80%' }}><span>Thu</span></div>
              <div className="bar" style={{ height: '50%' }}><span>Fri</span></div>
              <div className="bar" style={{ height: '90%' }}><span>Sat</span></div>
              <div className="bar" style={{ height: '70%' }}><span>Sun</span></div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="近期活动记录" bordered={false} className="activity-card">
            <Timeline
              items={[
                { children: 'admin 登录系统', color: 'green' },
                { children: '新增了一个角色 Editor', color: 'blue' },
                { children: '更新了系统的基础配置', color: 'gray' },
                { children: '删除了无效测试账号', color: 'red' },
                { children: '系统每周定期备份完成', color: 'green' },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
