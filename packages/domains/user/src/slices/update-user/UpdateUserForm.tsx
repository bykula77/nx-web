import { useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import type { UpdateUserCommand } from './update-user.command';
import type { User } from '../../types/user.entity';
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from '../../types';

interface UpdateUserFormProps {
  user: User;
  onSubmit: (values: UpdateUserCommand) => Promise<void>;
  isLoading?: boolean;
  showRoleSelect?: boolean;
  showStatusSelect?: boolean;
}

/**
 * Update user form component
 */
export function UpdateUserForm({
  user,
  onSubmit,
  isLoading = false,
  showRoleSelect = true,
  showStatusSelect = true,
}: UpdateUserFormProps) {
  const [form] = Form.useForm<Omit<UpdateUserCommand, 'id'>>();

  useEffect(() => {
    form.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
    });
  }, [user, form]);

  const handleFinish = async (values: Omit<UpdateUserCommand, 'id'>) => {
    try {
      await onSubmit({ id: user.id, ...values });
      message.success('Kullanıcı başarıyla güncellendi');
    } catch {
      message.error('Kullanıcı güncellenirken bir hata oluştu');
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

      {showRoleSelect && (
        <Form.Item name="role" label="Rol">
          <Select>
            {Object.entries(USER_ROLE_LABELS).map(([value, label]) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {showStatusSelect && (
        <Form.Item name="status" label="Durum">
          <Select>
            {Object.entries(USER_STATUS_LABELS).map(([value, label]) => (
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
          Kullanıcıyı Güncelle
        </Button>
      </Form.Item>
    </Form>
  );
}

