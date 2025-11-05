import { useAuth } from '@/context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { Tabs } from "expo-router";
import { Pressable } from 'react-native';

export default function TabLayout() {
    const { signOut } = useAuth();
    const {colors} = useTheme();
    
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                headerStyle: {
                    backgroundColor: colors.background,
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: colors.background
                }
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                    ),
                    headerRight: () => (
                        <Pressable onPress={signOut} style={{ marginRight: 15 }}>
                            <Ionicons name="log-out-outline" size={28} color="#fff" />
                        </Pressable>
                    )
                }}
            />
            <Tabs.Screen
                name='about'
                options={{
                    href: null,
                    title: 'About',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
                    )
                }}
            />
        </Tabs>
    )
}