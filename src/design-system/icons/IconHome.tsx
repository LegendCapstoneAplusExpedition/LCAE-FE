import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { ds } from '../tokens';
import type { StatefulIconProps } from './types';

export function IconHome({
  size = 22,
  color = ds.color.muted2,
  active = false,
  ...props
}: StatefulIconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        d="M3 9l8-6 8 6v10a1 1 0 01-1 1h-4v-7H8v7H4a1 1 0 01-1-1V9z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        fill={active ? color : 'none'}
        fillOpacity={active ? 0.08 : 0}
      />
    </Svg>
  );
}
