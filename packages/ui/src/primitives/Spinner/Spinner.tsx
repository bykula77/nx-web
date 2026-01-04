import { Spin } from 'antd';
import type { SpinnerProps, SpinnerSize } from './Spinner.types';

const sizeMap: Record<SpinnerSize, 'small' | 'default' | 'large'> = {
  sm: 'small',
  md: 'default',
  lg: 'large',
};

/**
 * Spinner component - wraps Ant Design Spin with size variants
 */
export function Spinner({
  size = 'md',
  centered,
  fullScreen,
  ...props
}: SpinnerProps) {
  const spinner = <Spin {...props} size={sizeMap[size]} />;

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999,
        }}
      >
        {spinner}
      </div>
    );
  }

  if (centered) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}

