import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

const InitialLayout = () => {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const {colorScheme} = useColorScheme();

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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={colorScheme === 'dark' ? 'white' : 'black'} />
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
  const {colorScheme} = useColorScheme()

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'dark']}>
      <AuthProvider>
        <InitialLayout />
      </AuthProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <PortalHost /> 
    </ThemeProvider>
  );
}