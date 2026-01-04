import { Button as AntButton } from 'antd';
import type { ButtonProps } from './Button.types';

/**
 * Button component - wraps Ant Design Button with simplified variant API
 */
export function Button({
  variant = 'primary',
  fullWidth,
  children,
  style,
  ...props
}: ButtonProps) {
  const getAntButtonProps = () => {
    switch (variant) {
      case 'primary':
        return { type: 'primary' as const };
      case 'secondary':
        return { type: 'default' as const };
      case 'danger':
        return { type: 'primary' as const, danger: true };
      case 'ghost':
        return { type: 'text' as const };
      default:
        return { type: 'primary' as const };
    }
  };

  return (
    <AntButton
      {...getAntButtonProps()}
      {...props}
      style={{
        ...style,
        ...(fullWidth && { width: '100%' }),
      }}
    >
      {children}
    </AntButton>
  );
}

