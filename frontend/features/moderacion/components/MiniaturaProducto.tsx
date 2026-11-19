import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius } from '@/constants/theme';

/** Marcador de la foto del producto mientras no hay imágenes reales. */
export function MiniaturaProducto({ size = 64, icon = 'image-outline' }: { size?: number; icon?: 'image-outline' | 'camera-outline' }) {
  return (
    <View style={[s.caja, { width: size, height: size }]}>
      <Ionicons name={icon} size={Math.round(size / 2.6)} color={Palette.textMuted} />
    </View>
  );
}

const s = StyleSheet.create({
  caja: { borderRadius: Radius.md, backgroundColor: Palette.line, alignItems: 'center', justifyContent: 'center' },
});
