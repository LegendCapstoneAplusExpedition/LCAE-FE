import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import { ds } from '../tokens';
import type { IconProps } from './types';

export function IconMic({
  size = 22,
  color = ds.color.white,
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <Rect x={9} y={3} width={6} height={11} rx={3} fill={color} />
      <Path
        d="M5 11a7 7 0 0014 0M12 18v3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
