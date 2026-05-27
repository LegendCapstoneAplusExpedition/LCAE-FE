import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { ds } from '../tokens';
import type { IconProps } from './types';

export function IconFilter({
  size = 16,
  color = ds.color.ink,
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...props}>
      <Path
        d="M2 4h14M5 9h8M7 14h4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
