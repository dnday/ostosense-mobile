import { useSensorSeries } from "@/hooks/use-sensor-series";
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Droplets, History, Package } from 'lucide-react-native';

import { AiStatusCard } from '@/components/ai-status-card';
import { BottomNav } from '@/components/bottom-nav';
import { LineChart } from '@/components/charts';
import { COLOR } from '@/constants/app-colors';



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
  const { series: { volume, kulit, history, quality, lastUpdatedAt } } = useSensorSeries();
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

          {/* ─── Klasifikasi AI (eksperimental, lihat AiStatusCard) ─── */}
          <AiStatusCard quality={quality} lastUpdatedAt={lastUpdatedAt} />

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

          {/* ─── Integritas Kulit (baseplate, dari sensor LIG) ─── */}
          <View style={styles.card}>
            <CardHeader
              Icon={Droplets}
              iconBg="#f3e8ff"
              iconColor="#9333ea"
              title="Integritas Kulit"
              subtitle="Degradasi hidrokoloid dari sensor LIG"
            />
            <LineChart labels={kulit.labels} data={kulit.data} color="#a23bf0" />
            <View style={[styles.statusBox, { backgroundColor: '#f3e8ff', borderColor: '#e9d5ff' }]}>
              <Text style={styles.statusText}>
                <Text style={[styles.statusLabel, { color: '#9333ea' }]}>Status:</Text> Integritas{' '}
                <Text style={styles.statusBold}>{kulit.current}%</Text> - {kulit.status}
              </Text>
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
