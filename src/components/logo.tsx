import { Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { COLOR } from '@/constants/app-colors';

/** OstoSense mark: shield (protection) + drop cut-out (leak/volume sensing). */
export function Logo({ size = 72, withWordmark = false }: { size?: number; withWordmark?: boolean }) {
  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: COLOR.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: COLOR.shieldAccent,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24">
          <Defs>
            <LinearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={COLOR.statusGlow} />
              <Stop offset="1" stopColor={COLOR.shieldAccent} />
            </LinearGradient>
          </Defs>
          <Path
            fill="url(#mark)"
            d="M12 2 4 5v6c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V5l-8-3Zm0 3.2 5.5 2V11c0 3.9-2.4 7.5-5.5 8.6-.7-.25-1.36-.6-1.96-1.03C11.14 16.9 12.6 14.6 12 12c-.42-1.8-2.1-2.9-2.1-2.9S12 7.4 12 5.2Z"
          />
        </Svg>
      </View>
      {withWordmark && <Text style={{ fontSize: 22, fontWeight: '700', color: COLOR.primary }}>OstoSense</Text>}
    </View>
  );
}
