import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Palette, Radius, Spacing } from '@/constants/theme';

type Props = { children: ReactNode; style?: StyleProp<ViewStyle> };

/** Tarjeta base: fondo de tarjeta, esquinas de 20 px y separación interna entre sus hijos. */
export function Card({ children, style }: Props) {
  return <View style={[s.card, style]}>{children}</View>;
}

const s = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    gap: Spacing[4],
  },
});

