import type { ReactNode } from 'react';

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: ReactNode;
  path?: string;
}

/**
 * PageHeader component props
 */
export interface PageHeaderProps {
  /**
   * Page title
   */
  title: ReactNode;

  /**
   * Page subtitle
   */
  subtitle?: ReactNode;

  /**
   * Breadcrumb items
   */
  breadcrumbs?: BreadcrumbItem[];

  /**
   * Action buttons
   */
  actions?: ReactNode;

  /**
   * On breadcrumb click
   */
  onBreadcrumbClick?: (path: string) => void;

  /**
   * Back button
   */
  showBack?: boolean;

  /**
   * On back click
   */
  onBack?: () => void;
}

/**
 * PageLayout component props
 */
export interface PageLayoutProps extends PageHeaderProps {
  /**
   * Page content
   */
  children: ReactNode;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Full width content (no padding)
   */
  fullWidth?: boolean;
}

