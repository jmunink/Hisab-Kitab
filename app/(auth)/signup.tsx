import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { useTheme } from '@/contexts/ThemeContext';
import { Controller, useForm } from 'react-hook-form';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupScreen() {
  useWarmUpBrowser();
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<SignupForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const password = watch('password');

  const onSubmit = async (data: SignupForm) => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      setError(null);
      
      await signUp.create({
        firstName: data.name,
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyCode = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)/home');
      } else {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/oauth-callback",
        redirectUrlComplete: "/(tabs)/home",
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Google sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    router.push('/(auth)/login');
  };

  if (verifying) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Verify your email</Text>
        <Text style={[styles.subtitle, { color: theme.colors.placeholder }]}>
          Enter the verification code sent to your email
        </Text>
        
        {error && (
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        )}
        
        <TextInput
          label="Verification Code"
          value={code}
          onChangeText={setCode}
          mode="outlined"
          style={styles.input}
          keyboardType="number-pad"
        />
        
        <Button
          mode="contained"
          onPress={onVerifyCode}
          loading={isLoading}
          disabled={isLoading || !code}
          style={styles.button}
        >
          Verify Email
        </Button>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={[
        styles.container, 
        { backgroundColor: theme.colors.background }
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <View style={styles.form}>
        <Controller
          control={control}
          rules={{
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Full Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              mode="outlined"
              style={styles.input}
              error={!!errors.name}
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}
        
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
          <Text style={styles.errorText}>{errors.email.message}</Text>
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
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}
        
        <Controller
          control={control}
          rules={{
            required: 'Confirm Password is required',
            validate: value => 
              value === password || 'Passwords do not match',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Confirm Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              error={!!errors.confirmPassword}
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}
        
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Sign Up
        </Button>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.placeholder }]} />
          <Text style={[styles.dividerText, { color: theme.colors.placeholder }]}>or</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.placeholder }]} />
        </View>

        <Button
          mode="outlined"
          onPress={handleGoogleSignUp}
          loading={isLoading}
          disabled={isLoading}
          style={styles.googleButton}
          icon="google"
        >
          Sign up with Google
        </Button>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={goToLogin}>
          <Text style={[styles.footerLink, { color: theme.colors.primary }]}>
            Sign In
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
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  form: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    padding: 4,
    marginTop: 8,
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
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    marginRight: 4,
  },
  footerLink: {
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    marginTop: -8,
  },
});