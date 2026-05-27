import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../../../design-system/components/Primitives';

type Props = {
  cancelLabel?: string;
  confirmLabel?: string;
  description?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  showCancel?: boolean;
  title?: string;
};

const noop = () => undefined;

export function MentorBroadcastPageModalFinish({
  cancelLabel = '취소',
  confirmLabel = '종료',
  description = '현재 24명이 청취 중입니다.',
  onCancel = noop,
  onConfirm = noop,
  showCancel = true,
  title = '라이브 멘토링을 종료하시겠습니까?',
}: Props): React.JSX.Element {
  return (
    <View className="bg-black/45" style={StyleSheet.absoluteFill}>
      <SafeAreaView className="flex-1 justify-end bg-black/45 px-5 pb-8">
        <View className="rounded-[18px] bg-white p-5">
          <Text className="text-[16px] font-black tracking-normal text-ink">
            {title}
          </Text>
          <Text className="mt-2 text-[12px] leading-5 tracking-normal text-muted">
            {description}
          </Text>
          <View className="mt-5 flex-row gap-2.5">
            {showCancel ? (
              <View className="flex-1">
                <PrimaryButton tone="light" onPress={onCancel}>
                  {cancelLabel}
                </PrimaryButton>
              </View>
            ) : null}
            <View className="flex-1">
              <PrimaryButton tone="yellow" onPress={onConfirm}>
                {confirmLabel}
              </PrimaryButton>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default MentorBroadcastPageModalFinish;
