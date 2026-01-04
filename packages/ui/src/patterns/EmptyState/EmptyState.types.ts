import type { EmptyProps } from 'antd';
import type { ReactNode } from 'react';

/**
 * EmptyState component props
 */
export interface EmptyStateProps extends Omit<EmptyProps, 'description'> {
  /**
   * Title text
   */
  title?: ReactNode;

  /**
   * Description text
   */
  description?: ReactNode;

  /**
   * Action button text
   */
  actionText?: string;

  /**
   * Action button callback
   */
  onAction?: () => void;

  /**
   * Custom icon
   */
  icon?: ReactNode;

  /**
   * Full height container
   */
  fullHeight?: boolean;
}

