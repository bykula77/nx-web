import { Layout, Avatar, Dropdown, Space, Button } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { HeaderProps } from './DashboardLayout.types';

const { Header: AntHeader } = Layout;

/**
 * Header component - dashboard header with user menu
 */
export function Header({
  user,
  onLogout,
  actions,
  onSidebarToggle,
  sidebarCollapsed,
}: HeaderProps) {
  const dropdownItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Çıkış Yap',
      icon: <LogoutOutlined />,
      onClick: onLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {onSidebarToggle && (
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onSidebarToggle}
            style={{ marginRight: '16px' }}
          />
        )}
      </div>

      <Space size="middle">
        {actions}
        {user && (
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                src={user.avatar}
                icon={!user.avatar && <UserOutlined />}
              />
              <span>{user.name}</span>
            </Space>
          </Dropdown>
        )}
      </Space>
    </AntHeader>
  );
}

