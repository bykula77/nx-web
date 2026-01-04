import type { ModalFuncProps } from 'antd';
import type { ReactNode } from 'react';

/**
 * Confirm dialog variants
 */
export type ConfirmDialogVariant = 'delete' | 'warning' | 'info';

/**
 * ConfirmDialog component props
 */
export interface ConfirmDialogProps extends Omit<ModalFuncProps, 'type'> {
  /**
   * Dialog variant
   * @default 'warning'
   */
  variant?: ConfirmDialogVariant;

  /**
   * Dialog title
   */
  title: ReactNode;

  /**
   * Dialog content/message
   */
  content: ReactNode;

  /**
   * Confirm button text
   */
  confirmText?: string;

  /**
   * Cancel button text
   */
  cancelText?: string;

  /**
   * On confirm callback
   */
  onConfirm?: () => void | Promise<void>;

  /**
   * On cancel callback
   */
  onCancel?: () => void;
}

