import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontFamily, Palette, Spacing, TouchMin, Type } from '@/constants/theme';

type Props = {
  title: string;
  /** Enlace a la derecha ("Ver todo", "Ver pedidos"). Se muestra subrayado, como en el diseño. */
  actionLabel?: string;
  onAction?: () => void;
};

/** Encabezado de sección: título a la izquierda (title3) y enlace opcional a la derecha. */
function SectionHeaderBase({ title, actionLabel, onAction }: Props) {
  return (
    <View style={s.row}>
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="link" accessibilityLabel={actionLabel} style={s.action}>
          <Text style={s.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const SectionHeader = memo(SectionHeaderBase);

const s = StyleSheet.create({
  row: {
    minHeight: TouchMin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[3],
  },
  title: { ...Type.title3, color: Palette.ink, flexShrink: 1 },
  action: { minHeight: TouchMin, paddingHorizontal: Spacing[1], justifyContent: 'center' },
  actionText: {
    ...Type.bodySm,
    fontFamily: FontFamily.bodyBold,
    color: Palette.ink,
    textDecorationLine: 'underline',
  },
});
