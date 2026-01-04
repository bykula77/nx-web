import type { SelectProps as AntSelectProps } from 'antd';
import type { ReactNode } from 'react';

/**
 * Select option type
 */
export interface SelectOption<T = string | number> {
  label: ReactNode;
  value: T;
  disabled?: boolean;
}

/**
 * Select component props
 */
export interface SelectProps<T = string | number>
  extends Omit<AntSelectProps<T>, 'options'> {
  /**
   * Select options
   */
  options?: SelectOption<T>[];

  /**
   * Error state
   */
  error?: boolean;

  /**
   * Error message
   */
  errorMessage?: string;

  /**
   * Full width select
   */
  fullWidth?: boolean;
}

