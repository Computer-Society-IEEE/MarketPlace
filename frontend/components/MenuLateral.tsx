import { useEffect, useRef, useState } from 'react';
import {
  Modal, Pressable, Animated, Text, TouchableOpacity, StyleSheet, useWindowDimensions,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { SPACING, TEXT, SURFACE } from '../constants/plantilla';

const opciones = [
  { label: 'Editar perfil',    ruta: '/Comprador/hubcomprador' },
  { label: 'Buscar',    ruta: '/Comprador/BuscarProducto' },
  { label: 'Log out', ruta: '/Comprador/historialComprador' },
];

type Props = { visible: boolean; onClose: () => void };

export function MenuLateral({ visible, onClose }: Props) {
  const { width } = useWindowDimensions();
  const anchoPanel = width / 2; // media ventana
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

  return (
    <Modal visible={montado} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      {/* Fondo oscurecido */}
      <Animated.View style={[StyleSheet.absoluteFill, s.fondo, { opacity: opacidadFondo }]} />

      {/* Tocar fuera del panel cierra el menú */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      {/* Panel */}
      <Animated.View style={[s.panel, { width: anchoPanel, transform: [{ translateX: x }] }]}>
        {opciones.map((op) => (
          <TouchableOpacity key={op.label} style={s.item} onPress={() => ir(op.ruta)}>
            <Text style={s.itemTexto}>{op.label}</Text>
          </TouchableOpacity>
        ))}
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
    backgroundColor: SURFACE.screen,
    paddingTop: 60,
    paddingHorizontal: SPACING.lg,
  },
  item: { paddingVertical: SPACING.md },
  itemTexto: { fontSize: 16, color: TEXT.primary },
});