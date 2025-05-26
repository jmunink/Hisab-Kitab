import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { theme, darkTheme } from '@/constants/theme';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeType: ThemeType;
  theme: typeof theme;
  setThemeType: (type: ThemeType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  themeType: 'system',
  theme,
  setThemeType: () => {},
  isDark: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeType, setThemeType] = useState<ThemeType>('system');
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Load saved theme preference
  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeType');
        if (savedTheme) {
          setThemeType(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      }
    })();
  }, []);

  // Update dark mode based on theme type and system preference
  useEffect(() => {
    if (themeType === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeType === 'dark');
    }
  }, [themeType, systemColorScheme]);

  // Save theme preference
  const handleSetThemeType = async (type: ThemeType) => {
    setThemeType(type);
    try {
      await AsyncStorage.setItem('themeType', type);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const currentTheme = isDark ? darkTheme : theme;

  return (
    <ThemeContext.Provider
      value={{
        themeType,
        theme: currentTheme,
        setThemeType: handleSetThemeType,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);