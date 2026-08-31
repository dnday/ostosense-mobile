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

import { useAuth } from '@/auth';
import { COLOR } from '@/constants/app-colors';
import { Logo } from '@/components/logo';

type Mode = 'login' | 'register';

export function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Logo size={76} />
        <Text style={styles.title}>OstoSense</Text>
        <Text style={styles.subtitle}>
          {mode === 'login' ? 'Masuk untuk memantau kondisi Anda' : 'Buat akun untuk mulai memantau'}
        </Text>

        <View style={styles.card}>
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, mode === 'login' && styles.tabActive]} onPress={() => switchMode('login')}>
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, mode === 'register' && styles.tabActive]} onPress={() => switchMode('register')}>
              <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Daftar</Text>
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

          <TouchableOpacity style={styles.button} onPress={submit} disabled={loading} activeOpacity={0.8}>
            {loading ? <ActivityIndicator color={COLOR.white} /> : <Text style={styles.buttonText}>{mode === 'login' ? 'Masuk' : 'Daftar'}</Text>}
          </TouchableOpacity>

          {mode === 'register' && (
            <Text style={styles.switchText}>
              Sudah punya akun?{' '}
              <Text style={styles.switchLink} onPress={() => switchMode('login')}>
                Masuk
              </Text>
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLOR.bg },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 6 },
  title: { fontSize: 26, fontWeight: '700', color: COLOR.primary, marginTop: 4 },
  subtitle: { marginBottom: 14, textAlign: 'center', color: COLOR.textLight },
  card: { width: '100%', gap: 12, padding: 20, borderRadius: 18, backgroundColor: COLOR.white },
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
  switchText: { textAlign: 'center', color: COLOR.textLight, fontSize: 13 },
  switchLink: { color: COLOR.primary, fontWeight: '700' },
});
