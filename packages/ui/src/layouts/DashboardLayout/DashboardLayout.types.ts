import type { ReactNode } from 'react';

/**
 * Menu item configuration
 */
export interface MenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: MenuItem[];
  path?: string;
}

/**
 * Sidebar component props
 */
export interface SidebarProps {
  /**
   * Menu items
   */
  items: MenuItem[];

  /**
   * Collapsed state
   */
  collapsed?: boolean;

  /**
   * On collapse change
   */
  onCollapse?: (collapsed: boolean) => void;

  /**
   * Selected menu key
   */
  selectedKey?: string;

  /**
   * On menu item click
   */
  onMenuClick?: (key: string, path?: string) => void;

  /**
   * Logo component
   */
  logo?: ReactNode;

  /**
   * Collapsed logo component
   */
  collapsedLogo?: ReactNode;
}

/**
 * Header component props
 */
export interface HeaderProps {
  /**
   * User info
   */
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };

  /**
   * On logout callback
   */
  onLogout?: () => void;

  /**
   * Extra actions
   */
  actions?: ReactNode;

  /**
   * On sidebar toggle
   */
  onSidebarToggle?: () => void;

  /**
   * Sidebar collapsed state
   */
  sidebarCollapsed?: boolean;
}

/**
 * DashboardLayout component props
 */
export interface DashboardLayoutProps {
  /**
   * Page content
   */
  children: ReactNode;

  /**
   * Sidebar props
   */
  sidebarProps: SidebarProps;

  /**
   * Header props
   */
  headerProps?: HeaderProps;

  /**
   * Show header
   */
  showHeader?: boolean;
}

