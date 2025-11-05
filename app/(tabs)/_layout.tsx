import { UserMenu } from '@/components/user-menu';
import { useAuth } from '@/context/AuthContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { Tabs } from "expo-router";
import { View } from 'react-native';

export default function TabLayout() {
    const { signOut } = useAuth();
    const { colors } = useTheme();

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
                },
                headerRight: () => (
                    <View className='mr-5'>
                        <UserMenu />
                    </View>
                )
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

                }}
            />
            <Tabs.Screen
                name='about'
                options={{
                    title: 'About',
                    headerTitleAlign: 'center',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
                    ),
                }}
            />
        </Tabs>
    )
}