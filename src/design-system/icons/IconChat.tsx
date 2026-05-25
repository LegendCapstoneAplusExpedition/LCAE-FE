import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { ds } from '../tokens';
import type { IconProps } from './types';

export function IconChat({
  size = 18,
  color = ds.color.ink,
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M3 5a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H8l-4 3v-3a2 2 0 01-1-2V5z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
