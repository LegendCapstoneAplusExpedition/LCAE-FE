import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

export function IconReplay({
  size = 20,
  color = '#0A0A0A',
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M4 10a6 6 0 1 1 1.8 4.2"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.6}
      />
      <Path
        d="M3 5v4h4"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.6}
      />
      <Path
        d="M10 7v4l3 1.5"
        stroke={color}
        strokeLinecap="round"
        strokeWidth={1.6}
      />
    </Svg>
  );
}
