import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import { COLOR } from '@/constants/app-colors';
import { DEVICE_SESSION_ID } from '@/constants/device';
import { SheetModal } from '@/components/sheet-modal';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'notif-prefs';
const REMINDER_HOUR = 9; // ponytail: jam pengingat harian hardcode, belum ada UI buat atur jam sendiri.

type Prefs = { gantiKantong: boolean; risikoTinggi: boolean };
const DEFAULT_PREFS: Prefs = { gantiKantong: true, risikoTinggi: true };

const REMINDER_ID_KEY = 'notif-reminder-id';

async function scheduleReminder() {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Cek kondisi kantong',
      body: 'Waktunya periksa kantong dan pertimbangkan waktu penggantian.',
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: REMINDER_HOUR, minute: 0 },
  });
  await AsyncStorage.setItem(REMINDER_ID_KEY, id);
}

async function cancelReminder() {
  const id = await AsyncStorage.getItem(REMINDER_ID_KEY);
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
  await AsyncStorage.removeItem(REMINDER_ID_KEY);
}

export function NotificationsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  useEffect(() => {
    if (!visible) return;
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setPrefs(JSON.parse(raw));
    });
  }, [visible]);

  const toggle = async (key: keyof Prefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    if (key === 'gantiKantong') {
      if (next.gantiKantong) await scheduleReminder();
      else await cancelReminder();
    }

    if (key === 'risikoTinggi') {
      // Kontrol server-side: matiin/nyalain notifikasi push yang dikirim backend
      // saat sensor deteksi kantong penuh / kontak cairan LIG langsung (bukan kelas AI).
      await supabase
        .from('push_tokens')
        .update({ alerts_enabled: next.risikoTinggi })
        .eq('session_id', DEVICE_SESSION_ID);
    }
  };

  return (
    <SheetModal visible={visible} onClose={onClose} title="Notifikasi">
      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Pengingat harian</Text>
            <Text style={styles.desc}>Diingatkan tiap jam {REMINDER_HOUR}:00 buat cek/ganti kantong</Text>
          </View>
          <Switch
            value={prefs.gantiKantong}
            onValueChange={() => toggle('gantiKantong')}
            trackColor={{ true: COLOR.primary }}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.label}>Peringatan sensor</Text>
            <Text style={styles.desc}>Notifikasi saat kantong penuh atau LIG deteksi kontak cairan langsung</Text>
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
