import { StyleSheet, Text, View } from 'react-native';
import { Brain } from 'lucide-react-native';

import { COLOR } from '@/constants/app-colors';
import { useAiPrediction } from '@/hooks/use-ai-prediction';
import type { SensorQuality } from '@/hooks/use-sensor-series';

// ponytail: 30s = ~6 siklus polling (5s) terlewat sebelum dianggap offline, bukan angka resmi.
const OFFLINE_MS = 30000;
const GOOD_QUALITY = ['OK', 'NORMAL'];

function isBadQuality(v: string | null) {
  return !!v && !GOOD_QUALITY.includes(v.toUpperCase());
}

export function AiStatusCard({
  quality,
  lastUpdatedAt,
}: {
  quality: SensorQuality;
  lastUpdatedAt: number | null;
}) {
  const prediction = useAiPrediction();

  const offline = lastUpdatedAt === null || Date.now() - lastUpdatedAt > OFFLINE_MS;
  const sensorProblem = !offline && (isBadQuality(quality.cap) || isBadQuality(quality.lig) || isBadQuality(quality.system));

  let title: string;
  let detail: string;
  let tone: { bg: string; border: string; text: string };

  if (offline) {
    title = 'Perangkat Offline';
    detail = 'Tidak ada data sensor masuk beberapa saat terakhir.';
    tone = { bg: '#f3f4f6', border: '#e5e7eb', text: '#4b5563' };
  } else if (sensorProblem) {
    title = 'Sensor Bermasalah';
    detail = 'Kualitas pembacaan sensor sedang tidak baik, AI tidak dijalankan atas data ini.';
    tone = { bg: '#fef3c6', border: '#fde68a', text: '#92400e' };
  } else if (prediction.state === 'unavailable') {
    title = 'AI belum tersedia';
    detail = 'Belum ada hasil klasifikasi AI untuk device ini.';
    tone = { bg: '#f3f4f6', border: '#e5e7eb', text: '#4b5563' };
  } else {
    const staleNote = prediction.state === 'stale' ? ' (data usang, belum diperbarui baru-baru ini)' : '';
    title = `${prediction.label}: ${prediction.riskClass}`;
    detail = `Kelas dari model AI eksperimental, bukan persentase risiko atau perkiraan waktu kebocoran.${staleNote} Tidak memicu notifikasi.`;
    tone =
      prediction.state === 'stale'
        ? { bg: '#fef3c6', border: '#fde68a', text: '#92400e' }
        : { bg: COLOR.blueLight, border: '#dbeafe', text: '#1447e6' };
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: tone.bg }]}>
          <Brain color={tone.text} size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>Klasifikasi AI</Text>
          <Text style={styles.cardSubtitle}>Status eksperimental, terpisah dari data sensor</Text>
        </View>
      </View>
      <View style={[styles.statusBox, { backgroundColor: tone.bg, borderColor: tone.border }]}>
        <Text style={[styles.statusTitle, { color: tone.text }]}>{title}</Text>
        <Text style={styles.statusDetail}>{detail}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLOR.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconWrap: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontFamily: 'Inter', fontSize: 14, fontWeight: '700', color: COLOR.text, lineHeight: 20 },
  cardSubtitle: { fontFamily: 'Inter', fontSize: 12, fontWeight: '400', color: COLOR.textLight, lineHeight: 16 },
  statusBox: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 11, paddingVertical: 10, gap: 4 },
  statusTitle: { fontFamily: 'Inter', fontSize: 13, fontWeight: '700' },
  statusDetail: { fontFamily: 'Inter', fontSize: 11, fontWeight: '400', color: '#364153', lineHeight: 15 },
});
