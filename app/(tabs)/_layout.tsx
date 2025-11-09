import { UserMenu } from '@/components/user-menu';
import { useTheme } from '@react-navigation/native';
import { Tabs } from "expo-router";
import { View } from 'react-native';
import { HelpGuideProvider } from "@/components/HelpGuide";
import { Home, Info } from 'lucide-react-native';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <HelpGuideProvider>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            borderBottomWidth: 0.2,
            borderBottomColor: colors.border,
          },
          headerTintColor: colors.text,
          tabBarStyle: {
            backgroundColor: colors.background,
            paddingTop: 4,
            marginBottom: 10
          },

          tabBarActiveTintColor: '#ffd33d',
          tabBarInactiveTintColor: colors.text,

          headerRight: () => (
            <View className="mr-4">
              <UserMenu />
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerTitleAlign: "center",
            tabBarIcon: ({ color, focused, size }) => (
              <Home size={size ?? 22} color={color} strokeWidth={focused ? 2.0 : 1.5} />
            ),
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: "About",
            headerTitleAlign: "center",
            tabBarIcon: ({ color, focused, size }) => (
              <Info size={size ?? 22} color={color} strokeWidth={focused ? 2.0 : 1.5} />
            ),
          }}
        />
      </Tabs>
    </HelpGuideProvider>
  );
}