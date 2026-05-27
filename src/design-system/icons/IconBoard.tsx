import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

export function IconBoard({
  size = 20,
  color = '#0A0A0A',
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <Rect
        x={3}
        y={3.5}
        width={14}
        height={13}
        rx={2.5}
        stroke={color}
        strokeWidth={1.6}
      />
      <Path
        d="M6 7h8M6 10h8M6 13h5"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.6}
      />
    </Svg>
  );
}
