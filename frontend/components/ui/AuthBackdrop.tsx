import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Palette } from '@/constants/theme';

type Props = {
  /** Alto del bloque lima. La franja clara de atrás es 34 px más alta. */
  alto?: number;
};

/**
 * Las dos formas verdes del acceso: un bloque lima con la esquina inferior derecha curva y,
 * por detrás, una franja lima clara que asoma a la derecha. Va como primer hijo del ScrollView.
 */
function AuthBackdropBase({ alto = 292 }: Props) {
  return (
    <>
      <View pointerEvents="none" style={[s.claro, { height: alto + 34 }]} />
      <View pointerEvents="none" style={[s.oscuro, { height: alto }]} />
    </>
  );
}

export const AuthBackdrop = memo(AuthBackdropBase);

const s = StyleSheet.create({
  claro: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Palette.lima300,
    borderBottomRightRadius: 120,
  },
  oscuro: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '91%',
    backgroundColor: Palette.lima,
    borderBottomRightRadius: 110,
  },
});
