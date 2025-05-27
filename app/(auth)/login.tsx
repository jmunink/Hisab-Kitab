import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import { useTheme } from '@/contexts/ThemeContext';
import { useForm, Controller } from 'react-hook-form';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  useWarmUpBrowser();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)/home');
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/oauth-callback",
        redirectUrlComplete: "/(tabs)/home",
      });
      
      console.log(JSON.stringify(result, null, 2));
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Google sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignup = () => {
    router.push('/(auth)/signup');
  };

  return (
    <ScrollView 
      contentContainerStyle={[
        styles.container, 
        { backgroundColor: theme.colors.background }
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Welcome Back</Text>
        <Text style={[styles.subtitle, { color: theme.colors.placeholder }]}>
          Sign in to continue
        </Text>
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      )}
      
      <View style={styles.form}>
        <Controller
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              mode="outlined"
              style={styles.input}
              error={!!errors.email}
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errors.email.message}
          </Text>
        )}
        
        <Controller
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              error={!!errors.password}
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {errors.password.message}
          </Text>
        )}
        
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Sign In
        </Button>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.placeholder }]} />
          <Text style={[styles.dividerText, { color: theme.colors.placeholder }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.placeholder }]} />
        </View>

        <Button
          mode="outlined"
          onPress={handleGoogleSignIn}
          loading={isLoading}
          disabled={isLoading}
          style={styles.googleButton}
          contentStyle={styles.buttonContent}
          icon="google"
        >
          Sign in with Google
        </Button>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.text }]}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={goToSignup}>
          <Text style={[styles.footerLink, { color: theme.colors.primary }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  button: {
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.2,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  googleButton: {
    borderRadius: 12,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    marginRight: 4,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footerLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
    marginTop: -8,
  },
});