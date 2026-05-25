import React from 'react';
import Svg, { Rect } from 'react-native-svg';

import { ds } from '../tokens';
import type { IconProps } from './types';

export function IconStop({
  size = 18,
  color = ds.color.white,
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" {...props}>
      <Rect x={3} y={3} width={12} height={12} rx={2} fill={color} />
    </Svg>
  );
}
