import { ComponentProps, memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily, Palette, Radius, Spacing, TouchMin, Type } from '@/constants/theme';
import type { TipoOferta } from '@/utils/catalogo';
import { formatoPrecio } from '@/utils/formato';
import type { ProductoTarjeta } from '../../services/ofertas';

type Icono = ComponentProps<typeof Ionicons>['name'];

const ICONO_TIPO: Record<TipoOferta, Icono> = {
  'Segunda mano': 'pricetag-outline',
  Emprendimiento: 'storefront-outline',
  Servicio: 'school-outline',
};


type Props = {
  producto: ProductoTarjeta;
  onPress: (id: string) => void;
  onAgregar?: (id: string) => void;
};

/**
 * Tarjeta de producto del diseño: foto cuadrada 1:1, tipo, nombre, precio como segundo elemento más
 * fuerte, calificación, entrega en verde y botón de agregar de 48 px sin salir del listado.
 * Mientras no haya fotos reales, la foto es un bloque lima con el ícono del tipo.
 */
function ProductCardBase({ producto, onPress, onAgregar }: Props) {
  const { id, tipo, nombre, vendedor, precio, calificacion, resenas, disponible = true, propia = false } = producto;
  const abrir = useCallback(() => onPress(id), [onPress, id]);
  const agregar = useCallback(() => onAgregar?.(id), [onAgregar, id]);

  return (
    <Pressable
      onPress={abrir}
      accessibilityRole="button"
      accessibilityLabel={`${nombre}, ${formatoPrecio(precio)}${disponible ? '' : ', agotado'}`}
      style={({ pressed }) => [s.card, pressed && s.presionada]}
    >
      <View style={s.foto}>
        <Ionicons name={ICONO_TIPO[tipo]} size={40} color={Palette.green700} />
      </View>

      <View style={s.cuerpo}>
        <Text style={s.tipo} numberOfLines={1}>
          {tipo.toUpperCase()}
        </Text>
        <Text style={s.nombre} numberOfLines={2}>
          {nombre}
        </Text>
        {vendedor ? (
          <Text style={s.vendedor} numberOfLines={1}>
            {vendedor}
          </Text>
        ) : null}

        <View style={s.filaPrecio}>
          <Text style={s.precio}>{formatoPrecio(precio)}</Text>
        </View>

        <View style={s.filaDatos}>
          <Ionicons name="star" size={14} color={Palette.gold} />
          <Text style={s.calificacion}>{calificacion.toLocaleString('es-CO', { minimumFractionDigits: 1 })}</Text>
          <Text style={s.resenas}>({resenas})</Text>
        </View>

        <View style={s.filaPie}>
          <View style={s.entrega}>
            <Ionicons
              name={propia ? 'person-circle' : disponible ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={propia ? Palette.textMuted : disponible ? Palette.success : Palette.danger}
            />
            <Text
              style={[s.entregaTexto, { color: propia ? Palette.textMuted : disponible ? Palette.success : Palette.danger }]}
              numberOfLines={1}
            >
              {propia ? 'Tu publicación' : disponible ? 'Recoges hoy' : 'Agotado'}
            </Text>
          </View>

          {propia ? null : (
          <Pressable
            onPress={agregar}
            disabled={!disponible}
            accessibilityRole="button"
            accessibilityLabel={`Agregar ${nombre}`}
            accessibilityState={{ disabled: !disponible }}
            style={[s.agregar, !disponible && s.agregarOff]}
          >
            <Ionicons name="add" size={24} color={disponible ? Palette.ink : Palette.textMuted} />
          </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export const ProductCard = memo(ProductCardBase);

const s = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Palette.card,
    borderRadius: Radius.lg,
    padding: Spacing[2],
    gap: Spacing[2],
  },
  presionada: { opacity: 0.85 },
  foto: {
    aspectRatio: 1,
    borderRadius: Radius.md,
    backgroundColor: Palette.lima100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cuerpo: { paddingHorizontal: Spacing[1], paddingBottom: Spacing[1], gap: 2 },
  tipo: { ...Type.label, color: Palette.green700 },
  nombre: { ...Type.bodySm, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  vendedor: { ...Type.caption, color: Palette.textMuted },
  filaPrecio: { marginTop: Spacing[1] },
  precio: { ...Type.priceMd, color: Palette.ink },
  filaDatos: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  calificacion: { ...Type.caption, fontFamily: FontFamily.bodyBold, color: Palette.ink },
  resenas: { ...Type.caption, color: Palette.textMuted },
  filaPie: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[2] },
  entrega: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  entregaTexto: { ...Type.caption, fontFamily: FontFamily.bodyBold, flexShrink: 1 },
  agregar: {
    width: TouchMin,
    height: TouchMin,
    borderRadius: TouchMin / 2,
    backgroundColor: Palette.lima,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agregarOff: { backgroundColor: Palette.line },
});
