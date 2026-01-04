import { Breadcrumb, Typography, Space, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { PageHeaderProps } from './PageLayout.types';

const { Title, Text } = Typography;

/**
 * PageHeader component - page header with title, breadcrumbs, and actions
 */
export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actions,
  onBreadcrumbClick,
  showBack,
  onBack,
}: PageHeaderProps) {
  const breadcrumbItems = breadcrumbs?.map((item, index) => ({
    key: index,
    title: item.path ? (
      <a onClick={() => onBreadcrumbClick?.(item.path!)}>{item.label}</a>
    ) : (
      item.label
    ),
  }));

  return (
    <div style={{ marginBottom: '24px' }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbItems} style={{ marginBottom: '16px' }} />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Space align="start">
          {showBack && (
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              style={{ marginRight: '8px', marginTop: '4px' }}
            />
          )}
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {title}
            </Title>
            {subtitle && (
              <Text type="secondary" style={{ marginTop: '4px', display: 'block' }}>
                {subtitle}
              </Text>
            )}
          </div>
        </Space>

        {actions && <Space>{actions}</Space>}
      </div>
    </div>
  );
}

