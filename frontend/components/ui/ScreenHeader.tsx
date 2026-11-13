import { ComponentProps, memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Palette, Spacing, TouchMin, Type } from '@/constants/theme';
import { CircleButton } from './CircleButton';

type Accion = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
};

type Props = {
  title: string;
  onBack?: () => void;
  /** Botón circular a la derecha. Sin él se deja un hueco para que el título quede centrado. */
  right?: Accion;
};

const volver = () => {
  if (router.canGoBack()) router.back();
};

/**
 * Encabezado de pantalla del diseño: volver a la izquierda, título centrado y,
 * opcionalmente, una acción a la derecha. Respeta la zona segura superior.
 */
function ScreenHeaderBase({ title, onBack = volver, right }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.fila, { paddingTop: insets.top + Spacing[3] }]}>
      <CircleButton icon="arrow-back" label="Volver" onPress={onBack} />

      <Text accessibilityRole="header" numberOfLines={1} style={s.titulo}>
        {title}
      </Text>

      {right ? (
        <CircleButton icon={right.icon} label={right.label} onPress={right.onPress} />
      ) : (
        <View style={s.hueco} />
      )}
    </View>
  );
}

export const ScreenHeader = memo(ScreenHeaderBase);

const s = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[5],
  },
  titulo: { ...Type.title3, color: Palette.ink, flex: 1, textAlign: 'center' },
  hueco: { width: TouchMin, height: TouchMin },
});
