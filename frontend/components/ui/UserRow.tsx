import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Palette, Spacing, Type } from '@/constants/theme';
const AVATAR_SM = 32;
export function Avatar({ size = AVATAR_SM }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: Palette.line,
      }}
    />
  );
}

type Props = { name: string; size?: number; style?: StyleProp<ViewStyle> };

export function UserRow({ name, size, style }: Props) {
  return (
    <View style={[s.row, style]}>
      <Avatar size={size} />
      <Text style={s.name}>{name}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap:Spacing[4]  },
  name: { ...Type.body, color: Palette.ink},
});