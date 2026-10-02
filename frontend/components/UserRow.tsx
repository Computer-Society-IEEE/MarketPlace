import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { AVATAR, SPACING, SURFACE, TEXT } from '../constants/plantilla';

export function Avatar({ size = AVATAR.sm }: { size?: number }) {
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: SURFACE.avatar }}
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
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  name: { fontSize: 15, color: TEXT.primary },
});