import { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Spacing } from '@/constants/theme';
import { UserRow } from '@/components/ui/UserRow';
import { Oferta } from '../../services/ofertas';

const AVATAR = 40;

type Props = {
  oferta: Oferta;
  /** Recibe el id: el padre pasa una sola función estable para toda la lista. */
  onPress: (id: string) => void;
};

function OfertaRowBase({ oferta, onPress }: Props) {
  const alPresionar = useCallback(() => onPress(oferta.id), [onPress, oferta.id]);

  return (
    <Pressable
      onPress={alPresionar}
      accessibilityRole="button"
      accessibilityLabel={`${oferta.nombre}, de ${oferta.vendedor}`}
      style={({ pressed }) => pressed && s.presionada}
    >
      <UserRow name={oferta.nombre} size={AVATAR} style={s.fila} />
    </Pressable>
  );
}

export const OfertaRow = memo(OfertaRowBase);

const s = StyleSheet.create({
  fila: { paddingHorizontal: Spacing[6], paddingVertical: Spacing[4] },
  presionada: { opacity: 0.7 },
});
