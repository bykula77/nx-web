import {
  Form,
  Input,
  InputNumber,
  Select,
  Checkbox,
  Radio,
  DatePicker,
  Switch,
} from 'antd';
import type { FormFieldProps } from './FormBuilder.types';

const { TextArea, Password } = Input;

/**
 * FormField component - renders form fields based on configuration
 */
export function FormField({ config, error }: FormFieldProps) {
  const { name, label, type, placeholder, required, disabled, options, hidden } =
    config;

  if (hidden) return null;

  const renderField = () => {
    switch (type) {
      case 'text':
      case 'email':
        return (
          <Input
            placeholder={placeholder}
            disabled={disabled}
            type={type}
          />
        );

      case 'password':
        return <Password placeholder={placeholder} disabled={disabled} />;

      case 'number':
        return (
          <InputNumber
            placeholder={placeholder}
            disabled={disabled}
            style={{ width: '100%' }}
          />
        );

      case 'textarea':
        return (
          <TextArea
            placeholder={placeholder}
            disabled={disabled}
            rows={4}
          />
        );

      case 'select':
        return (
          <Select
            placeholder={placeholder}
            disabled={disabled}
            options={options}
            style={{ width: '100%' }}
          />
        );

      case 'checkbox':
        return <Checkbox disabled={disabled}>{label}</Checkbox>;

      case 'radio':
        return (
          <Radio.Group disabled={disabled}>
            {options?.map((opt) => (
              <Radio key={String(opt.value)} value={opt.value}>
                {opt.label}
              </Radio>
            ))}
          </Radio.Group>
        );

      case 'date':
        return (
          <DatePicker
            placeholder={placeholder}
            disabled={disabled}
            style={{ width: '100%' }}
          />
        );

      case 'switch':
        return <Switch disabled={disabled} />;

      default:
        return (
          <Input placeholder={placeholder} disabled={disabled} />
        );
    }
  };

  return (
    <Form.Item
      name={name}
      label={type !== 'checkbox' ? label : undefined}
      required={required}
      validateStatus={error ? 'error' : undefined}
      help={error}
      valuePropName={type === 'checkbox' || type === 'switch' ? 'checked' : 'value'}
    >
      {renderField()}
    </Form.Item>
  );
}

