import React from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';

import { ds } from '../tokens';
import type { StatefulIconProps } from './types';

export function IconLive({
  size = 22,
  color = ds.color.muted2,
  active = false,
  ...props
}: StatefulIconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...props}>
      <Rect
        x={3}
        y={5}
        width={16}
        height={12}
        rx={2.5}
        stroke={color}
        strokeWidth={1.6}
        fill={active ? color : 'none'}
        fillOpacity={active ? 0.08 : 0}
      />
      <Circle
        cx={11}
        cy={11}
        r={2.2}
        fill={active ? ds.color.yellowDeep : color}
      />
    </Svg>
  );
}
