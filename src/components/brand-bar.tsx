import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';

import { COLOR } from '@/constants/app-colors';

export function BrandBar({ eyebrow }: { eyebrow: string }) {
  const router = useRouter();
  return (
    <View style={styles.brandBar}>
      <View style={styles.brandLeft}>
        <Image source={require('@/assets/images/icon.png')} style={styles.brandLogo} />
        <View>
          <Text style={styles.brandTitle}>OstoSense</Text>
          <Text style={styles.brandEyebrow}>{eyebrow}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.brandAvatar} activeOpacity={0.7} onPress={() => router.push('/profil')}>
        <User color={COLOR.white} size={16} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  brandBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogo: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  brandTitle: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '700',
    color: COLOR.primary,
    lineHeight: 19,
  },
  brandEyebrow: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
    color: COLOR.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  brandAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLOR.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
