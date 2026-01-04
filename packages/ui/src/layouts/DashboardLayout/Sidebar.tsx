import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import type { SidebarProps, MenuItem } from './DashboardLayout.types';

const { Sider } = Layout;

function mapMenuItems(items: MenuItem[]): MenuProps['items'] {
  return items.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    children: item.children ? mapMenuItems(item.children) : undefined,
  }));
}

/**
 * Sidebar component - dashboard sidebar with navigation
 */
export function Sidebar({
  items,
  collapsed = false,
  onCollapse,
  selectedKey,
  onMenuClick,
  logo,
  collapsedLogo,
}: SidebarProps) {
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const findItem = (menuItems: MenuItem[]): MenuItem | undefined => {
      for (const item of menuItems) {
        if (item.key === key) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const clickedItem = findItem(items);
    onMenuClick?.(key, clickedItem?.path);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        {collapsed ? collapsedLogo || logo : logo}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        items={mapMenuItems(items)}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}

