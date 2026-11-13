import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Spacing, TouchMin, Type } from '@/constants/theme';

type Props = {
  checked: boolean;
  onChange: (valor: boolean) => void;
  label: string;
};

/** Casilla con texto. Toda la fila es el área táctil (mínimo 48 px). */
function CheckboxBase({ checked, onChange, label }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      aria-checked={checked}
      accessibilityLabel={label}
      style={s.fila}
    >
      <View style={[s.caja, checked && s.cajaMarcada]}>
        {checked && <Ionicons name="checkmark" size={16} color={Palette.card} />}
      </View>
      <Text style={s.texto}>{label}</Text>
    </Pressable>
  );
}

export const Checkbox = memo(CheckboxBase);

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3], minHeight: TouchMin },
  caja: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Palette.ink,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cajaMarcada: { backgroundColor: Palette.ink },
  texto: { ...Type.bodySm, color: Palette.ink, flex: 1 },
});
