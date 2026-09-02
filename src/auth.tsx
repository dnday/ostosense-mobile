import { createContext, useContext, useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

type AuthResult = { error?: string };

type Auth = {
  signedIn: boolean;
  loading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => subscription.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signUp = async (name: string, email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) return { error: error.message };
    if (!data.session) return { error: 'Akun dibuat. Cek email Anda untuk konfirmasi sebelum masuk.' };
    return {};
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    const redirectTo = Linking.createURL('/');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error) return { error: error.message };

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success') return {};

    const params = new URLSearchParams(new URL(result.url).hash.replace('#', ''));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (!access_token || !refresh_token) return { error: 'Login Google gagal, coba lagi.' };

    const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
    return sessionError ? { error: sessionError.message } : {};
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext
      value={{ signedIn: !!session, loading, user: session?.user ?? null, signIn, signUp, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('useAuth must be used inside AuthProvider');
  return auth;
}
