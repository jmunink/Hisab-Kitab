import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown 
} from 'react-native-reanimated';

export default function SplashScreen() {
  const { isLoading, user } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      // Ensure a minimum splash screen display time
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!isLoading) {
        if (user) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/login');
        }
      }
    };

    checkAuth();
  }, [isLoading, user, router]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Animated.View 
        entering={FadeIn.duration(800)} 
        exiting={FadeOut.duration(300)}
        style={styles.logoContainer}
      >
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg' }} 
          style={styles.logo} 
        />
        <Animated.Text 
          entering={SlideInDown.delay(300).duration(800)}
          style={[styles.appName, { color: theme.colors.onPrimary }]}
        >
          SplitWise
        </Animated.Text>
        <Text style={[styles.tagline, { color: theme.colors.onPrimary }]}>
          Split expenses with friends & family
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    opacity: 0.8,
  },
});