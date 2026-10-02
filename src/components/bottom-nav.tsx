import { Platform, Pressable, PressableStateCallbackType, StyleSheet, Text, View } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { BookOpen, Gauge, Home, Map, User } from 'lucide-react-native';

import { COLOR } from '@/constants/app-colors';

export type NavTab = 'beranda' | 'monitor' | 'lokasi' | 'edukasi' | 'profil';

// Ikon yang tetap bagus saat di-fill solid; sisanya cukup stroke tebal di dalam pill.
const FILLABLE: NavTab[] = ['beranda', 'profil'];

const TABS: { key: NavTab; label: string; Icon: typeof Home; href: Href }[] = [
  { key: 'beranda', label: 'Beranda', Icon: Home, href: '/' },
  { key: 'monitor', label: 'Monitor', Icon: Gauge, href: '/monitor' },
  { key: 'lokasi', label: 'Lokasi', Icon: Map, href: '/lokasi' },
  { key: 'edukasi', label: 'Edukasi', Icon: BookOpen, href: '/edukasi' },
  { key: 'profil', label: 'Profil', Icon: User, href: '/profil' },
];

// RN-web menambah state `hovered` yang tidak ada di tipe RN.
const isHovered = (state: PressableStateCallbackType) =>
  (state as PressableStateCallbackType & { hovered?: boolean }).hovered === true;

export function BottomNav({ active }: { active: NavTab }) {
  const router = useRouter();
  return (
    <View style={styles.bottomNav}>
      {TABS.map(({ key, label, Icon, href }) => {
        const isActive = key === active;
        return (
          <Pressable
            key={key}
            style={styles.navItem}
            onPress={() => router.push(href)}>
            {(state) => {
              const hovered = isHovered(state);
              const highlight = isActive || hovered;
              const color = highlight ? COLOR.primary : COLOR.textNav;
              return (
                <>
                  <View
                    style={[
                      styles.iconPill,
                      isActive && styles.iconPillActive,
                      !isActive && hovered && styles.iconPillHover,
                      state.pressed && styles.iconPillPressed,
                    ]}>
                    <Icon
                      color={color}
                      fill={isActive && FILLABLE.includes(key) ? color : 'none'}
                      strokeWidth={highlight ? 2.4 : 2}
                      size={24}
                    />
                  </View>
                  <Text style={[styles.navLabel, highlight && styles.navLabelActive]}>
                    {label}
                  </Text>
                </>
              );
            }}
          </Pressable>
        );
      })}
    </View>
  );
}

// Properti transition hanya berlaku di react-native-web; di native diabaikan.
const webTransition =
  Platform.OS === 'web'
    ? ({
        transitionProperty: 'background-color, transform',
        transitionDuration: '150ms',
      } as object)
    : null;

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 96 : 80,
    backgroundColor: COLOR.white,
    flexDirection: 'row',
    shadowColor: '#1d2f4a',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingBottom: Platform.OS === 'ios' ? 16 : 0,
  },
  iconPill: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'transparent',
    ...webTransition,
  },
  iconPillActive: {
    backgroundColor: 'transparent',
  },
  iconPillHover: {
    backgroundColor: '#f2f4f7',
  },
  iconPillPressed: {
    backgroundColor: '#eef1f6',
    transform: [{ scale: 0.92 }],
  },
  navLabel: {
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '500',
    color: COLOR.textNav,
    lineHeight: 16,
    ...webTransition,
  },
  navLabelActive: {
    color: COLOR.primary,
    fontWeight: '700',
  },
});
