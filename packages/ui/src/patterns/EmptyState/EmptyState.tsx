import { Empty, Typography } from 'antd';
import { Button } from '../../primitives/Button';
import type { EmptyStateProps } from './EmptyState.types';

const { Text } = Typography;

/**
 * EmptyState component - displays empty state with optional action
 */
export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon,
  fullHeight,
  ...props
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        ...(fullHeight && { minHeight: '400px' }),
      }}
    >
      <Empty
        {...props}
        image={icon || Empty.PRESENTED_IMAGE_SIMPLE}
        description={null}
      />
      {title && (
        <Text
          strong
          style={{
            fontSize: '16px',
            marginTop: '16px',
            display: 'block',
          }}
        >
          {title}
        </Text>
      )}
      {description && (
        <Text
          type="secondary"
          style={{
            marginTop: '8px',
            textAlign: 'center',
            display: 'block',
          }}
        >
          {description}
        </Text>
      )}
      {actionText && onAction && (
        <Button
          variant="primary"
          onClick={onAction}
          style={{ marginTop: '24px' }}
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}

