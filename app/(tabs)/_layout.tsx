import { UserMenu } from '@/components/user-menu';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { Tabs } from "expo-router";
import { View } from 'react-native';
import { useHelpGuide } from '@/components/HelpGuide';
import { HelpGuideProvider } from "@/components/HelpGuide";
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { CircleQuestionMarkIcon } from 'lucide-react-native';

function HeaderHelpIconButton() {
    const { colors } = useTheme();
    const { open } = useHelpGuide();

    return (
        <Button
            size="icon"
            className="size-10 rounded-full"
            onPress={open}
            style={{backgroundColor: colors.background}}
        >
            <Icon
                as={CircleQuestionMarkIcon}
                className='w-full'
                strokeWidth={1.1}
                color={colors.primary}
            />
        </Button>
    );
}

export default function TabLayout() {
    const { colors } = useTheme();

    return (
        <HelpGuideProvider>
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
                    ),
                    headerLeft: () => (
                        <View className='ml-5'>
                            <HeaderHelpIconButton />
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
        </HelpGuideProvider>
    )
}