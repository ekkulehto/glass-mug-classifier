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
        console.log('[AuthContext] Ladataan sessiota SecureStoresta...');
        const stored = await getRefreshedTokens();
        if (stored) {
          console.log('[AuthContext] Sessio löytyi ja ladattiin.');
          setSession(stored);
        } else {
          console.log('[AuthContext] Ei löytynyt olemassa olevaa sessiota.');
        }
      } catch (e) {
        console.error("[AuthContext] Session lataus epäonnistui", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Graph access token Avatarin headeriin
  const refreshGraphToken = async () => {
    try {
      console.log('[AuthContext] Yritetään hakea Graph Access Token...');
      const tok = await getGraphAccessToken();
      setGraphAccessToken(tok);
      if (tok) {
        console.log('[AuthContext] Graph Access Token haettu onnistuneesti.');
      } else {
        console.warn('[AuthContext] Graph Access Tokenin haku palautti null.');
      }
    } catch (e) {
      console.error('[AuthContext] Graph Access Tokenin haku epäonnistui', e);
    }
  };

  // Nimen + emailin haku
  const refreshProfile = async () => {
    if (!session?.accessToken) {
      setProfile(null);
      return;
    }
    try {
      console.log('[AuthContext] Yritetään hakea käyttäjäprofiilia...');
      const graphTok = await getGraphAccessToken();
      if (!graphTok) {
        console.warn('[AuthContext] Ei voida hakea profiilia, koska Graph-token puuttuu.');
        return;
      }
      const p = await fetchGraphBasic(graphTok);
      setProfile(p);
      console.log('[AuthContext] Käyttäjäprofiili haettu:', p);
    } catch (e) {
      console.error("[AuthContext] Profiilin haku epäonnistui", e);
      setProfile(null); // Varmistetaan nollaus virhetilanteessa
    }
  };

  // Kun sessio muuttuu, nouda nimi/email + graph-token
  useEffect(() => {
    if (session?.accessToken) {
      console.log('[AuthContext] Sessio muuttui, päivitetään profiili ja Graph-token.');
      void refreshProfile();
      void refreshGraphToken();
    } else {
      console.log('[AuthContext] Sessio poistui, nollataan profiili ja Graph-token.');
      setProfile(null);
      setGraphAccessToken(null);
    }
  }, [session?.accessToken]);

  const signOut = async () => {
    await clearTokens();
    setSession(null);
    // Muut tilat nollautuvat automaattisesti useEffect-hookin kautta
    console.log('[AuthContext] Käyttäjä kirjattu ulos.');
  };

  return (
    <AuthContext.Provider
      value={{ session, isLoading, profile, graphAccessToken, setSession, signOut, refreshProfile, refreshGraphToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}