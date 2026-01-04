import { Card, Typography } from 'antd';
import type { AuthLayoutProps } from './AuthLayout.types';

const { Title, Text } = Typography;

/**
 * AuthLayout component - centered layout for login/register pages
 */
export function AuthLayout({
  children,
  logo,
  title,
  subtitle,
  footer,
  backgroundImage,
  maxWidth = 400,
}: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: backgroundImage
          ? `url(${backgroundImage}) center/cover no-repeat`
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          borderRadius: '12px',
        }}
        styles={{
          body: { padding: '32px' },
        }}
      >
        {logo && (
          <div
            style={{
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            {logo}
          </div>
        )}

        {title && (
          <Title
            level={3}
            style={{
              textAlign: 'center',
              marginBottom: subtitle ? '8px' : '24px',
            }}
          >
            {title}
          </Title>
        )}

        {subtitle && (
          <Text
            type="secondary"
            style={{
              display: 'block',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            {subtitle}
          </Text>
        )}

        {children}

        {footer && (
          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
            }}
          >
            {footer}
          </div>
        )}
      </Card>
    </div>
  );
}

