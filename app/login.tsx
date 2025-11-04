import { useAuth } from "@/context/AuthContext";
import { exchangeCodeForToken, useAuthRequest } from "@/lib/auth";
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
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
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#ffd33d" />
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Please sign in to continue</Text>
      <Button
        title="Sign in with Microsoft"
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 24,
    }
});