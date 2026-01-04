import { Form, Input, Select, Button, message } from 'antd';
import type { CreateUserCommand } from './create-user.command';
import { UserRole, USER_ROLE_LABELS, PASSWORD_MIN_LENGTH } from '../../types';

interface CreateUserFormProps {
  onSubmit: (values: CreateUserCommand) => Promise<void>;
  isLoading?: boolean;
  showRoleSelect?: boolean;
}

/**
 * Create user form component
 */
export function CreateUserForm({
  onSubmit,
  isLoading = false,
  showRoleSelect = true,
}: CreateUserFormProps) {
  const [form] = Form.useForm<CreateUserCommand>();

  const handleFinish = async (values: CreateUserCommand) => {
    try {
      await onSubmit(values);
      form.resetFields();
      message.success('Kullanıcı başarıyla oluşturuldu');
    } catch {
      message.error('Kullanıcı oluşturulurken bir hata oluştu');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item
        name="fullName"
        label="Ad Soyad"
        rules={[
          { required: true, message: 'Ad soyad zorunludur' },
          { min: 2, message: 'Ad soyad en az 2 karakter olmalıdır' },
          { max: 100, message: 'Ad soyad en fazla 100 karakter olabilir' },
        ]}
      >
        <Input placeholder="Kullanıcının adı soyadı" />
      </Form.Item>

      <Form.Item
        name="email"
        label="E-posta"
        rules={[
          { required: true, message: 'E-posta zorunludur' },
          { type: 'email', message: 'Geçerli bir e-posta adresi giriniz' },
        ]}
      >
        <Input placeholder="ornek@email.com" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Şifre"
        rules={[
          { required: true, message: 'Şifre zorunludur' },
          { min: PASSWORD_MIN_LENGTH, message: `Şifre en az ${PASSWORD_MIN_LENGTH} karakter olmalıdır` },
          {
            pattern: /[A-Z]/,
            message: 'Şifre en az bir büyük harf içermelidir',
          },
          {
            pattern: /[a-z]/,
            message: 'Şifre en az bir küçük harf içermelidir',
          },
          {
            pattern: /[0-9]/,
            message: 'Şifre en az bir rakam içermelidir',
          },
        ]}
      >
        <Input.Password placeholder="Güçlü bir şifre giriniz" />
      </Form.Item>

      {showRoleSelect && (
        <Form.Item
          name="role"
          label="Rol"
          initialValue={UserRole.USER}
        >
          <Select>
            {Object.entries(USER_ROLE_LABELS).map(([value, label]) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item
        name="phone"
        label="Telefon"
        rules={[
          { max: 20, message: 'Telefon numarası en fazla 20 karakter olabilir' },
        ]}
      >
        <Input placeholder="(5XX) XXX XX XX" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Kullanıcı Oluştur
        </Button>
      </Form.Item>
    </Form>
  );
}

