import { createContext, useContext, useState } from 'react';

type Auth = { signedIn: boolean; signIn: () => void; signOut: () => void };

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  return (
    <AuthContext value={{ signedIn, signIn: () => setSignedIn(true), signOut: () => setSignedIn(false) }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth must be used inside AuthProvider');
  return auth;
}
