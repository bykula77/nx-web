import { Modal as AntModal } from 'antd';
import type { ModalProps } from './Modal.types';

/**
 * Modal component - wraps Ant Design Modal with simplified API
 */
export function Modal({
  children,
  hideFooter,
  loading,
  okButtonProps,
  ...props
}: ModalProps) {
  return (
    <AntModal
      {...props}
      footer={hideFooter ? null : undefined}
      okButtonProps={{
        ...okButtonProps,
        loading,
      }}
    >
      {children}
    </AntModal>
  );
}

