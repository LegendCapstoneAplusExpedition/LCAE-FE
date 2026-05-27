import React from 'react';
import {Text, View} from 'react-native';

import {ds} from '../tokens';

type Props = {
  label?: '멘토' | '멘티';
  size?: number;
};

export function MentoLogo({label = '멘토', size = 48}: Props): React.JSX.Element {
  const bridgeWidth = size * 0.44;
  const dot = Math.max(4, size * 0.075);

  return (
    <View
      className="items-center justify-center bg-black"
      style={{width: size, height: size, borderRadius: size * 0.26}}>
      <Text
        className="font-black tracking-normal text-white"
        style={{fontSize: size * 0.26, lineHeight: size * 0.3}}>
        {label}
      </Text>
      <View className="mt-1 flex-row items-center">
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            borderWidth: 1.2,
            borderColor: ds.color.yellow,
          }}
        />
        <View
          style={{
            width: bridgeWidth,
            height: 1.2,
            backgroundColor: ds.color.yellow,
          }}
        />
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            borderWidth: 1.2,
            borderColor: ds.color.yellow,
          }}
        />
      </View>
    </View>
  );
}
