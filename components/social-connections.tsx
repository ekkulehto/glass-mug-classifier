import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuth } from "@/context/AuthContext";
import { exchangeCodeForToken, useAuthRequest } from "@/lib/auth";
import { cn } from '@/lib/utils';
import * as WebBrowser from 'expo-web-browser';
import { useColorScheme } from 'nativewind';
import { useEffect } from "react";
import { ActivityIndicator, Image, Platform, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const SOCIAL_CONNECTION_STRATEGIES = [
  {
    type: 'oauth_microsoft',
    source: { uri: 'https://img.clerk.com/static/microsoft.png?width=160' },
    useTint: false,
  },
];

export function SocialConnections() {
  const { colorScheme } = useColorScheme();

    const { setSession } = useAuth();
    const [request, response, promptAsync] = useAuthRequest();
  
    useEffect(() => {
      if (response) {
        if (response.type === 'success' && request?.codeVerifier) {
          const { code } = response.params;
          const redirectUri = request.redirectUri;
          exchangeCodeForToken(code, request.codeVerifier, redirectUri).then(newSession => {
            setSession(newSession);
          });
        } else if (response.type === 'error') {
          console.error('Authentication error:', response.error);
        }
      }
    }, [response, request]);
  
    if (!request) {
      return (
          <View>
              <ActivityIndicator size="large" color={colorScheme === 'dark' ? 'white' : 'black'} />
          </View>
      );
    }

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.type}
            variant="outline"
            size="sm"
            className="sm:flex-1 gap-3"
            onPress={() => {promptAsync()}}
            disabled={!request}>
            <Image
              className={cn('size-4', strategy.useTint && Platform.select({ web: 'dark:invert' }))}
              tintColor={Platform.select({
                native: strategy.useTint ? (colorScheme === 'dark' ? 'white' : 'black') : undefined,
              })}
              source={strategy.source}
            />
            <Text>Continue with Microsoft</Text>
          </Button>
        );
      })}
    </View>
  );
}
