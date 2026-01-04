import type { ThemeConfig } from 'antd';

/**
 * Ant Design theme configuration for Client Panel
 * Cyan theme for customer-facing interface
 */
export const antdTheme: ThemeConfig = {
  token: {
    // Primary colors - Cyan theme
    colorPrimary: '#13c2c2',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#13c2c2',

    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Font
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,

    // Layout
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f0f5f5',

    // Motion
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.1s',
  },
  components: {
    Layout: {
      siderBg: '#002329',
      headerBg: '#ffffff',
      bodyBg: '#f0f5f5',
    },
    Menu: {
      darkItemBg: '#002329',
      darkSubMenuItemBg: '#001214',
    },
    Card: {
      paddingLG: 24,
    },
    Table: {
      headerBg: '#e6fffb',
    },
    Button: {
      primaryShadow: 'none',
    },
  },
};

/**
 * Ant Design form validation messages
 */
export const formValidateMessages = {
  required: '${label} zorunludur',
  types: {
    email: 'Geçerli bir e-posta adresi giriniz',
    number: 'Geçerli bir sayı giriniz',
    url: 'Geçerli bir URL giriniz',
  },
  string: {
    min: '${label} en az ${min} karakter olmalıdır',
    max: '${label} en fazla ${max} karakter olabilir',
  },
  number: {
    min: '${label} en az ${min} olmalıdır',
    max: '${label} en fazla ${max} olabilir',
  },
};
