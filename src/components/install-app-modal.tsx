import { useEffect, useState } from 'react';
import { Image, Linking, Modal, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Download, X } from 'lucide-react-native';

import { COLOR } from '@/constants/app-colors';
import { DOWNLOAD_APK_URL } from '@/constants/api';

const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=1d2f4a&data=${encodeURIComponent(DOWNLOAD_APK_URL)}`;
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
    <Modal visible={visible} animationType="fade" transparent onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable style={styles.card} onPress={() => {}}>
          <LinearGradient
            colors={[COLOR.primary, '#2d4568']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <TouchableOpacity style={styles.closeBtn} onPress={close} activeOpacity={0.7}>
              <X color="rgba(255,255,255,0.85)" size={16} />
            </TouchableOpacity>
            <View style={styles.logoWrap}>
              <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
            </View>
            <Text style={styles.brand}>OstoSense</Text>
            <Text style={styles.tagline}>Pemantauan kantong kolostomi real-time</Text>
          </LinearGradient>

          <View style={styles.body}>
            <Text style={styles.desc}>
              Anda sedang membuka versi web (preview). Install aplikasi Android untuk pemakaian sehari-hari.
            </Text>

            <View style={styles.qrCard}>
              <Image source={{ uri: QR_URL }} style={styles.qr} />
              <Text style={styles.qrHint}>Scan untuk download</Text>
            </View>

            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.85}
              onPress={() => Linking.openURL(DOWNLOAD_APK_URL)}
            >
              <Download color={COLOR.white} size={16} />
              <Text style={styles.actionText}>Download APK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={close} activeOpacity={0.7}>
              <Text style={styles.laterText}>Nanti saja</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,43,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLOR.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLOR.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  logo: { width: 44, height: 44, borderRadius: 10 },
  brand: { fontFamily: 'Poppins', fontSize: 18, fontWeight: '700', color: COLOR.white },
  tagline: {
    fontFamily: 'Poppins',
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    textAlign: 'center',
  },
  body: { alignItems: 'center', gap: 14, padding: 22 },
  desc: { fontFamily: 'Poppins', fontSize: 13, color: COLOR.textLight, textAlign: 'center', lineHeight: 19 },
  qrCard: {
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLOR.bg,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  qr: { width: 150, height: 150, borderRadius: 8 },
  qrHint: { fontFamily: 'Poppins', fontSize: 11, fontWeight: '600', color: COLOR.textLight },
  actionBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: COLOR.primary,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  actionText: { fontFamily: 'Poppins', fontSize: 14, fontWeight: '700', color: COLOR.white },
  laterText: { fontFamily: 'Poppins', fontSize: 13, color: COLOR.textLight },
});
