import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { ds } from '../tokens';
import type { IconProps } from './types';

type Props = IconProps & {
  filled?: boolean;
};

export function IconHeart({
  size = 18,
  color = ds.color.muted,
  filled = false,
  ...props
}: Props): React.JSX.Element {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={filled ? color : 'none'}
      {...props}
    >
      <Path
        d="M10 17s-6-4-6-9a3.5 3.5 0 016-2.5A3.5 3.5 0 0116 8c0 5-6 9-6 9z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
