import { Row, Col, Card, Statistic, Typography, List, Avatar, Tag, Button, Timeline } from 'antd';
import {
  ShoppingCartOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TruckOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useGetIdentity } from '@refinedev/core';

const { Title, Text } = Typography;

/**
 * Customer dashboard statistics
 */
const stats = [
  {
    title: 'Aktif Siparişler',
    value: 3,
    icon: <ShoppingCartOutlined />,
    color: '#13c2c2',
  },
  {
    title: 'Bekleyen Faturalar',
    value: 2,
    icon: <FileTextOutlined />,
    color: '#faad14',
  },
  {
    title: 'Açık Talepler',
    value: 1,
    icon: <CustomerServiceOutlined />,
    color: '#722ed1',
  },
];

/**
 * Recent orders mock data
 */
const recentOrders = [
  {
    id: 'ORD-001',
    status: 'delivered',
    statusText: 'Teslim Edildi',
    statusColor: 'success',
    date: '28 Aralık 2025',
    total: '₺1.250,00',
  },
  {
    id: 'ORD-002',
    status: 'shipping',
    statusText: 'Kargoda',
    statusColor: 'processing',
    date: '2 Ocak 2026',
    total: '₺850,00',
  },
  {
    id: 'ORD-003',
    status: 'preparing',
    statusText: 'Hazırlanıyor',
    statusColor: 'warning',
    date: '3 Ocak 2026',
    total: '₺2.100,00',
  },
];

/**
 * Support ticket timeline mock data
 */
const ticketTimeline = [
  {
    color: 'green',
    icon: <CheckCircleOutlined />,
    children: 'Teknik destek talebi çözüldü - 2 gün önce',
  },
  {
    color: 'blue',
    icon: <ClockCircleOutlined />,
    children: 'Fatura sorgusu yanıt bekliyor - 1 gün önce',
  },
];

const getOrderStatusIcon = (status: string) => {
  switch (status) {
    case 'delivered':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    case 'shipping':
      return <TruckOutlined style={{ color: '#1890ff' }} />;
    case 'preparing':
      return <ClockCircleOutlined style={{ color: '#faad14' }} />;
    default:
      return <ExclamationCircleOutlined />;
  }
};

/**
 * Client Panel Dashboard page component
 */
export function DashboardPage() {
  const { data: user } = useGetIdentity<{ name?: string; email?: string }>();

  return (
    <div style={{ padding: '24px' }}>
      {/* Welcome Message */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)' }}>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          Hoş Geldiniz, {user?.name || 'Değerli Müşterimiz'}! 👋
        </Title>
        <Text style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 16 }}>
          Hesabınızı buradan yönetebilir, siparişlerinizi takip edebilirsiniz.
        </Text>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={
                  <span style={{ color: stat.color, marginRight: 8 }}>
                    {stat.icon}
                  </span>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Recent Orders */}
        <Col xs={24} lg={14}>
          <Card
            title="Son Siparişlerim"
            extra={<Button type="link">Tümünü Gör</Button>}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentOrders}
              renderItem={(order) => (
                <List.Item
                  actions={[
                    <Button type="link" key="detail">
                      Detay
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={getOrderStatusIcon(order.status)}
                        style={{ backgroundColor: '#f0f5f5' }}
                      />
                    }
                    title={
                      <span>
                        {order.id}{' '}
                        <Tag color={order.statusColor}>{order.statusText}</Tag>
                      </span>
                    }
                    description={
                      <Text type="secondary">
                        {order.date} • <Text strong>{order.total}</Text>
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Support & Quick Actions */}
        <Col xs={24} lg={10}>
          <Card title="Destek Talepleri" style={{ marginBottom: 16 }}>
            <Timeline items={ticketTimeline} />
            <Button type="primary" icon={<CustomerServiceOutlined />} block>
              Yeni Destek Talebi Oluştur
            </Button>
          </Card>

          <Card title="Hızlı İşlemler">
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Button
                  block
                  icon={<ShoppingCartOutlined />}
                  style={{ height: 60 }}
                >
                  Siparişlerim
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  block
                  icon={<FileTextOutlined />}
                  style={{ height: 60 }}
                >
                  Faturalarım
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

