import type { FormProps } from 'antd';
import type { ReactNode } from 'react';
import type { SelectOption } from '../../primitives/Select';

/**
 * Form field types
 */
export type FormFieldType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'switch';

/**
 * Form field configuration
 */
export interface FormFieldConfig {
  name: string;
  label?: ReactNode;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: SelectOption[];
  rules?: FormProps['fields'];
  span?: number; // Grid span (1-24)
  hidden?: boolean;
}

/**
 * FormField component props
 */
export interface FormFieldProps {
  config: FormFieldConfig;
  error?: string;
}

/**
 * FormBuilder component props
 */
export interface FormBuilderProps<T = Record<string, unknown>>
  extends Omit<FormProps<T>, 'fields'> {
  /**
   * Form fields configuration
   */
  fields: FormFieldConfig[];

  /**
   * Submit button text
   */
  submitText?: string;

  /**
   * Cancel button text
   */
  cancelText?: string;

  /**
   * Show cancel button
   */
  showCancel?: boolean;

  /**
   * On cancel callback
   */
  onCancel?: () => void;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Form columns (for grid layout)
   */
  columns?: 1 | 2 | 3 | 4;
}

