import { clearTokens, getRefreshedTokens, type AuthTokens } from "@/lib/auth";
import { getGraphAccessToken } from "@/lib/auth";
import { fetchGraphBasic, type UserProfile } from "@/api/graph";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
  session: AuthTokens | null;
  isLoading: boolean;
  profile: UserProfile | null;
  graphAccessToken: string | null;
  setSession: (session: AuthTokens | null) => void;
  signOut: () => void;
  refreshProfile: () => Promise<void>;
  refreshGraphToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  profile: null,
  graphAccessToken: null,
  setSession: () => { },
  signOut: () => { },
  refreshProfile: async () => { },
  refreshGraphToken: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [graphAccessToken, setGraphAccessToken] = useState<string | null>(null);

  // Lataa mahdollinen olemassa oleva sessio
  useEffect(() => {
    (async () => {
      try {
        const stored = await getRefreshedTokens();
        setSession(stored);
      } catch (e) {
        console.error("Failed to load session", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Graph access token Avatarin headeriin
  const refreshGraphToken = async () => {
    const tok = await getGraphAccessToken();
    setGraphAccessToken(tok);
  };

  // Nimen + emailin haku
  const refreshProfile = async () => {
    if (!session?.accessToken) {
      setProfile(null);
      return;
    }
    try {
      const graphTok = await getGraphAccessToken();
      if (!graphTok) return;
      const p = await fetchGraphBasic(graphTok);
      setProfile(p);
    } catch (e) {
      console.error("Failed to fetch profile", e);
    }
  };

  // Kun sessio muuttuu, nouda nimi/email + graph-token
  useEffect(() => {
    if (session?.accessToken) {
      void refreshProfile();
      void refreshGraphToken();
    } else {
      setProfile(null);
      setGraphAccessToken(null);
    }
  }, [session?.accessToken]);

  const signOut = async () => {
    await clearTokens();
    setSession(null);
    setProfile(null);
    setGraphAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ session, isLoading, profile, graphAccessToken, setSession, signOut, refreshProfile, refreshGraphToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
