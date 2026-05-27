import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { ds } from '../tokens';

type Props = {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
};

const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 24;
const THUMB_SIZE = 20;
const TRACK_PADDING = 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING * 2;

export function ToggleSwitch({
  value,
  onValueChange,
  disabled = false,
}: Props): React.JSX.Element {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      duration: 180,
      toValue: value ? 1 : 0,
      useNativeDriver: false,
    }).start();
  }, [progress, value]);

  const trackAnimatedStyle = {
    backgroundColor: progress.interpolate({
      inputRange: [0, 1],
      outputRange: [ds.color.chip, ds.color.yellow],
    }),
  };
  const thumbAnimatedStyle = {
    transform: [
      {
        translateX: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, THUMB_TRAVEL],
        }),
      },
    ],
  };

  const track = (
    <Animated.View style={[styles.track, trackAnimatedStyle]}>
      <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />
    </Animated.View>
  );

  if (!onValueChange) {
    return <View style={styles.container}>{track}</View>;
  }

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      className="active:opacity-80"
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={styles.container}
    >
      {track}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: TRACK_HEIGHT,
    width: TRACK_WIDTH,
  } satisfies ViewStyle,
  thumb: {
    backgroundColor: ds.color.white,
    borderRadius: THUMB_SIZE / 2,
    height: THUMB_SIZE,
    width: THUMB_SIZE,
  },
  track: {
    borderRadius: TRACK_HEIGHT / 2,
    height: TRACK_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: TRACK_PADDING,
    width: TRACK_WIDTH,
  },
});
