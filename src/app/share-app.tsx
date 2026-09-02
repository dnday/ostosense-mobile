import { Image, Platform, SafeAreaView, Share, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Share2 } from 'lucide-react-native';

import { COLOR } from '@/constants/app-colors';
import { DOWNLOAD_APK_URL } from '@/constants/api';

const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(DOWNLOAD_APK_URL)}`;

export default function ShareAppPage() {
  const router = useRouter();

  const shareLink = () => {
    Share.share({ message: `Install OstoSense: ${DOWNLOAD_APK_URL}`, url: DOWNLOAD_APK_URL });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLOR.bg} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <ArrowLeft color={COLOR.text} size={20} />
          </TouchableOpacity>
          <Text style={styles.title}>Bagikan App</Text>
        </View>

        <View style={styles.card}>
          <Image source={{ uri: QR_URL }} style={styles.qr} />
          <Text style={styles.hint}>Scan buat langsung download APK OstoSense</Text>

          <View style={styles.linkBox}>
            <Text style={styles.link} selectable numberOfLines={2}>
              {DOWNLOAD_APK_URL}
            </Text>
          </View>

          <TouchableOpacity style={styles.actionBtn} onPress={shareLink} activeOpacity={0.8}>
            <Share2 color={COLOR.white} size={16} />
            <Text style={styles.actionText}>Bagikan Link</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLOR.bg },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLOR.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontFamily: 'Inter', fontSize: 18, fontWeight: '700', color: COLOR.text },
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
  },
  qr: { width: 200, height: 200, borderRadius: 12 },
  hint: { fontFamily: 'Inter', fontSize: 12, color: COLOR.textLight, textAlign: 'center' },
  linkBox: {
    width: '100%',
    backgroundColor: COLOR.bg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  link: { fontFamily: 'Inter', fontSize: 12, color: COLOR.textMuted, textAlign: 'center' },
  actionBtn: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
    height: 46,
    borderRadius: 10,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: { fontFamily: 'Inter', fontSize: 13, fontWeight: '700', color: COLOR.white },
});
