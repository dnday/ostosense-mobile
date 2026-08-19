import { Image, StyleSheet } from 'react-native';

// ponytail: native masih pakai peta statis dari Figma; pasang expo-maps saat mulai build native.
export function FacilityMap() {
  return (
    <Image
      source={require('@/assets/images/lokasi-map.png')}
      style={styles.map}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e8f4f8',
  },
});
