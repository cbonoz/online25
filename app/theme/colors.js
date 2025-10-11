// SafeSend Brand Color Palette
export const colors = {
  // Primary brand colors
  primary: '#ec348b',
  primaryLight: '#f158a0',
  primaryDark: '#d12978',
  
  // Secondary colors
  secondary: '#722ed1',
  secondaryLight: '#9254de',
  secondaryDark: '#531dab',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Status colors
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',
  
  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    tertiary: '#fafafa',
    gradient: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)',
    gradientPrimary: 'linear-gradient(135deg, #ec348b 0%, #722ed1 100%)',
  },
  
  // Brand specific colors
  brand: {
    pink: '#fde7f3', // Light pink background
    purple: '#f9f0ff', // Light purple background
    green: '#f6ffed', // Light green background
  }
};

// Ant Design theme configuration
export const antdTheme = {
  token: {
    colorPrimary: colors.primary,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    colorInfo: colors.info,
    colorLink: colors.primary,
    colorLinkHover: colors.primaryLight,
    colorLinkActive: colors.primaryDark,
    borderRadius: 6,
    colorBgContainer: colors.white,
    colorBgLayout: colors.background.secondary,
  },
  components: {
    Button: {
      colorPrimary: colors.primary,
      colorPrimaryHover: colors.primaryLight,
      colorPrimaryActive: colors.primaryDark,
      borderRadius: 6,
      fontWeight: 600,
    },
    Input: {
      borderRadius: 6,
      colorPrimary: colors.primary,
    },
    Card: {
      borderRadius: 12,
    },
    Steps: {
      colorPrimary: colors.primary,
    },
    Select: {
      colorPrimary: colors.primary,
      borderRadius: 6,
    },
    Form: {
      labelColor: colors.gray[700],
    },
  },
};

export default colors;
