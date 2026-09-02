import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Mail } from 'lucide-react-native';

import { COLOR } from '@/constants/app-colors';
import { SheetModal } from '@/components/sheet-modal';

const FAQ = [
  { q: 'Kenapa data sensor gak update?', a: 'Pastikan perangkat ESP32 menyala dan terhubung ke WiFi. Tarik layar Monitor ke bawah untuk refresh manual.' },
  { q: 'Berapa lama baterai sensor tahan?', a: 'Sekitar 5-7 hari pemakaian normal, tergantung frekuensi transmisi data.' },
  { q: 'Apa yang harus dilakukan saat status “Risiko Tinggi”?', a: 'Segera periksa kondisi kantong dan pertimbangkan penggantian dalam 30 menit ke depan.' },
];

export function HelpModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <SheetModal visible={visible} onClose={onClose} title="Bantuan">
      <View style={styles.content}>
        {FAQ.map(({ q, a }) => (
          <View key={q} style={styles.item}>
            <Text style={styles.question}>{q}</Text>
            <Text style={styles.answer}>{a}</Text>
          </View>
        ))}
        <TouchableOpacity
          style={styles.contactBtn}
          activeOpacity={0.8}
          onPress={() => Linking.openURL('mailto:support@ostosense.id')}
        >
          <Mail color={COLOR.white} size={16} />
          <Text style={styles.contactText}>Hubungi Support</Text>
        </TouchableOpacity>
      </View>
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  content: { gap: 14 },
  item: { gap: 4 },
  question: { fontFamily: 'Inter', fontSize: 13, fontWeight: '700', color: COLOR.text },
  answer: { fontFamily: 'Inter', fontSize: 12, color: COLOR.textLight, lineHeight: 18 },
  contactBtn: {
    flexDirection: 'row',
    gap: 8,
    height: 46,
    borderRadius: 10,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: { fontFamily: 'Inter', fontSize: 13, fontWeight: '700', color: COLOR.white },
});
