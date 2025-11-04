import { clearTokens, getRefreshedTokens, type AuthTokens } from "@/lib/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextType {
  session: AuthTokens | null;
  isLoading: boolean;
  setSession: (session: AuthTokens | null) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  setSession: () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await getRefreshedTokens();
        setSession(storedSession);
      } catch (e) {
        console.error("Failed to load session", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const signOut = async () => {
    await clearTokens();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, isLoading, setSession, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}