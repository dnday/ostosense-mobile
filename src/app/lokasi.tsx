import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Cross, MapPin, Pill, Toilet } from 'lucide-react-native';

import { BottomNav } from '@/components/bottom-nav';
import { FacilityMap } from '@/components/facility-map';
import { COLOR } from '@/constants/app-colors';

const KIND = {
  toilet: { Icon: Toilet, gradient: ['#615fff', '#4f39f6'] as const },
  rs: { Icon: Cross, gradient: ['#00b8db', '#0092b8'] as const },
  apotek: { Icon: Pill, gradient: ['#2b7fff', '#155dfc'] as const },
};

const LOCATIONS: { kind: keyof typeof KIND; name: string; address: string; distance: string; hours: string }[] = [
  { kind: 'toilet', name: 'Toilet Accessible Plaza Indonesia', address: 'Jl. M.H. Thamrin No.28-30, Jakarta Pusat', distance: '0.3 km', hours: '24 Jam' },
  { kind: 'rs', name: 'RS Cipto Mangunkusumo - Klinik Stoma', address: 'Jl. Pangeran Diponegoro No.71, Jakarta Pusat', distance: '1.2 km', hours: '08:00 - 16:00' },
  { kind: 'apotek', name: 'Apotek Kimia Farma - Supplies Ostomy', address: 'Grand Indonesia Mall, Jakarta', distance: '0.5 km', hours: '10:00 - 22:00' },
  { kind: 'rs', name: 'RS Medika Permata Hijau', address: 'Jl. Kebayoran Lama No.64, Jakarta Selatan', distance: '3.8 km', hours: '24 Jam' },
  { kind: 'toilet', name: 'Toilet Umum Senayan City', address: 'Senayan City Mall, Jakarta Selatan', distance: '2.1 km', hours: '10:00 - 22:00' },
  { kind: 'apotek', name: 'Apotek Guardian - Medical Supplies', address: 'Pacific Place Mall, Jakarta', distance: '0.8 km', hours: '10:00 - 22:00' },
  { kind: 'rs', name: 'RS Siloam - Wound Care Center', address: 'Jl. Garnisun Dalam No.2-3, Jakarta Pusat', distance: '2.5 km', hours: '24 Jam' },
  { kind: 'toilet', name: 'Toilet Accessible FX Sudirman', address: 'Jl. Jend. Sudirman, Jakarta Pusat', distance: '1.5 km', hours: '10:00 - 22:00' },
];

// ponytail: filter chips and map are static mockup (map = Figma PNG export). Wire real filtering + a map lib when there's real location data.
export default function LokasiPage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLOR.white} />
      <View style={styles.container}>
        {/* ─── Header ─── */}
        <View style={styles.header}>
          <Text style={styles.title}>Lokasi Terdekat</Text>
          <Text style={styles.subtitle}>Temukan fasilitas di sekitar Anda</Text>
        </View>

        {/* ─── Filter Chips ─── */}
        <View style={styles.chipRow}>
          <TouchableOpacity style={[styles.chip, styles.chipActive]} activeOpacity={0.7}>
            <Text style={styles.chipActiveText}>Semua</Text>
          </TouchableOpacity>
          {(
            [
              ['Toilet', Toilet],
              ['RS', Cross],
              ['Apotek', Pill],
            ] as const
          ).map(([label, Icon]) => (
            <TouchableOpacity key={label} style={styles.chip} activeOpacity={0.7}>
              <Icon color="#364153" size={14} />
              <Text style={styles.chipText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ─── Map ─── */}
        <FacilityMap />

        {/* ─── Bottom Sheet ─── */}
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>8 Lokasi Ditemukan</Text>
          <ScrollView
            contentContainerStyle={styles.sheetList}
            showsVerticalScrollIndicator={false}
          >
            {LOCATIONS.map(({ kind, name, address, distance, hours }) => {
              const { Icon, gradient } = KIND[kind];
              return (
                <TouchableOpacity key={name} style={styles.locCard} activeOpacity={0.7}>
                  <LinearGradient
                    colors={gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.locIconWrap}
                  >
                    <Icon color={COLOR.white} size={20} />
                  </LinearGradient>
                  <View style={styles.locInfo}>
                    <Text style={styles.locName} numberOfLines={1}>
                      {name}
                    </Text>
                    <Text style={styles.locAddress} numberOfLines={1}>
                      {address}
                    </Text>
                    <View style={styles.locMeta}>
                      <View style={styles.distanceBadge}>
                        <MapPin color="#1447e6" size={12} />
                        <Text style={styles.distanceText}>{distance}</Text>
                      </View>
                      <Text style={styles.hoursText}>{hours}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <BottomNav active="lokasi" />
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

  /* ── Header ── */
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 8,
    gap: 2,
    backgroundColor: COLOR.white,
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

  /* ── Filter Chips ── */
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: COLOR.white,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: '#030213',
    borderColor: '#030213',
  },
  chipText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#364153',
    lineHeight: 16,
  },
  chipActiveText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLOR.white,
    lineHeight: 16,
  },

  /* ── Bottom Sheet ── */
  sheet: {
    height: '46%',
    marginTop: -16,
    backgroundColor: COLOR.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#d1d5dc',
    marginTop: 8,
    marginBottom: 8,
  },
  sheetTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sheetList: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 8,
  },

  /* ── Location Card ── */
  locCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
  },
  locIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locInfo: {
    flex: 1,
    gap: 2,
  },
  locName: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: '#101828',
    lineHeight: 20,
  },
  locAddress: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: COLOR.textMuted,
    lineHeight: 16,
  },
  locMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: '#dbeafe',
  },
  distanceText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: '#1447e6',
    lineHeight: 16,
  },
  hoursText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: COLOR.textNav,
    lineHeight: 16,
  },
});
