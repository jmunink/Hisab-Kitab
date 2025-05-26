import { MD3LightTheme, configureFonts } from 'react-native-paper';

// Define the color palette
const colors = {
  primary: {
    main: '#0BB8A4', // Teal
    light: '#49E4D3',
    dark: '#078F7E',
    contrast: '#FFFFFF',
  },
  secondary: {
    main: '#FF5A5F', // Coral
    light: '#FF8A8F',
    dark: '#E02A30',
    contrast: '#FFFFFF',
  },
  success: {
    main: '#4CAF50',
    light: '#7BC67E',
    dark: '#3B873E',
  },
  warning: {
    main: '#FFC107',
    light: '#FFD54F',
    dark: '#FFA000',
  },
  error: {
    main: '#F44336',
    light: '#EF9A9A',
    dark: '#C62828',
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

// Define custom font configuration
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

// Create theme
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
  roundness: 8,
};

// Dark theme
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