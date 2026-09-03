import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import { supabase } from '@/lib/supabase';
import { DEVICE_SESSION_ID } from '@/constants/device';

/**
 * Daftar token push Expo device ini ke tabel `push_tokens`, dipakai backend buat
 * kirim notifikasi saat sensor deteksi kantong penuh/kontak cairan LIG langsung —
 * BUKAN buat kelas AI (dilarang kontrak integrasi AI v0.2). Panggil sekali di root
 * layout, dalam AuthProvider (hanya berguna kalau user sudah login).
 */
export function usePushRegistration() {
  useEffect(() => {
    let cancelled = false;

    const register = async () => {
      if (!Device.isDevice) return; // simulator/emulator gak dapat token push nyata

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Peringatan Sensor',
          importance: Notifications.AndroidImportance.HIGH,
        });
      }

      const existing = await Notifications.getPermissionsAsync();
      let status = existing.status;
      if (status !== 'granted') {
        const requested = await Notifications.requestPermissionsAsync();
        status = requested.status;
      }
      if (status !== 'granted' || cancelled) return;

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
      if (cancelled || !token) return;

      await supabase
        .from('push_tokens')
        .upsert(
          { session_id: DEVICE_SESSION_ID, expo_push_token: token, updated_at: new Date().toISOString() },
          { onConflict: 'expo_push_token' },
        );
    };

    register();
    return () => {
      cancelled = true;
    };
  }, []);
}
