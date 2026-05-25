import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { ds } from '../tokens';
import type { StatefulIconProps } from './types';

export function IconMy({
  size = 22,
  color = ds.color.muted2,
  active = false,
  ...props
}: StatefulIconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...props}>
      <Circle
        cx={11}
        cy={8}
        r={3.5}
        stroke={color}
        strokeWidth={1.6}
        fill={active ? color : 'none'}
        fillOpacity={active ? 0.08 : 0}
      />
      <Path
        d="M4 19c0-3.5 3-6 7-6s7 2.5 7 6"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
