import type { SvgProps } from 'react-native-svg';

export type IconProps = SvgProps & {
  size?: number;
  color?: string;
};

export type StatefulIconProps = IconProps & {
  active?: boolean;
};
