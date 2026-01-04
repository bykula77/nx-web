import type { ModalProps as AntModalProps } from 'antd';
import type { ReactNode } from 'react';

/**
 * Modal component props
 */
export interface ModalProps extends AntModalProps {
  /**
   * Modal content
   */
  children?: ReactNode;

  /**
   * Hide the footer
   */
  hideFooter?: boolean;

  /**
   * Loading state for confirm button
   */
  loading?: boolean;
}

