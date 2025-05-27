import { useCallback } from "react";
import { Text, View } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function OAuthCallback() {
  const { handleOAuthCallback } = useOAuth();
  const router = useRouter();

  const handleComplete = useCallback(() => {
    router.replace('/(tabs)/home');
  }, [router]);

  useEffect(() => {
    handleOAuthCallback({
      afterComplete: handleComplete,
    });
  }, [handleComplete, handleOAuthCallback]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Completing authentication...</Text>
    </View>
  );
}