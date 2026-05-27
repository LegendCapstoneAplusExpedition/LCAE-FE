import React from 'react';
import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

export function IconPlay({
  size = 28,
  color = '#0A0A0A',
  ...props
}: IconProps): React.JSX.Element {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28" {...props}>
      <Path d="M9 6l14 8-14 8V6z" fill={color} />
    </Svg>
  );
}
