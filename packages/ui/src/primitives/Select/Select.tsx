import { Select as AntSelect } from 'antd';
import type { SelectProps } from './Select.types';

/**
 * Select component - wraps Ant Design Select with error state support
 */
export function Select<T = string | number>({
  options,
  error,
  errorMessage,
  fullWidth,
  style,
  ...props
}: SelectProps<T>) {
  // Convert options to Ant Design format
  const antOptions = options?.map((opt) => ({
    label: opt.label,
    value: opt.value as string | number,
    disabled: opt.disabled,
  }));

  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      <AntSelect
        {...props}
        options={antOptions}
        status={error ? 'error' : undefined}
        style={{
          ...style,
          ...(fullWidth && { width: '100%' }),
        }}
      />
      {error && errorMessage && (
        <div
          style={{
            color: '#ff4d4f',
            fontSize: '12px',
            marginTop: '4px',
          }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}

