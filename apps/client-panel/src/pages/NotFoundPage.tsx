import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

/**
 * 404 Not Found page component
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Aradığınız sayfa bulunamadı."
      extra={
        <Button type="primary" onClick={() => navigate('/dashboard')}>
          Dashboard&apos;a Dön
        </Button>
      }
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    />
  );
}

