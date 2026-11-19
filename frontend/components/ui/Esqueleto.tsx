import { memo, useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Palette, Radius, Spacing } from '@/constants/theme';

type Props = {
  ancho?: DimensionValue;
  alto?: number;
  radio?: number;
  style?: StyleProp<ViewStyle>;
};

/** Bloque gris que titila mientras llega el contenido. Es decorativo: la pantalla anuncia la carga. */
function EsqueletoBase({ ancho = '100%', alto = 16, radio = Radius.sm, style }: Props) {
  const opacidad = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const bucle = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidad, { toValue: 0.5, duration: 700, useNativeDriver: true }),
        Animated.timing(opacidad, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    bucle.start();
    return () => bucle.stop();
  }, [opacidad]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ width: ancho, height: alto, borderRadius: radio, backgroundColor: Palette.line, opacity: opacidad }, style]}
    />
  );
}

export const Esqueleto = memo(EsqueletoBase);

type PropsProductos = { filas?: number; etiqueta?: string };

/** Cuadrícula de dos columnas con tarjetas de producto en esqueleto. */
export function EsqueletoProductos({ filas = 2, etiqueta = 'Cargando productos' }: PropsProductos) {
  return (
    <View accessibilityLabel={etiqueta} accessibilityLiveRegion="polite" style={s.lista}>
      {Array.from({ length: filas }, (_, i) => (
        <View key={i} style={s.fila}>
          {[0, 1].map((c) => (
            <View key={c} style={s.tarjeta}>
              <Esqueleto alto={140} radio={Radius.md} />
              <Esqueleto ancho="80%" alto={14} style={s.linea} />
              <Esqueleto ancho="45%" alto={18} style={s.linea} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  lista: { gap: Spacing[3] },
  fila: { flexDirection: 'row', gap: Spacing[3] },
  tarjeta: { flex: 1, backgroundColor: Palette.card, borderRadius: Radius.lg, padding: Spacing[2], paddingBottom: Spacing[3] },
  linea: { marginTop: Spacing[2], marginHorizontal: Spacing[1] },
});
