import { Row, Col, Card, Statistic, Typography, List, Avatar, Tag } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

/**
 * Dashboard statistics cards
 */
const stats = [
  {
    title: 'Toplam Kullanıcı',
    value: 1234,
    icon: <UserOutlined />,
    color: '#1890ff',
    change: 12,
    changeType: 'up' as const,
  },
  {
    title: 'Aktif Oturum',
    value: 89,
    icon: <EyeOutlined />,
    color: '#52c41a',
    change: 5,
    changeType: 'up' as const,
  },
  {
    title: 'Yeni Kayıt',
    value: 45,
    icon: <UserOutlined />,
    color: '#faad14',
    change: 3,
    changeType: 'down' as const,
  },
  {
    title: 'İçerik Sayısı',
    value: 567,
    icon: <FileTextOutlined />,
    color: '#722ed1',
    change: 8,
    changeType: 'up' as const,
  },
];

/**
 * Recent activities mock data
 */
const recentActivities = [
  {
    id: 1,
    user: 'Ahmet Yılmaz',
    action: 'yeni kullanıcı kaydı oluşturdu',
    time: '5 dakika önce',
    avatar: null,
  },
  {
    id: 2,
    user: 'Mehmet Kaya',
    action: 'ayarları güncelledi',
    time: '15 dakika önce',
    avatar: null,
  },
  {
    id: 3,
    user: 'Ayşe Demir',
    action: 'yeni içerik ekledi',
    time: '1 saat önce',
    avatar: null,
  },
  {
    id: 4,
    user: 'Fatma Şahin',
    action: 'rapor oluşturdu',
    time: '2 saat önce',
    avatar: null,
  },
  {
    id: 5,
    user: 'Ali Öztürk',
    action: 'kullanıcı sildi',
    time: '3 saat önce',
    avatar: null,
  },
];

/**
 * Dashboard page component
 */
export function DashboardPage() {
  return (
    <div style={{ padding: '24px' }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={
                  <span style={{ color: stat.color, marginRight: 8 }}>
                    {stat.icon}
                  </span>
                }
                suffix={
                  <Tag
                    color={stat.changeType === 'up' ? 'green' : 'red'}
                    style={{ marginLeft: 8 }}
                  >
                    {stat.changeType === 'up' ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )}
                    {stat.change}%
                  </Tag>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Activities */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Son Aktiviteler">
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={<UserOutlined />} src={item.avatar} />
                    }
                    title={
                      <Text>
                        <Text strong>{item.user}</Text> {item.action}
                      </Text>
                    }
                    description={
                      <Text type="secondary">{item.time}</Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Hızlı Erişim">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  onClick={() => {}}
                >
                  <UserOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                  <Title level={5} style={{ marginTop: 8, marginBottom: 0 }}>
                    Kullanıcılar
                  </Title>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  hoverable
                  style={{ textAlign: 'center' }}
                  onClick={() => {}}
                >
                  <FileTextOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <Title level={5} style={{ marginTop: 8, marginBottom: 0 }}>
                    İçerikler
                  </Title>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

