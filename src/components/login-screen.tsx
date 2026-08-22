import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

import { useAuth } from '@/auth';
import { COLOR } from '@/constants/app-colors';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('admin@ostosense.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = () => {
    if (!email.includes('@')) return setError('Email tidak valid');
    setError('');
    setLoading(true);
    setTimeout(signIn, 400);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.icon}><ShieldCheck color={COLOR.white} size={36} /></View>
        <Text style={styles.title}>OstoSense</Text>
        <Text style={styles.subtitle}>Masuk untuk memantau kondisi Anda</Text>

        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email" style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" style={styles.input} />
        {!!error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={login} disabled={loading} activeOpacity={0.8}>
          {loading ? <ActivityIndicator color={COLOR.white} /> : <Text style={styles.buttonText}>Masuk</Text>}
        </TouchableOpacity>
        <Text style={styles.hint}>Demo: admin@ostosense.com / password123</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: COLOR.bg },
  card: { gap: 14, padding: 24, borderRadius: 18, backgroundColor: COLOR.white },
  icon: { alignSelf: 'center', padding: 14, borderRadius: 999, backgroundColor: COLOR.primary },
  title: { textAlign: 'center', fontSize: 28, fontWeight: '700', color: COLOR.primary },
  subtitle: { marginBottom: 10, textAlign: 'center', color: COLOR.textLight },
  input: { height: 52, paddingHorizontal: 14, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, color: COLOR.text },
  button: { height: 52, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: COLOR.primary },
  buttonText: { color: COLOR.white, fontWeight: '700' },
  error: { color: COLOR.warningIcon, fontSize: 13 },
  hint: { textAlign: 'center', color: COLOR.textLight, fontSize: 12 },
});
