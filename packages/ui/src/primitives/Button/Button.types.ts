import type { ButtonProps as AntButtonProps } from 'antd';
import type { ReactNode } from 'react';

/**
 * Button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/**
 * Button component props
 */
export interface ButtonProps extends Omit<AntButtonProps, 'type' | 'danger' | 'variant'> {
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button content
   */
  children?: ReactNode;

  /**
   * Full width button
   */
  fullWidth?: boolean;
}

