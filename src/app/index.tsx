import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Bell,
  CalendarClock,
  Shield,
  ShieldCheck,
  Package,
  Droplets,
  BarChart3,
  MapPin,
  BookOpen,
  ChevronRight,
  Wifi,
  RefreshCw,
  History,
} from 'lucide-react-native';

import { BottomNav } from '@/components/bottom-nav';
import { COLOR } from '@/constants/app-colors';

export default function HomePage() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ─── Header ─── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Halo, Budi 👋</Text>
              <Text style={styles.date}>Kamis, 22 Januari 2026</Text>
            </View>
            <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
              <Bell color={COLOR.textLight} size={20} />
            </TouchableOpacity>
          </View>

          {/* ─── Warning Banner ─── */}
          <TouchableOpacity style={styles.warningBanner} activeOpacity={0.8}>
            <View style={styles.warningIconWrap}>
              <CalendarClock color={COLOR.warningIcon} size={20} />
            </View>
            <View style={styles.warningTextWrap}>
              <Text style={styles.warningTitle}>Saatnya ganti kantong!</Text>
              <Text style={styles.warningDesc}>Sudah 84 hari sejak penggantian terakhir</Text>
            </View>
            <ChevronRight color={COLOR.warningIcon} size={16} />
          </TouchableOpacity>

          {/* ─── Big Circular Status Button ─── */}
          <View style={styles.statusBtnContainer}>
            <TouchableOpacity style={styles.statusBtnOuter} activeOpacity={0.8}>
              {/* Green glow ring */}
              <View style={styles.statusGlow} />
              {/* Gradient ring */}
              <LinearGradient
                colors={[COLOR.statusGlow, COLOR.shieldAccent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statusGradientRing}
              />
              {/* White inner circle */}
              <View style={styles.statusInner}>
                <Shield color={COLOR.shieldAccent} size={40} />
                <Text style={styles.statusLabel}>Aman</Text>
                <Text style={styles.statusSub}>Tap refresh</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* ─── Sensor Aktif Card ─── */}
          <View style={styles.sensorCard}>
            <View style={styles.sensorTop}>
              <View style={styles.sensorIconWrap}>
                <Wifi color={COLOR.teal} size={16} />
              </View>
              <View style={styles.sensorInfo}>
                <Text style={styles.sensorTitle}>Sensor Aktif</Text>
                <Text style={styles.sensorId}>OST-SNR-20241215-A7B3</Text>
              </View>
              <View style={styles.connectedBadge}>
                <View style={styles.connectedDot} />
                <Text style={styles.connectedLabel}>Terhubung</Text>
              </View>
            </View>
            <View style={styles.sensorActions}>
              <TouchableOpacity style={styles.sensorBtnDark} activeOpacity={0.8}>
                <RefreshCw color="#fff" size={12} />
                <Text style={styles.sensorBtnDarkText}>Ganti</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sensorBtnLight} activeOpacity={0.7}>
                <History color="#1a1a1a" size={12} />
                <Text style={styles.sensorBtnLightText}>Riwayat</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ─── 3 Sensor Metric Cards ─── */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#dbeafe' }]}>
                <Package color="#155dfc" size={20} />
              </View>
              <Text style={styles.metricLabel}>Volume</Text>
              <Text style={styles.metricValue}>45%</Text>
              <View style={styles.metricBarTrack}>
                <View style={[styles.metricBarFill, { width: '45%' }]} />
              </View>
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#d0fae5' }]}>
                <ShieldCheck color="#007a55" size={20} />
              </View>
              <Text style={styles.metricLabel}>Kebocoran</Text>
              <Text style={[styles.metricValue, { color: '#007a55' }]}>Rendah</Text>
              <View style={styles.metricStatusDot} />
            </View>

            <View style={styles.metricCard}>
              <View style={[styles.metricIconWrap, { backgroundColor: '#cefafe' }]}>
                <Droplets color="#0092b8" size={20} />
              </View>
              <Text style={styles.metricLabel}>Kulit</Text>
              <Text style={[styles.metricValue, { color: '#0092b8' }]}>Baik</Text>
              <View style={[styles.metricStatusDot, { backgroundColor: '#0092b8' }]} />
            </View>
          </View>

          {/* ─── Baru Ganti Kantong (Dark CTA) ─── */}
          <TouchableOpacity style={styles.ctaCard} activeOpacity={0.8}>
            <View style={styles.ctaLeft}>
              <View style={styles.ctaIconWrap}>
                <RefreshCw color="#fff" size={24} />
              </View>
              <View>
                <Text style={styles.ctaTitle}>Baru Ganti Kantong</Text>
                <Text style={styles.ctaDesc}>Catat waktu penggantian</Text>
              </View>
            </View>
            <ChevronRight color="#fff" size={20} />
          </TouchableOpacity>

          {/* ─── Info List Cards ─── */}
          <View style={styles.infoList}>
            <TouchableOpacity
              style={styles.infoRow}
              activeOpacity={0.7}
              onPress={() => router.push('/monitor')}>
              <View style={styles.infoIcon}>
                <BarChart3 color={COLOR.primary} size={24} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Data Hari Ini</Text>
                <Text style={styles.infoDesc}>Semua sensor berfungsi normal</Text>
              </View>
              <ChevronRight color={COLOR.chevron} size={16} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoRow}
              activeOpacity={0.7}
              onPress={() => router.push('/lokasi')}>
              <View style={styles.infoIcon}>
                <MapPin color={COLOR.primary} size={24} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Lokasi Terdekat</Text>
                <Text style={styles.infoDesc}>3 fasilitas dalam radius 2km</Text>
              </View>
              <ChevronRight color={COLOR.chevron} size={16} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoRow}
              activeOpacity={0.7}
              onPress={() => router.push('/edukasi')}>
              <View style={styles.infoIcon}>
                <BookOpen color={COLOR.primary} size={24} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Tips Hari Ini</Text>
                <Text style={styles.infoDesc}>Cara merawat kulit peristomal</Text>
              </View>
              <ChevronRight color={COLOR.chevron} size={16} />
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomNav active="beranda" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR.bg,
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.bg,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 28,
  },
  date: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: COLOR.textLight,
    lineHeight: 16,
    marginTop: 2,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLOR.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  /* ── Warning Banner ── */
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.redBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR.redBorder,
    padding: 12,
    gap: 12,
    marginBottom: 16,
    shadowColor: '#82181a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  warningIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffe2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningTextWrap: {
    flex: 1,
    gap: 2,
  },
  warningTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.red,
    lineHeight: 20,
  },
  warningDesc: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '400',
    color: '#b91c1c',
    lineHeight: 15,
  },

  /* ── Big Circular Status ── */
  statusBtnContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusBtnOuter: {
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLOR.statusGlow,
    opacity: 0.3,
  },
  statusGradientRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 12.5,
    elevation: 8,
  },
  statusInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLOR.white,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  statusLabel: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.green,
    lineHeight: 24,
    marginTop: 4,
  },
  statusSub: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '500',
    color: COLOR.textNav,
    lineHeight: 15,
  },

  /* ── Sensor Card ── */
  sensorCard: {
    backgroundColor: COLOR.white,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sensorTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sensorIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#cbfbf1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sensorInfo: {
    flex: 1,
    gap: 0,
  },
  sensorTitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 16,
  },
  sensorId: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '400',
    color: COLOR.textLight,
    lineHeight: 15,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  connectedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLOR.greenDot,
  },
  connectedLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: '#00786f',
    lineHeight: 15,
  },
  sensorActions: {
    flexDirection: 'row',
    gap: 8,
  },
  sensorBtnDark: {
    flex: 1,
    flexDirection: 'row',
    height: 32,
    backgroundColor: COLOR.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  sensorBtnDarkText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 16,
  },
  sensorBtnLight: {
    flex: 1,
    flexDirection: 'row',
    height: 32,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  sensorBtnLightText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 16,
  },

  /* ── Sensor Metric Cards ── */
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLOR.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eef1f6',
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  metricIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  metricLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '600',
    color: COLOR.textLight,
    lineHeight: 15,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: '#101828',
    lineHeight: 22,
  },
  metricBarTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#eef1f6',
    marginTop: 2,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#155dfc',
  },
  metricStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00bc7d',
    marginTop: 5,
  },

  /* ── CTA Card ── */
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLOR.primary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 7.5,
    elevation: 4,
  },
  ctaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ctaIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 24,
  },
  ctaDesc: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 16,
  },

  /* ── Info List ── */
  infoList: {
    gap: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR.white,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLOR.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  infoTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
    lineHeight: 20,
  },
  infoDesc: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: COLOR.textMuted,
    lineHeight: 16,
  },
});
