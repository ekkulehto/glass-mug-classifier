import { Stack } from "expo-router";
import { View} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Text } from '@/components/ui/text';
import { showLoginSuccessToast } from "@/lib/toasts";
import { useRef, useEffect } from "react";

export default function AuthCallback() {
  const { colors } = useTheme();
  
    const fired = useRef(false);
  
    useEffect(() => {
      if (fired.current) return;
      fired.current = true;
  
      showLoginSuccessToast();
    }, []);
  
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center" style={{backgroundColor: colors.background}}>
        <Text style={{color: colors.primary}}>Finishing sign-in…</Text>
      </View>
    </>
  );
}
