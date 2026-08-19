import { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Droplets, History, Package, TrendingDown } from 'lucide-react-native';

import { BottomNav } from '@/components/bottom-nav';
import { BarChart, LineChart } from '@/components/charts';
import { API_URL } from '@/constants/api';
import { COLOR } from '@/constants/app-colors';

type SensorSeries = {
  risiko: { labels: string[]; data: number[]; current: number; status: string };
  volume: { labels: string[]; data: number[]; current: number; status: string };
  kelembaban: { labels: string[]; data: number[]; threshold: number };
  history: { time: string; desc: string; status: 'Normal' | 'Tinggi' }[];
};

// Angka mockup Figma — tampil saat backend belum hidup.
const FALLBACK: SensorSeries = {
  risiko: {
    labels: ['0h', '6h', '12h', '18h', '24h', '30h', '36h', '42h'],
    data: [100, 96, 89, 82, 75, 69, 62, 55],
    current: 62,
    status: 'Risiko rendah',
  },
  volume: {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    data: [15, 25, 34, 42, 48, 45],
    current: 45,
    status: 'Kapasitas aman',
  },
  kelembaban: {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    data: [34, 42, 64, 38, 44, 72],
    threshold: 60,
  },
  history: [
    { time: '18:30', desc: 'Kelembaban: 45%', status: 'Normal' },
    { time: '18:15', desc: 'Volume: 45%', status: 'Normal' },
    { time: '17:45', desc: 'Integritas: 62%', status: 'Normal' },
    { time: '17:00', desc: 'Kelembaban: 72%', status: 'Tinggi' },
    { time: '15:30', desc: 'Volume: 48%', status: 'Normal' },
    { time: '14:00', desc: 'Kelembaban: 38%', status: 'Normal' },
  ],
};

const POLL_MS = 5000;

function useSensorSeries() {
  const [series, setSeries] = useState<SensorSeries>(FALLBACK);
  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(`${API_URL}/api/sensor-series`)
        .then((r) => r.json())
        .then((d: SensorSeries) => {
          if (alive && d?.risiko) setSeries(d);
        })
        .catch(() => {}); // backend mati → tetap pakai data terakhir/fallback
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);
  return series;
}

function CardHeader({
  Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
}: {
  Icon: typeof History;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.cardHeader}>
      <View style={[styles.cardIconWrap, { backgroundColor: iconBg }]}>
        <Icon color={iconColor} size={20} />
      </View>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

export default function MonitorPage() {
  const { risiko, volume, kelembaban, history } = useSensorSeries();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLOR.bg} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Header ─── */}
          <View style={styles.header}>
            <Text style={styles.title}>Data Sensor</Text>
            <Text style={styles.subtitle}>Pantau kondisi secara real-time</Text>
          </View>

          {/* ─── Risiko Kebocoran ─── */}
          <View style={styles.card}>
            <CardHeader
              Icon={TrendingDown}
              iconBg="#dbeafe"
              iconColor="#155dfc"
              title="Risiko Kebocoran"
              subtitle="Prediksi AI berdasarkan integritas"
            />
            <LineChart labels={risiko.labels} data={risiko.data} color="#2b7fff" />
            <View style={[styles.statusBox, { backgroundColor: COLOR.blueLight, borderColor: '#dbeafe' }]}>
              <Text style={styles.statusText}>
                <Text style={[styles.statusLabel, { color: '#1447e6' }]}>Status:</Text> Integritas{' '}
                <Text style={styles.statusBold}>{risiko.current}%</Text> - {risiko.status}
              </Text>
            </View>
          </View>

          {/* ─── Volume Kantong ─── */}
          <View style={styles.card}>
            <CardHeader
              Icon={Package}
              iconBg="#d0fae5"
              iconColor="#007a55"
              title="Volume Kantong"
              subtitle="Tracking kapasitas real-time"
            />
            <LineChart labels={volume.labels} data={volume.data} color="#00bc7d" />
            <View style={[styles.statusBox, { backgroundColor: COLOR.greenLight, borderColor: '#d0fae5' }]}>
              <Text style={styles.statusText}>
                <Text style={[styles.statusLabel, { color: '#007a55' }]}>Status:</Text> Volume{' '}
                <Text style={styles.statusBold}>{volume.current}%</Text> - {volume.status}
              </Text>
            </View>
          </View>

          {/* ─── Kelembaban Kulit ─── */}
          <View style={styles.card}>
            <CardHeader
              Icon={Droplets}
              iconBg="#cefafe"
              iconColor="#0092b8"
              title="Kelembaban Kulit"
              subtitle="Monitor tingkat kelembaban"
            />
            <BarChart
              labels={kelembaban.labels}
              data={kelembaban.data}
              threshold={kelembaban.threshold}
            />
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: '#0092b8' }]} />
                <Text style={styles.legendText}>Normal</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: '#ff9141' }]} />
                <Text style={styles.legendText}>Tinggi</Text>
              </View>
            </View>
          </View>

          {/* ─── Riwayat Terkini ─── */}
          <View style={styles.card}>
            <CardHeader
              Icon={History}
              iconBg="#f3e8ff"
              iconColor="#9810fa"
              title="Riwayat Terkini"
              subtitle="Catatan pembacaan sensor"
            />
            <View style={styles.historyList}>
              {history.map(({ time, desc, status }) => (
                <View key={`${time}-${desc}`} style={styles.historyRow}>
                  <View style={styles.historyLeft}>
                    <View
                      style={[
                        styles.historyDot,
                        { backgroundColor: status === 'Normal' ? '#00bc7d' : '#ff9141' },
                      ]}
                    />
                    <View>
                      <Text style={styles.historyTime}>{time}</Text>
                      <Text style={styles.historyDesc}>{desc}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.historyBadge,
                      { backgroundColor: status === 'Normal' ? '#d0fae5' : '#fef3c6' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.historyBadgeText,
                        { color: status === 'Normal' ? '#007a55' : '#bb4d00' },
                      ]}
                    >
                      {status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <BottomNav active="monitor" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 100,
  },

  /* ── Header ── */
  header: {
    marginBottom: 16,
    gap: 2,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: COLOR.textLight,
    lineHeight: 16,
  },

  /* ── Card ── */
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 20,
  },
  cardSubtitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: COLOR.textLight,
    lineHeight: 16,
  },
  /* ── Status box ── */
  statusBox: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  statusText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: '#364153',
    lineHeight: 16,
  },
  statusLabel: {
    fontWeight: '700',
  },
  statusBold: {
    fontWeight: '700',
  },

  /* ── Legend ── */
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: '#364153',
    lineHeight: 16,
  },

  /* ── Riwayat ── */
  historyList: {
    gap: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  historyTime: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 16,
  },
  historyDesc: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '400',
    color: COLOR.textLight,
    lineHeight: 15,
  },
  historyBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  historyBadgeText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 15,
  },
});
