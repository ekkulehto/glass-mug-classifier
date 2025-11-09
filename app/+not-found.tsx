import { Stack, Link } from "expo-router";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Text } from "@/components/ui/text";
import { Button as UIButton } from "@/components/ui/button";

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center gap-4" style={{ backgroundColor: colors.background }}>
        <Text className="text-sm font-semibold" style={{ color: colors.text }}>
          The page you’re looking for wasn’t found.
        </Text>

        {/* RNR Button linkkinä takaisin päälayouttiin */}
        <Link href="/(tabs)" asChild>
          <UIButton size={'sm'}>
            <Text>Go back to Home</Text>
          </UIButton>
        </Link>
      </View>
    </>
  );
}
