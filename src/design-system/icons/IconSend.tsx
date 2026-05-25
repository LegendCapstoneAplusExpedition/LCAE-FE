import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { ds } from '../tokens';
import type { IconProps } from './types';

export function IconSend({
  size = 18,
  color = ds.color.white,
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M3 10l14-7-5 16-3-7-6-2z"
        fill={color}
        transform="translate(-1 0)"
      />
    </Svg>
  );
}
