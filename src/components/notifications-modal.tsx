import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLOR } from '@/constants/app-colors';
import { SheetModal } from '@/components/sheet-modal';

const STORAGE_KEY = 'notif-prefs';

type Prefs = { gantiKantong: boolean; risikoTinggi: boolean };
const DEFAULT_PREFS: Prefs = { gantiKantong: true, risikoTinggi: true };

export function NotificationsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  useEffect(() => {
    if (!visible) return;
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setPrefs(JSON.parse(raw));
    });
  }, [visible]);

  const toggle = (key: keyof Prefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <SheetModal visible={visible} onClose={onClose} title="Notifikasi">
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Pengingat ganti kantong</Text>
            <Text style={styles.desc}>Diingatkan saat volume kantong hampir penuh</Text>
          </View>
          <Switch
            value={prefs.gantiKantong}
            onValueChange={() => toggle('gantiKantong')}
            trackColor={{ true: COLOR.primary }}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Peringatan risiko tinggi</Text>
            <Text style={styles.desc}>Diingatkan saat risiko kebocoran meningkat</Text>
          </View>
          <Switch
            value={prefs.risikoTinggi}
            onValueChange={() => toggle('risikoTinggi')}
            trackColor={{ true: COLOR.primary }}
          />
        </View>
      </View>
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  content: { gap: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  rowText: { flex: 1 },
  label: { fontFamily: 'Inter', fontSize: 13, fontWeight: '700', color: COLOR.text },
  desc: { fontFamily: 'Inter', fontSize: 11, color: COLOR.textLight, marginTop: 2 },
});
