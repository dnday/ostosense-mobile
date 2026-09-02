import { StyleSheet, Text, View } from 'react-native';

import { COLOR } from '@/constants/app-colors';
import { SheetModal } from '@/components/sheet-modal';
import { useSensorSeries } from '@/hooks/use-sensor-series';

const DEVICE_ID = 'ESP32_ASLI_01';

export function SensorInfoModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { series } = useSensorSeries();
  const connected = series.source === 'supabase';

  return (
    <SheetModal visible={visible} onClose={onClose} title="Perangkat Sensor">
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>ID Perangkat</Text>
          <Text style={styles.value}>{DEVICE_ID}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.statusWrap}>
            <View style={[styles.dot, { backgroundColor: connected ? COLOR.green : '#f59e0b' }]} />
            <Text style={styles.value}>{connected ? 'Terhubung' : 'Menghubungkan...'}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Volume Kantong</Text>
          <Text style={styles.value}>{series.volume.current}%</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Integritas Kulit</Text>
          <Text style={styles.value}>{series.risiko.current}%</Text>
        </View>
      </View>
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  content: { gap: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  label: { fontFamily: 'Inter', fontSize: 13, color: COLOR.textLight },
  value: { fontFamily: 'Inter', fontSize: 13, fontWeight: '700', color: COLOR.text },
  statusWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
