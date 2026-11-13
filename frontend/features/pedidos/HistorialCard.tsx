import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Spacing } from '@/constants/theme';
import { UserRow } from '@/components/ui/UserRow';
import { Card } from '@/components/ui/Card';
import { DescripcionBox } from '@/assets/DescripcionBox';
import { CompraHistorial } from './historial';

type Props = {
  compra: CompraHistorial;
  onQuitar: (id: string) => void;
};

function HistorialCardBase({ compra, onQuitar }: Props) {
  const quitar = useCallback(() => onQuitar(compra.id), [onQuitar, compra.id]);

  return (
    // La celda reserva espacio para el botón, que sobresale de la tarjeta
    <View style={s.celda}>
      <Card style={s.tarjeta}>
        <Pressable
          onPress={quitar}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Quitar del historial"
          style={s.quitar}
        >
          <Ionicons name="close-circle" size={24} color={Palette.lima} />
        </Pressable>

        <UserRow name={compra.vendedor} />
        <DescripcionBox texto={compra.descripcion} centrado />
      </Card>
    </View>
  );
}

export const HistorialCard = memo(HistorialCardBase);

const s = StyleSheet.create({
  celda: { paddingHorizontal: Spacing[6], paddingTop: 10 },
  tarjeta: { gap: 10 },
  quitar: { position: 'absolute', top: -10, right: -10, zIndex: 1 },
});
