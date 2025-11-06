import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

const TENANT_ID = "b86a3de3-6bc6-4372-9fbb-f0a39aafc70e";
const CLIENT_ID = "648435bb-61aa-43b6-aa64-cd385fe38307";

export const loginScopes = [
  "openid", 
  "profile",
  "email", 
  "offline_access", 
  `api://${CLIENT_ID}/access_as_user`,
  "User.Read",
];

const discovery = {
  authorizationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
};

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const EXPIRES_AT_KEY = 'expiresAt';

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

async function saveTokens(tokens: AuthSession.TokenResponse): Promise<AuthTokens> {
  const expiresAt = Math.floor(Date.now() / 1000) + (tokens.expiresIn ?? 3600);
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
  await SecureStore.setItemAsync(EXPIRES_AT_KEY, String(expiresAt));

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt,
  };
}

export async function getRefreshedTokens(): Promise<AuthTokens | null> {
  const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  const expiresAtStr = await SecureStore.getItemAsync(EXPIRES_AT_KEY);

  if (!accessToken || !expiresAtStr) {
    return null;
  }

  const expiresAt = Number(expiresAtStr);
  const isExpired = Date.now() > expiresAt * 1000;

  if (isExpired) {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      await clearTokens();
      return null;
    }
    try {
      const refreshedTokens = await AuthSession.refreshAsync(
        { clientId: CLIENT_ID, refreshToken, scopes: loginScopes },
        discovery
      );
      return await saveTokens(refreshedTokens);
    } catch (error) {
      console.error("Token refresh failed", error);
      await clearTokens();
      return null;
    }
  }

  return {
    accessToken,
    refreshToken: await SecureStore.getItemAsync(REFRESH_TOKEN_KEY) ?? undefined,
    expiresAt,
  };
}

export async function clearTokens() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  await SecureStore.deleteItemAsync(EXPIRES_AT_KEY);
}

export function useAuthRequest() {
  const redirectUri = AuthSession.makeRedirectUri({native: 'glassmugclassifier://auth'});
  return AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: loginScopes,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: { prompt: 'consent' },
    },
    discovery
  );
}

export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<AuthTokens> {
  const tokenResponse = await AuthSession.exchangeCodeAsync(
    {
      clientId: CLIENT_ID,
      code,
      redirectUri,
      extraParams: { code_verifier: codeVerifier },
    },
    discovery
  );
  return await saveTokens(tokenResponse);
}

export async function getGraphAccessToken(): Promise<string | null> {
  const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  try {
    const graphTokenResponse = await AuthSession.refreshAsync(
      {
        clientId: CLIENT_ID,
        refreshToken,
        scopes: ["User.Read", "offline_access"],
      },
      discovery
    );

    return graphTokenResponse.accessToken ?? null;
  } catch (e) {
    console.error("Failed to get Graph access token", e);
    return null;
  }
}