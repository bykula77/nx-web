import { AuthPage } from '@refinedev/antd';
import { Typography } from 'antd';

const { Title } = Typography;

/**
 * Login page component for Client Panel
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
        background: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',
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
          Müşteri Paneli
        </Title>
        <Typography.Text
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 16,
          }}
        >
          Hesabınıza giriş yapın
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
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        }}
        renderContent={(content) => (
          <div>
            <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
              Müşteri Girişi
            </Title>
            {content}
          </div>
        )}
      />
    </div>
  );
}

