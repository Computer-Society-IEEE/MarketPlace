import Svg, { Path } from 'react-native-svg';
import type { StyleProp, ViewStyle } from 'react-native';
import { Palette } from '@/constants/theme';

type Props = {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function Star4({ size = 40, color = Palette.gold, style }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <Path
        d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0 Z"
        fill={color}
      />
    </Svg>
  );
}