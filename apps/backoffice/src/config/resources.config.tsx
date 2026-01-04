import type { ResourceProps } from '@refinedev/core';
import { DashboardOutlined } from '@ant-design/icons';

/**
 * Refine resources configuration
 * Add new resources here as domains are created
 */
export const resources: ResourceProps[] = [
  {
    name: 'dashboard',
    list: '/dashboard',
    meta: {
      label: 'Dashboard',
      icon: <DashboardOutlined />,
    },
  },

  // Placeholder resources - uncomment and customize as domains are created
  /*
  {
    name: 'users',
    list: '/users',
    create: '/users/create',
    edit: '/users/:id/edit',
    show: '/users/:id',
    meta: {
      label: 'Kullanıcılar',
      icon: <UserOutlined />,
      canDelete: true,
    },
  },
  {
    name: 'posts',
    list: '/posts',
    create: '/posts/create',
    edit: '/posts/:id/edit',
    show: '/posts/:id',
    meta: {
      label: 'Yazılar',
      icon: <FileTextOutlined />,
      canDelete: true,
    },
  },
  {
    name: 'settings',
    list: '/settings',
    meta: {
      label: 'Ayarlar',
      icon: <SettingOutlined />,
    },
  },
  */
];

