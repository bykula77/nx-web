import { AuthPage } from '@refinedev/antd';
import { Typography } from 'antd';

const { Title } = Typography;

/**
 * Login page component
 * Uses Refine's AuthPage with customizations
 */
export function LoginPage() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div
        style={{
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        <Title
          level={2}
          style={{
            color: '#fff',
            margin: 0,
            fontWeight: 600,
          }}
        >
          Backoffice
        </Title>
        <Typography.Text
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 16,
          }}
        >
          Admin Panel
        </Typography.Text>
      </div>

      <AuthPage
        type="login"
        title={false}
        formProps={{
          initialValues: {
            email: '',
            password: '',
          },
        }}
        contentProps={{
          style: {
            width: 400,
            padding: 32,
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        }}
        renderContent={(content) => (
          <div>
            <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
              Giriş Yap
            </Title>
            {content}
          </div>
        )}
      />
    </div>
  );
}

