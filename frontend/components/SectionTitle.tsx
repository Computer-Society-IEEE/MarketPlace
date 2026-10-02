import { Text, StyleSheet } from 'react-native';
import { SPACING, TEXT } from '../constants/plantilla';

export function SectionTitle({ children }: { children: string }) {
  return <Text style={s.title}>{children}</Text>;
}

const s = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: SPACING.md,
    color: TEXT.primary,
  },
});