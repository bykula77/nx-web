import type { SpinProps } from 'antd';

/**
 * Spinner size variants
 */
export type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Spinner component props
 */
export interface SpinnerProps extends Omit<SpinProps, 'size'> {
  /**
   * Spinner size
   * @default 'md'
   */
  size?: SpinnerSize;

  /**
   * Center the spinner in its container
   */
  centered?: boolean;

  /**
   * Full screen overlay mode
   */
  fullScreen?: boolean;
}

