import { createContext, useContext, useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { ensureRole } from '@/lib/profile';

WebBrowser.maybeCompleteAuthSession();

type AuthResult = { error?: string };

type Auth = {
  signedIn: boolean;
  loading: boolean;
  user: User | null;
  roleError: string;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

const WRONG_ROLE_MESSAGE =
  'Akun ini terdaftar sebagai akun nakes di dashboard web OstoSense, bukan akun pasien. Gunakan akun pasien untuk masuk di sini.';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    const applySession = async (next: Session | null) => {
      if (!next) {
        setSession(null);
        return;
      }
      const result = await ensureRole(next.user.id, 'pasien');
      if (!result.ok) {
        await supabase.auth.signOut();
        setRoleError(WRONG_ROLE_MESSAGE);
        setSession(null);
        return;
      }
      setRoleError('');
      setSession(next);
    };

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session).finally(() => setLoading(false));
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      applySession(next);
    });
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
      value={{
        signedIn: !!session,
        loading,
        user: session?.user ?? null,
        roleError,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
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
