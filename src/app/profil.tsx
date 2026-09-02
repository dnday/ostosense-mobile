import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ChevronRight, Cpu, HelpCircle, LogOut, Share2, UserPen } from 'lucide-react-native';

import { BottomNav } from '@/components/bottom-nav';
import { COLOR } from '@/constants/app-colors';
import { useAuth } from '@/auth';

// ponytail: belum ada desain Figma untuk Profil — layout mengikuti pola layar lain; sesuaikan saat desainnya rilis.
const MENU = [
  { Icon: UserPen, label: 'Edit Profil', desc: 'Ubah data diri' },
  { Icon: Cpu, label: 'Perangkat Sensor', desc: 'OST-SNR-20241215-A7B3' },
  { Icon: Bell, label: 'Notifikasi', desc: 'Atur pengingat & peringatan' },
  { Icon: Share2, label: 'Bagikan App', desc: 'QR & link download APK', route: '/share-app' },
  { Icon: HelpCircle, label: 'Bantuan', desc: 'FAQ & hubungi kami' },
];

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';
}

export default function ProfilPage() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const name = user?.user_metadata?.full_name || user?.email || 'Pengguna';
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
            <Text style={styles.title}>Profil</Text>
            <Text style={styles.subtitle}>Kelola akun dan perangkat Anda</Text>
          </View>

          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initialsOf(name)}</Text>
            </View>
            <View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.role}>Pasien Rawat Jalan</Text>
            </View>
          </View>

          <View style={styles.menuList}>
            {MENU.map(({ Icon, label, desc, route }) => (
              <TouchableOpacity
                key={label}
                style={styles.menuRow}
                activeOpacity={0.7}
                onPress={route ? () => router.push(route as never) : undefined}
              >
                <View style={styles.menuIcon}>
                  <Icon color={COLOR.primary} size={22} />
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuLabel}>{label}</Text>
                  <Text style={styles.menuDesc}>{desc}</Text>
                </View>
                <ChevronRight color={COLOR.chevron} size={16} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.menuRow} activeOpacity={0.7} onPress={signOut}>
              <View style={[styles.menuIcon, { backgroundColor: COLOR.redBg }]}>
                <LogOut color={COLOR.warningIcon} size={22} />
              </View>
              <View style={styles.menuText}>
                <Text style={[styles.menuLabel, { color: COLOR.warningIcon }]}>Keluar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomNav active="profil" />
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
