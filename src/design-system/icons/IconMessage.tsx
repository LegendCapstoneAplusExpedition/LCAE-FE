import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { ds } from '../tokens';
import type { StatefulIconProps } from './types';

export function IconMessage({
  size = 22,
  color = ds.color.muted2,
  active = false,
  ...props
}: StatefulIconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none" {...props}>
      <Path
        d="M3 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 3v-3H5a2 2 0 01-2-2V6z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        fill={active ? color : 'none'}
        fillOpacity={active ? 0.08 : 0}
      />
    </Svg>
  );
}
