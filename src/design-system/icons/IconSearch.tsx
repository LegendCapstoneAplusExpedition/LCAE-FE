import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { ds } from '../tokens';
import type { IconProps } from './types';

export function IconSearch({
  size = 18,
  color = ds.color.ink,
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <Circle cx={9} cy={9} r={6} stroke={color} strokeWidth={1.8} />
      <Path
        d="M14 14l4 4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
