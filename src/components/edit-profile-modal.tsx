import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { COLOR } from '@/constants/app-colors';
import { SheetModal } from '@/components/sheet-modal';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/auth';

export function EditProfileModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.full_name ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!name.trim()) return setError('Nama gak boleh kosong');
    setError('');
    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    setSaving(false);
    if (updateError) return setError(updateError.message);
    onClose();
  };

  return (
    <SheetModal visible={visible} onClose={onClose} title="Edit Profil">
      <View style={styles.content}>
        <View>
          <Text style={styles.label}>Nama lengkap</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Nama lengkap" />
        </View>
        <View>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.readonly}>{user?.email}</Text>
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={saving} activeOpacity={0.8}>
          {saving ? <ActivityIndicator color={COLOR.white} /> : <Text style={styles.saveText}>Simpan</Text>}
        </TouchableOpacity>
      </View>
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  content: { gap: 14 },
  label: { fontFamily: 'Inter', fontSize: 12, fontWeight: '600', color: COLOR.textLight, marginBottom: 6 },
  input: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    fontFamily: 'Inter',
    color: COLOR.text,
  },
  readonly: { fontFamily: 'Inter', fontSize: 14, color: COLOR.textLight, paddingVertical: 4 },
  error: { fontFamily: 'Inter', fontSize: 12, color: COLOR.warningIcon },
  saveBtn: {
    height: 46,
    borderRadius: 10,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: { fontFamily: 'Inter', fontSize: 14, fontWeight: '700', color: COLOR.white },
});
