import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import {
  Video,
  FileText,
  UserCheck,
  Play,
  UtensilsCrossed,
  Plane,
  Wind,
  PersonStanding,
} from 'lucide-react-native';

import { BottomNav } from '@/components/bottom-nav';
import { COLOR } from '@/constants/app-colors';

const ARTICLES = [
  { Icon: UtensilsCrossed, title: 'Tips Diet', duration: '5 min' },
  { Icon: Plane, title: 'Perjalanan', duration: '7 min' },
  { Icon: Wind, title: 'Mengelola Bau', duration: '4 min' },
  { Icon: PersonStanding, title: 'Olahraga Aman', duration: '6 min' },
];

export default function EdukasiPage() {
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
            <Text style={styles.title}>Edukasi & Komunitas</Text>
            <Text style={styles.subtitle}>Pelajari lebih lanjut</Text>
          </View>

          {/* ─── Stat Row ─── */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Video color={COLOR.primary} size={20} />
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Video</Text>
            </View>
            <View style={styles.statCard}>
              <FileText color={COLOR.primary} size={20} />
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Artikel</Text>
            </View>
            <View style={styles.statCard}>
              <UserCheck color={COLOR.primary} size={20} />
              <Text style={styles.statValue}>1.2k</Text>
              <Text style={styles.statLabel}>Anggota</Text>
            </View>
          </View>

          {/* ─── Video Pilihan ─── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Video Pilihan</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.sectionAction}>Semua</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.videoCard} activeOpacity={0.8}>
              <Image
                source={require('@/assets/images/edukasi-video-tutorial.jpg')}
                style={styles.videoThumb}
              />
              <View style={styles.videoOverlay}>
                <View style={styles.playBtn}>
                  <Play color={COLOR.primary} fill={COLOR.primary} size={20} />
                </View>
              </View>
              <View style={styles.videoBadgeTutorial}>
                <Text style={styles.videoBadgeText}>Tutorial</Text>
              </View>
              <View style={styles.videoBadgeDuration}>
                <Text style={styles.videoBadgeText}>8:45</Text>
              </View>
              <Text style={styles.videoCaption}>Cara Mengganti Kantong dengan Benar</Text>
            </TouchableOpacity>
          </View>

          {/* ─── Artikel ─── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Artikel</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.sectionAction}>Semua</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.articleGrid}>
              {ARTICLES.map(({ Icon, title, duration }) => (
                <TouchableOpacity key={title} style={styles.articleCard} activeOpacity={0.7}>
                  <View style={styles.articleIconWrap}>
                    <Icon color={COLOR.primary} size={24} />
                  </View>
                  <Text style={styles.articleTitle}>{title}</Text>
                  <Text style={styles.articleDuration}>{duration}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ─── Komunitas ─── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Komunitas</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.sectionAction}>Gabung</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.postCard}>
              <View style={styles.postTop}>
                <Image
                  source={require('@/assets/images/edukasi-avatar-dewi.jpg')}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.postAuthor}>Dewi S.</Text>
                  <Text style={styles.postTime}>2 jam lalu</Text>
                </View>
              </View>
              <Text style={styles.postBody}>
                Hari ini pertama kali saya berenang sejak operasi! Tips dari grup ini sangat
                membantu 💙
              </Text>
              <View style={styles.postActions}>
                <Text style={styles.postActionText}>❤️ 24</Text>
                <Text style={styles.postActionText}>💬 Balas</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <BottomNav active="edukasi" />
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

  /* ── Stat Row ── */
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLOR.white,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 24,
  },
  statLabel: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '500',
    color: COLOR.textLight,
    lineHeight: 15,
  },

  /* ── Section ── */
  section: {
    marginBottom: 16,
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 20,
  },
  sectionAction: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLOR.primary,
    lineHeight: 16,
  },

  /* ── Video Card ── */
  videoCard: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  videoThumb: {
    width: '100%',
    height: 112,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 112,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  videoBadgeTutorial: {
    position: 'absolute',
    left: 8,
    top: 8,
    backgroundColor: COLOR.primary,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  videoBadgeDuration: {
    position: 'absolute',
    right: 8,
    top: 84,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  videoBadgeText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLOR.white,
    lineHeight: 16,
  },
  videoCaption: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 20,
    padding: 10,
  },

  /* ── Article Grid ── */
  articleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  articleCard: {
    width: '48.5%',
    backgroundColor: COLOR.white,
    borderRadius: 10,
    padding: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  articleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLOR.blueLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleTitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 16,
  },
  articleDuration: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: COLOR.primary,
    lineHeight: 15,
  },

  /* ── Community Post Card ── */
  postCard: {
    backgroundColor: COLOR.white,
    borderRadius: 16,
    padding: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  postTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  postAuthor: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '700',
    color: COLOR.text,
    lineHeight: 16,
  },
  postTime: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '400',
    color: COLOR.textLight,
    lineHeight: 15,
  },
  postBody: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: COLOR.text,
    lineHeight: 19.5,
  },
  postActions: {
    flexDirection: 'row',
    gap: 12,
  },
  postActionText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: COLOR.textMuted,
    lineHeight: 16,
  },
});
