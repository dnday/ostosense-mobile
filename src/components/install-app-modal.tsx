import { useEffect, useState } from 'react';
import { Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Smartphone } from 'lucide-react-native';

import { COLOR } from '@/constants/app-colors';
import { DOWNLOAD_APK_URL } from '@/constants/api';
import { SheetModal } from '@/components/sheet-modal';

const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(DOWNLOAD_APK_URL)}`;
const DISMISS_KEY = 'ostosense-install-popup-dismissed';

// Web-only: versi web ini preview Expo, bukan app sungguhan — ingetin user install APK asli.
export function InstallAppModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof sessionStorage === 'undefined') return;
    if (!sessionStorage.getItem(DISMISS_KEY)) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  if (Platform.OS !== 'web') return null;

  const close = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, '1');
  };

  return (
    <SheetModal visible={visible} onClose={close} title="Install Aplikasi OstoSense">
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Smartphone color={COLOR.primary} size={22} />
        </View>
        <Text style={styles.desc}>
          Anda sedang membuka versi web (preview). Untuk pemakaian sehari-hari, install aplikasi Android-nya.
        </Text>
        <Image source={{ uri: QR_URL }} style={styles.qr} />
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.8}
          onPress={() => Linking.openURL(DOWNLOAD_APK_URL)}
        >
          <Text style={styles.actionText}>Download APK</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={close} activeOpacity={0.7}>
          <Text style={styles.laterText}>Nanti saja</Text>
        </TouchableOpacity>
      </View>
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: 12 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLOR.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desc: { fontFamily: 'Poppins', fontSize: 13, color: COLOR.textLight, textAlign: 'center', lineHeight: 19 },
  qr: { width: 160, height: 160, borderRadius: 12 },
  actionBtn: {
    width: '100%',
    height: 46,
    borderRadius: 10,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: { fontFamily: 'Poppins', fontSize: 13, fontWeight: '700', color: COLOR.white },
  laterText: { fontFamily: 'Poppins', fontSize: 13, color: COLOR.textLight },
});
