import { useState } from 'react';
import { Alert, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { Bell, ChevronRight, Cpu, HelpCircle, LogOut, Share2, UserPen } from 'lucide-react-native';

import { BottomNav } from '@/components/bottom-nav';
import { ShareAppModal } from '@/components/share-app-modal';
import { EditProfileModal } from '@/components/edit-profile-modal';
import { SensorInfoModal } from '@/components/sensor-info-modal';
import { NotificationsModal } from '@/components/notifications-modal';
import { HelpModal } from '@/components/help-modal';
import { COLOR } from '@/constants/app-colors';
import { useAuth } from '@/auth';
import { useSensorSeries } from '@/hooks/use-sensor-series';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

type MenuKey = 'edit' | 'sensor' | 'notif' | 'share' | 'help';

// ponytail: belum ada desain Figma untuk Profil — layout mengikuti pola layar lain; sesuaikan saat desainnya rilis.
const MENU: { Icon: typeof UserPen; label: string; desc: string; key: MenuKey }[] = [
  { Icon: UserPen, label: 'Edit Profil', desc: 'Ubah data diri', key: 'edit' },
  { Icon: Cpu, label: 'Perangkat Sensor', desc: 'ESP32_ASLI_01', key: 'sensor' },
  { Icon: Bell, label: 'Notifikasi', desc: 'Atur pengingat & peringatan', key: 'notif' },
  { Icon: Share2, label: 'Bagikan App', desc: 'QR & link download APK', key: 'share' },
  { Icon: HelpCircle, label: 'Bantuan', desc: 'FAQ & hubungi kami', key: 'help' },
];

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';
}

export default function ProfilPage() {
  const [openModal, setOpenModal] = useState<MenuKey | null>(null);
  const { signOut, user } = useAuth();
  const { series } = useSensorSeries();
  const name = user?.user_metadata?.full_name || user?.email || 'Pengguna';
  const connected = series.source !== 'loading';
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLOR.bg} />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Profil</Text>
            <Text style={styles.title}>Profil</Text>
            <Text style={styles.subtitle}>Kelola akun dan perangkat Anda</Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(name)}</Text>
            </View>
            <View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.role}>Pasien OstoSense</Text>
              <View style={styles.connectedBadge}>
                <View style={[styles.connectedDot, !connected && { backgroundColor: 'orange' }]} />
                <Text style={[styles.connectedLabel, !connected && { color: 'orange' }]}>
                  {connected ? 'Tersambung Real-time' : 'Menghubungkan...'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.menuList}>
            {MENU.map(({ Icon, label, desc, key }) => (
              <TouchableOpacity
                key={label}
                style={styles.menuRow}
                activeOpacity={0.7}
                onPress={() => setOpenModal(key)}
              >
                <View style={styles.menuIcon}>
                  <Icon color={COLOR.primary} size={22} />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuLabel}>{label}</Text>
                  <Text style={styles.menuDesc}>{desc}</Text>
                </View>
                {key === 'sensor' && connected && (
                  <View style={styles.sensorActiveBadge}>
                    <Text style={styles.sensorActiveText}>Aktif</Text>
                  </View>
                )}
                <ChevronRight color={COLOR.chevron} size={16} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.menuRow}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert('Keluar dari akun?', 'Anda perlu login lagi untuk memantau data sensor.', [
                  { text: 'Batal', style: 'cancel' },
                  { text: 'Keluar', style: 'destructive', onPress: signOut },
                ])
              }
            >
              <View style={[styles.menuIcon, { backgroundColor: COLOR.redBg }]}>
                <LogOut color={COLOR.warningIcon} size={22} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuLabel, { color: COLOR.warningIcon }]}>Keluar</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.versionFooter}>
            <Text style={styles.versionText}>OstoSense Patient Companion</Text>
            <Text style={styles.versionSub}>Versi {APP_VERSION}</Text>
          </View>
        </ScrollView>

        <BottomNav active="profil" />
        <EditProfileModal visible={openModal === 'edit'} onClose={() => setOpenModal(null)} />
        <SensorInfoModal visible={openModal === 'sensor'} onClose={() => setOpenModal(null)} />
        <NotificationsModal visible={openModal === 'notif'} onClose={() => setOpenModal(null)} />
        <ShareAppModal visible={openModal === 'share'} onClose={() => setOpenModal(null)} />
        <HelpModal visible={openModal === 'help'} onClose={() => setOpenModal(null)} />
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
  header: {
    marginBottom: 16,
    gap: 2,
  },
  eyebrow: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: COLOR.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLOR.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.white,
  },
  name: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 24,
  },
  role: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: COLOR.textLight,
    lineHeight: 16,
  },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
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
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sensorActiveBadge: {
    backgroundColor: COLOR.greenLight,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  sensorActiveText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: COLOR.green,
    lineHeight: 14,
  },
  versionFooter: {
    marginTop: 24,
    alignItems: 'center',
    gap: 2,
  },
  versionText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: COLOR.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  versionSub: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '400',
    color: COLOR.textMuted,
  },
  menuList: {
    gap: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLOR.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLOR.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
  },
  menuLabel: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 20,
  },
  menuDesc: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '400',
    color: COLOR.textLight,
    lineHeight: 15,
  },
});
