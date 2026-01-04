import type { ResourceProps } from '@refinedev/core';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons';

/**
 * Refine resources configuration for Client Panel
 * Customer-focused resources
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
  {
    name: 'profile',
    list: '/profile',
    edit: '/profile/edit',
    meta: {
      label: 'Profilim',
      icon: <UserOutlined />,
    },
  },
  {
    name: 'orders',
    list: '/orders',
    show: '/orders/:id',
    meta: {
      label: 'Siparişlerim',
      icon: <ShoppingCartOutlined />,
    },
  },
  {
    name: 'invoices',
    list: '/invoices',
    show: '/invoices/:id',
    meta: {
      label: 'Faturalarım',
      icon: <FileTextOutlined />,
    },
  },
  {
    name: 'support-tickets',
    list: '/support-tickets',
    create: '/support-tickets/create',
    show: '/support-tickets/:id',
    meta: {
      label: 'Destek Talepleri',
      icon: <CustomerServiceOutlined />,
    },
  },
  {
    name: 'notifications',
    list: '/notifications',
    meta: {
      label: 'Bildirimler',
      icon: <BellOutlined />,
    },
  },
];

