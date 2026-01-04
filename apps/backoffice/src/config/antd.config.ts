import type { ThemeConfig } from 'antd';

/**
 * Ant Design theme configuration
 */
export const antdTheme: ThemeConfig = {
  token: {
    // Primary colors
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',

    // Border radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // Font
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,

    // Layout
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f5f5',

    // Motion
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.1s',
  },
  components: {
    Layout: {
      siderBg: '#001529',
      headerBg: '#ffffff',
      bodyBg: '#f5f5f5',
    },
    Menu: {
      darkItemBg: '#001529',
      darkSubMenuItemBg: '#000c17',
    },
    Card: {
      paddingLG: 24,
    },
    Table: {
      headerBg: '#fafafa',
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

