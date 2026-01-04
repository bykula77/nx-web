import { Skeleton } from 'antd';
import { Spinner } from '../../primitives/Spinner';
import type { LoadingStateProps } from './LoadingState.types';

/**
 * LoadingState component - handles loading states with spinner or skeleton
 */
export function LoadingState({
  loading,
  mode = 'spinner',
  children,
  overlay,
  text,
  fullHeight,
  skeletonRows = 3,
}: LoadingStateProps) {
  if (!loading) {
    return <>{children}</>;
  }

  if (overlay && children) {
    return (
      <div style={{ position: 'relative' }}>
        {children}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 10,
          }}
        >
          <Spinner size="lg" tip={text} />
        </div>
      </div>
    );
  }

  if (mode === 'skeleton') {
    return (
      <div style={{ padding: '24px' }}>
        <Skeleton active paragraph={{ rows: skeletonRows }} />
      </div>
    );
  }

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
      <Spinner size="lg" tip={text} />
    </div>
  );
}

