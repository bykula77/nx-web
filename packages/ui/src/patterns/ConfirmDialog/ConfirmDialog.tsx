import { Modal } from 'antd';
import {
  ExclamationCircleFilled,
  DeleteFilled,
  InfoCircleFilled,
} from '@ant-design/icons';
import type { ConfirmDialogProps, ConfirmDialogVariant } from './ConfirmDialog.types';

const variantConfig: Record<
  ConfirmDialogVariant,
  { icon: React.ReactNode; okType: 'primary' | 'danger' }
> = {
  delete: {
    icon: <DeleteFilled style={{ color: '#ff4d4f' }} />,
    okType: 'danger',
  },
  warning: {
    icon: <ExclamationCircleFilled style={{ color: '#faad14' }} />,
    okType: 'primary',
  },
  info: {
    icon: <InfoCircleFilled style={{ color: '#1890ff' }} />,
    okType: 'primary',
  },
};

/**
 * Imperative confirm dialog function
 */
export function confirm({
  variant = 'warning',
  title,
  content,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  onConfirm,
  onCancel,
  ...props
}: ConfirmDialogProps): void {
  const config = variantConfig[variant];

  Modal.confirm({
    ...props,
    title,
    content,
    icon: config.icon,
    okText: confirmText,
    cancelText,
    okType: config.okType,
    onOk: onConfirm,
    onCancel,
  });
}

/**
 * ConfirmDialog component - can be used declaratively if needed
 */
export function ConfirmDialog(props: ConfirmDialogProps) {
  // This component is primarily used imperatively via the confirm function
  // But can be extended for declarative usage if needed
  confirm(props);
  return null;
}

