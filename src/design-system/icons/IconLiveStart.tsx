import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import type { IconProps } from './types';

export function IconLiveStart({
  size = 22,
  color = '#0A0A0A',
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...props}>
      <Circle cx={11} cy={11} r={9} stroke={color} strokeWidth={1.6} />
      <Path d="M9 7l6 4-6 4V7z" fill={color} />
    </Svg>
  );
}
