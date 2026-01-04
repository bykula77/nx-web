import { PageHeader } from './PageHeader';
import { LoadingState } from '../../patterns/LoadingState';
import type { PageLayoutProps } from './PageLayout.types';

/**
 * PageLayout component - page wrapper with header and content
 */
export function PageLayout({
  children,
  loading = false,
  fullWidth,
  title,
  subtitle,
  breadcrumbs,
  actions,
  onBreadcrumbClick,
  showBack,
  onBack,
}: PageLayoutProps) {
  return (
    <div style={{ padding: fullWidth ? 0 : undefined }}>
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        actions={actions}
        onBreadcrumbClick={onBreadcrumbClick}
        showBack={showBack}
        onBack={onBack}
      />

      <LoadingState loading={loading} mode="skeleton" skeletonRows={5}>
        {children}
      </LoadingState>
    </div>
  );
}

