import { Form, Row, Col, Space } from 'antd';
import { Button } from '../../primitives/Button';
import { FormField } from './FormField';
import type { FormBuilderProps } from './FormBuilder.types';

/**
 * FormBuilder component - schema-driven form builder
 */
export function FormBuilder<T = Record<string, unknown>>({
  fields,
  submitText = 'Kaydet',
  cancelText = 'İptal',
  showCancel = false,
  onCancel,
  loading,
  columns = 1,
  ...formProps
}: FormBuilderProps<T>) {
  const colSpan = 24 / columns;

  return (
    <Form<T> layout="vertical" {...formProps}>
      <Row gutter={16}>
        {fields.map((field) => (
          <Col key={field.name} span={field.span ?? colSpan}>
            <FormField config={field} />
          </Col>
        ))}
      </Row>

      <Form.Item>
        <Space>
          <Button variant="primary" htmlType="submit" loading={loading}>
            {submitText}
          </Button>
          {showCancel && (
            <Button variant="secondary" onClick={onCancel}>
              {cancelText}
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
}

