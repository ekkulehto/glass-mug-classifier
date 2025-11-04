import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const InitialLayout = () => {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';

    if (session && !inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!session && inAuthGroup) {
      router.replace('./login');
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#25292e' }}>
            <ActivityIndicator size="large" color="#ffd33d" />
        </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='login' />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
      <StatusBar style='light'/>
    </>
  );
}