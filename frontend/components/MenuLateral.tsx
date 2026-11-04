import { useEffect, useRef, useState } from 'react';
import {
    Modal, Pressable, Animated, Text, View, ScrollView, StyleSheet, useWindowDimensions,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import {FontFamily, Palette, Radius, Spacing, TouchMin, Type} from '../constants/theme';
import { Avatar } from './UserRow';
import { ActionButton } from './ActionButton';
const opciones = [
  { label: 'Inicio',    ruta: '/Comprador/hubcomprador' },
  { label: 'Mi cuenta',    ruta: '/Comprador/BuscarProducto' },
  { label: 'Mis pedidos', ruta: '/Comprador/historialComprador' },
  { label: 'Favoritos', ruta: '/Comprador/historialComprador' },
  { label: 'Mensajes', ruta: '/Comprador/historialComprador' },
  { label: 'Tiendas física', ruta: '/Comprador/selectorSede' },
];
const opcionesInf = [
  { label: 'Ajustes', ruta: '/Comprador/historialComprador' },
  { label: 'Ayuda', ruta: '/Comprador/historialComprador' },
  { label: 'Cerrar sesión', ruta: '/login' },
];
// Datos temporales
const usuario = { nombre: 'Nombre Apellido', correo: 'correo@ejemplo.com' };
type Props = { visible: boolean; onClose: () => void };

export function MenuLateral({ visible, onClose }: Props) {
  const { width } = useWindowDimensions();
  const anchoPanel = width / 3*2; // 2/3
  const pathname = usePathname();

  const x = useRef(new Animated.Value(-anchoPanel)).current;
  const [montado, setMontado] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMontado(true);
      Animated.timing(x, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    } else {
      Animated.timing(x, { toValue: -anchoPanel, duration: 200, useNativeDriver: true }).start(
        () => setMontado(false)
      );
    }
  }, [visible]);

  // Fondo oscurecido
  const opacidadFondo = x.interpolate({
    inputRange: [-anchoPanel, 0],
    outputRange: [0, 1],
  });

  const ir = (ruta: string) => {
    onClose();
    if (ruta !== pathname) router.push(ruta as any);
  };
  const [ajustes, ayuda, cerrarSesion] = opcionesInf;
  const renderOpcion = (op: { label: string; ruta: string }) => {
  const activa = op.ruta === pathname;
  return (
      <Pressable
        key={op.label}
        accessibilityRole="button"
        accessibilityState={{ selected: activa }}
        onPress={() => ir(op.ruta)}
        style={({ pressed, hovered }: any) => [
          s.item,
          (pressed || hovered || activa) && s.itemActivo,
        ]}
      >
        <Text style={[s.itemTexto, activa && s.itemTextoActivo]}>{op.label}</Text>
      </Pressable>
    );
  };
  return (
    <Modal visible={montado} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, s.fondo, { opacity: opacidadFondo }]} />

      {/* Tocar fuera del panel cierra el menú */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      {/* Panel */}
      <Animated.View style={[s.panel, { width: anchoPanel, transform: [{ translateX: x }] }]}>
        {/* Cabecera */}
        <View style={s.cabecera}>
            <Avatar size={56} />
            <View style={s.cabeceraTextos}>
              <Text style={s.nombre} numberOfLines={1}>{usuario.nombre}</Text>
              <Text style={s.correo} numberOfLines={1}>{usuario.correo}</Text>
            </View>
        </View>
        {/* Tarjeta lima */}
        <View style={s.tarjeta}>
          <View style={s.tarjetaFila}>
            <View style={s.tarjetaTextos}>
              <Text style={s.tarjetaTitulo} numberOfLines={2}>Nombre tienda</Text>
              <Text style={s.tarjetaSub} numberOfLines={2}>Tu emprendimiento</Text>
            </View>
            <View style={s.circulo} />
          </View>

          <ActionButton
            label="Cambiar a perfil de vendedor"
            variant="dark"
            size="sm"
            onPress={() => {}}
            style={s.tarjetaBoton}
          />
        </View>
        {/* Opciones principales (con scroll) */}
        <ScrollView
          style={s.opciones}
          contentContainerStyle={s.opcionesContenido}
          showsVerticalScrollIndicator={false}
        >
        {opciones.map(renderOpcion)}
        <View style={s.divisor} />
        {renderOpcion(ajustes)}
        {renderOpcion(ayuda)}
        </ScrollView>

        {/* Bloque inferior:Boton */}
        <View style={s.inferior}>
          <ActionButton
            label={cerrarSesion.label}
            variant="dark"
            size="sm"
            onPress={() => ir(cerrarSesion.ruta)}
            style={s.tarjetaBoton}
          />
        </View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  fondo: { backgroundColor: 'rgba(0,0,0,0.5)' },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Palette.card,
    paddingTop: 60,
    paddingBottom: Spacing[8],
    paddingHorizontal: 	Spacing[3],
    borderTopRightRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  // Cabecera
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingHorizontal: Spacing[2],
    marginBottom: Spacing[5],
  },
  cabeceraTextos: { flex: 1 },
  nombre: { ...Type.title2, color: Palette.ink },
  correo: { ...Type.caption, color: Palette.textMuted },

  // Tarjeta lima
  tarjeta: {
    backgroundColor: Palette.lima,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    gap: Spacing[3],
  },
  tarjetaFila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  tarjetaTextos: { flex: 1 },
  tarjetaTitulo: { ...Type.title3, color: Palette.ink },
  tarjetaSub: { ...Type.caption, color: Palette.ink },
  circulo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Palette.ink,
  },
  tarjetaBoton: {
    justifyContent: 'center',
    borderRadius: Radius.full,
    alignSelf: 'stretch',
  },

// Opciones
  opciones: { flex: 1, marginTop: Spacing[4] },
   opcionesContenido: { gap: Spacing[1] },
  item: {
    minHeight: TouchMin,
    justifyContent: 'center',
    paddingHorizontal: Spacing[4],
    borderRadius: Radius.md,
  },
  itemActivo: { backgroundColor: Palette.lima },
  itemTexto: { ...Type.bodyLg, color: Palette.ink },
  itemTextoActivo: { fontFamily: FontFamily.bodyMedium },
   divisor: {
    height: 1,
    backgroundColor: Palette.line,
    marginVertical: Spacing[2],
    marginHorizontal: Spacing[2],
  },

  inferior: {
    gap: Spacing[2],
    paddingTop: Spacing[3],
  },
});