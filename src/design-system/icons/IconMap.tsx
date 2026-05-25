import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { ds } from '../tokens';
import type { StatefulIconProps } from './types';

export function IconMap({
  size = 22,
  color = ds.color.muted2,
  active = false,
  ...props
}: StatefulIconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        d="M11 19s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z"
        stroke={color}
        strokeWidth={1.6}
        fill={active ? color : 'none'}
        fillOpacity={active ? 0.08 : 0}
      />
      <Circle
        cx={11}
        cy={8}
        r={2.5}
        stroke={color}
        strokeWidth={1.6}
        fill="none"
      />
    </Svg>
  );
}
