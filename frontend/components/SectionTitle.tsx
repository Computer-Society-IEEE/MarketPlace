import { Text, StyleSheet } from 'react-native';
import { Palette, Spacing} from '@/constants/theme';

export function SectionTitle({ children }: { children: string }) {
  return <Text style={s.title}>{children}</Text>;
}

const s = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 	Spacing[4],
    color: 	Palette.ink,
  },
});