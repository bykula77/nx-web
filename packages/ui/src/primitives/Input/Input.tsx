import { Input as AntInput } from 'antd';
import type { InputProps } from './Input.types';

/**
 * Input component - wraps Ant Design Input with error state support
 */
export function Input({
  error,
  errorMessage,
  fullWidth,
  style,
  ...props
}: InputProps) {
  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      <AntInput
        {...props}
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

