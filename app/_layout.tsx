import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import { ZView } from "react-native-z-view";
import { Toaster } from 'sonner-native';
import "../global.css";

const InitialLayout = () => {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { colorScheme } = useColorScheme();

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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

function ZOverlay({ children }: { children: React.ReactNode }) {
  const { width, height } = Dimensions.get("screen");
  return (
    <ZView top={0} left={0} right={0} bottom={0} touchable={false}>
      <View style={{ width, height }} pointerEvents="box-none">
        {children}
      </View>
    </ZView>
  );
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME[colorScheme ?? 'dark']}>
          <AuthProvider>
            <InitialLayout />
          </AuthProvider>

          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

          <PortalHost />
          {/* <Toaster /> */}
          <Toaster ToasterOverlayWrapper={ZOverlay}/>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}