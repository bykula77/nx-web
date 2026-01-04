import { useState } from 'react';
import { Layout } from 'antd';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { DashboardLayoutProps } from './DashboardLayout.types';

const { Content } = Layout;

/**
 * DashboardLayout component - main dashboard layout with sidebar and header
 */
export function DashboardLayout({
  children,
  sidebarProps,
  headerProps,
  showHeader = true,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(sidebarProps.collapsed ?? false);

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    sidebarProps.onCollapse?.(value);
  };

  const siderWidth = collapsed ? 80 : 200;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar
        {...sidebarProps}
        collapsed={collapsed}
        onCollapse={handleCollapse}
      />
      <Layout style={{ marginLeft: siderWidth, transition: 'margin-left 0.2s' }}>
        {showHeader && headerProps && (
          <Header
            {...headerProps}
            sidebarCollapsed={collapsed}
            onSidebarToggle={() => handleCollapse(!collapsed)}
          />
        )}
        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#fff',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

