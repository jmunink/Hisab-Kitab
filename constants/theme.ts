import { MD3LightTheme, configureFonts } from 'react-native-paper';

const colors = {
  primary: {
    main: '#6366F1', // Indigo
    light: '#818CF8',
    dark: '#4F46E5',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#EC4899', // Pink
    light: '#F472B6',
    dark: '#DB2777',
    contrast: '#FFFFFF',
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

const fontConfig = {
  fontFamily: 'Inter-Regular',
  headingFontFamily: 'Inter-Bold',
};

const customFonts = configureFonts({
  config: {
    default: {
      regular: {
        fontFamily: 'Inter-Regular',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'Inter-Medium',
        fontWeight: 'normal',
      },
      semiBold: {
        fontFamily: 'Inter-SemiBold',
        fontWeight: 'normal',
      },
      bold: {
        fontFamily: 'Inter-Bold',
        fontWeight: 'normal',
      },
    },
  },
});

export const theme = {
  ...MD3LightTheme,
  fonts: customFonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary.main,
    primaryContainer: colors.primary.light,
    secondary: colors.secondary.main,
    secondaryContainer: colors.secondary.light,
    error: colors.error.main,
    onPrimary: colors.primary.contrast,
    onSecondary: colors.secondary.contrast,
    background: colors.grey[50],
    surface: '#FFFFFF',
    text: colors.grey[900],
    placeholder: colors.grey[500],
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  roundness: 12,
};

export const darkTheme = {
  ...theme,
  dark: true,
  colors: {
    ...theme.colors,
    primary: colors.primary.light,
    primaryContainer: colors.primary.dark,
    secondary: colors.secondary.light,
    secondaryContainer: colors.secondary.dark,
    background: colors.grey[900],
    surface: colors.grey[800],
    text: colors.grey[50],
    placeholder: colors.grey[400],
  },
};