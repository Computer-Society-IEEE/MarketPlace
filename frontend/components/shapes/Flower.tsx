import { useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';
import type { StyleProp, ViewStyle } from 'react-native';
import { Palette } from '@/constants/theme';

type Props = {
  size?: number;
  petals?: number;
  color?: string;
  depth?: number; // 0 = círculo, 1 = pétalos muy marcados
  style?: StyleProp<ViewStyle>;
};

export function Flower({
  size = 120,
  petals = 8,
  color = Palette.lima,
  depth = 0.4,
  style,
}: Props) {
  const d = useMemo(() => {
    const outer = 48;
    const inner = outer * (1 - depth);
    const steps = 360;
    let path = '';

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * Math.PI * 2;
      // |cos| da puntas redondeadas y valles entre pétalos
      const r = inner + (outer - inner) * Math.abs(Math.cos((petals * theta) / 2));
      const a = theta - Math.PI / 2; // un pétalo apunta hacia arriba
      const x = 50 + r * Math.cos(a);
      const y = 50 + r * Math.sin(a);
      path += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return path + 'Z';
  }, [petals, depth]);

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <Path d={d} fill={color} />
    </Svg>
  );
}