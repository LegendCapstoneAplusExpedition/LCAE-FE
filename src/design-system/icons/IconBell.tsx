import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { ds } from '../tokens';
import type { IconProps } from './types';

export function IconBell({
  size = 18,
  color = ds.color.ink,
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M10 3a5 5 0 015 5v3l1.5 3H3.5L5 11V8a5 5 0 015-5z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M8 16a2 2 0 004 0"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}
