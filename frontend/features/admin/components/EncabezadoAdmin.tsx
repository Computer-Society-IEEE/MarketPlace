import { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Chip } from '@/components/ui/Chip';
import { CircleButton } from '@/components/ui/CircleButton';
import { Palette, Spacing, Type } from '@/constants/theme';
import { ADMIN_ACTUAL } from '../services/sesion';

type Props = {
  title: string;
  accion?: { icon: ComponentProps<typeof Ionicons>['name']; label: string; onPress: () => void };
};

/** Encabezado de las pestañas de administración: título, etiqueta del administrador y una acción opcional. */
export function EncabezadoAdmin({ title, accion }: Props) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[s.fila, { paddingTop: top + Spacing[3] }]}>
      <View style={s.textos}>
        <Text accessibilityRole="header" style={s.titulo}>{title}</Text>
        <Chip label={`Administrador · ${ADMIN_ACTUAL.nombre}`} tone="oscuro" icon="shield-checkmark-outline" />
      </View>
      {accion && <CircleButton icon={accion.icon} label={accion.label} onPress={accion.onPress} />}
    </View>
  );
}

const s = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing[3], paddingHorizontal: Spacing[5] },
  textos: { gap: Spacing[1], flexShrink: 1 },
  titulo: { ...Type.title1, color: Palette.ink },
});
