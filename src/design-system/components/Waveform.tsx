import React from 'react';
import { View } from 'react-native';

type Props = {
  compact?: boolean;
  values?: number[];
};

const defaultValues = [
  0.18, 0.34, 0.26, 0.5, 0.38, 0.68, 0.46, 0.82, 0.58, 0.74, 0.42, 0.62,
  0.32, 0.54, 0.28, 0.4, 0.7, 0.45, 0.24, 0.6,
];

export function Waveform({
  compact = false,
  values = defaultValues,
}: Props): React.JSX.Element {
  const maxHeight = compact ? 56 : 78;
  const minHeight = 6;

  return (
    <View
      className="flex-row items-center justify-center gap-[5px] overflow-hidden"
      style={{ height: maxHeight }}
    >
      {values.map((value, index) => (
        <View
          key={index}
          className="w-[5px] rounded-full bg-ink"
          style={{
            height:
              minHeight +
              Math.max(0, Math.min(1, value)) * (maxHeight - minHeight),
          }}
        />
      ))}
    </View>
  );
}
