import { ComponentProps } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius, TouchMin } from '@/constants/theme';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string; // lectura para lectores de pantalla
  onPress: () => void;
};

/** Círculo de 48 px sobre la barra oscura (volver, menú). */
export default function IconButton({ icon, label, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={icon} size={24} color={Palette.card} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: TouchMin,
    height: TouchMin,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(253, 252, 249, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});