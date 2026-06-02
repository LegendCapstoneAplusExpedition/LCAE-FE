import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { ds } from '../tokens';
import type { IconProps } from './types';

export function IconUser({
  size = 20,
  color = ds.color.ink,
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <Circle cx={10} cy={7} r={3.2} stroke={color} strokeWidth={1.6} />
      <Path
        d="M4 17c.4-3.2 2.9-5.2 6-5.2s5.6 2 6 5.2"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}
