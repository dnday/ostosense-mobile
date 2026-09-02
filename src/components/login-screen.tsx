import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

import { useAuth } from '@/auth';
import { COLOR } from '@/constants/app-colors';
import { Logo } from '@/components/logo';

type Mode = 'login' | 'register';

function GoogleIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={20} height={20}>
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  );
}

export function LoginScreen() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const submit = async () => {
    if (mode === 'register' && !name.trim()) return setError('Nama lengkap wajib diisi');
    if (!email.includes('@')) return setError('Email tidak valid');
    if (password.length < 6) return setError('Password minimal 6 karakter');
    if (mode === 'register' && password !== confirmPassword) return setError('Konfirmasi password tidak cocok');

    setError('');
    setLoading(true);
    const result = mode === 'login' ? await signIn(email, password) : await signUp(name, email, password);
    setLoading(false);
    if (result.error) setError(result.error);
  };

  const submitGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    setGoogleLoading(false);
    if (result.error) setError(result.error);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
  };

  const busy = loading || googleLoading;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <Logo size={64} />
          <Text style={styles.title}>OstoSense</Text>
          <Text style={styles.subtitle}>
            {mode === 'login' ? 'Masuk untuk memantau kondisi Anda' : 'Buat akun untuk mulai memantau'}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => switchMode('login')}>
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, mode === 'register' && styles.tabActive]} onPress={() => switchMode('register')}>
              <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Buat Akun</Text>
            </TouchableOpacity>
          </View>

          {mode === 'register' && (
            <TextInput value={name} onChangeText={setName} placeholder="Nama lengkap" style={styles.input} placeholderTextColor={COLOR.textLight} />
          )}
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Email"
            style={styles.input}
            placeholderTextColor={COLOR.textLight}
          />
          <View style={styles.passwordRow}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Password"
              style={[styles.input, styles.passwordInput]}
              placeholderTextColor={COLOR.textLight}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff color={COLOR.textLight} size={20} /> : <Eye color={COLOR.textLight} size={20} />}
            </TouchableOpacity>
          </View>
          {mode === 'register' && (
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              placeholder="Konfirmasi password"
              style={styles.input}
              placeholderTextColor={COLOR.textLight}
            />
          )}
          {!!error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={submit} disabled={busy} activeOpacity={0.8}>
            {loading ? <ActivityIndicator color={COLOR.white} /> : <Text style={styles.buttonText}>{mode === 'login' ? 'Masuk' : 'Buat Akun'}</Text>}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ATAU</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={submitGoogle} disabled={busy} activeOpacity={0.8}>
            {googleLoading ? <ActivityIndicator color={COLOR.primary} /> : <GoogleIcon />}
            <Text style={styles.googleButtonText}>
              {googleLoading ? 'Menghubungkan ke Google...' : 'Lanjutkan dengan Google'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.switchText}>
            {mode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <Text style={styles.switchLink} onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Buat Akun' : 'Masuk'}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLOR.bg },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  brand: { alignItems: 'center', gap: 4, marginBottom: 20 },
  title: { fontSize: 26, fontWeight: '700', color: COLOR.primary, marginTop: 4 },
  subtitle: { textAlign: 'center', color: COLOR.textLight },
  card: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
    padding: 20,
    borderRadius: 18,
    backgroundColor: COLOR.white,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  tabs: { flexDirection: 'row', backgroundColor: COLOR.bg, borderRadius: 10, padding: 3, marginBottom: 4 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: COLOR.primary },
  tabText: { fontWeight: '600', color: COLOR.textLight },
  tabTextActive: { color: COLOR.white },
  input: { height: 50, paddingHorizontal: 14, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, color: COLOR.text },
  passwordRow: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingRight: 44 },
  eyeBtn: { position: 'absolute', right: 12, height: '100%', justifyContent: 'center' },
  button: { height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: COLOR.primary, marginTop: 4 },
  buttonText: { color: COLOR.white, fontWeight: '700' },
  error: { color: COLOR.warningIcon, fontSize: 13 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { fontSize: 12, fontWeight: '600', color: COLOR.textLight },
  googleButton: {
    flexDirection: 'row',
    height: 50,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: COLOR.white,
  },
  googleButtonText: { color: COLOR.text, fontWeight: '600', fontSize: 15 },
  switchText: { textAlign: 'center', color: COLOR.textLight, fontSize: 13, marginTop: 4 },
  switchLink: { color: COLOR.primary, fontWeight: '700' },
});
