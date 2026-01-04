import type { InputProps as AntInputProps } from 'antd';

/**
 * Input component props
 */
export interface InputProps extends AntInputProps {
  /**
   * Error state - shows error styling
   */
  error?: boolean;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Full width input
   */
  fullWidth?: boolean;
}

