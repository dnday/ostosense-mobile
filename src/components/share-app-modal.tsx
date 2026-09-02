import { Image, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Share2 } from 'lucide-react-native';

import { COLOR } from '@/constants/app-colors';
import { DOWNLOAD_APK_URL } from '@/constants/api';
import { SheetModal } from '@/components/sheet-modal';

const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(DOWNLOAD_APK_URL)}`;

export function ShareAppModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const shareLink = () => {
    Share.share({ message: `Install OstoSense: ${DOWNLOAD_APK_URL}`, url: DOWNLOAD_APK_URL });
  };

  return (
    <SheetModal visible={visible} onClose={onClose} title="Bagikan App">
      <View style={styles.content}>
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
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', gap: 14 },
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
