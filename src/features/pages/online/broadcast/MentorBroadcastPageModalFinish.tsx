import React from 'react';
import { Text, View } from 'react-native';

import { PrimaryButton } from '../../../../design-system/components/Primitives';

type Props = {
  onCancel?: () => void;
  onConfirm?: () => void;
};

const noop = () => undefined;

export function MentorBroadcastPageModalFinish({
  onCancel = noop,
  onConfirm = noop,
}: Props): React.JSX.Element {
  return (
    <View className="absolute inset-0 justify-end bg-black/45 px-5 pb-8">
      <View className="rounded-[18px] bg-white p-5">
        <Text className="text-[16px] font-black tracking-normal text-ink">
          라이브 멘토링을 종료하시겠습니까?
        </Text>
        <Text className="mt-2 text-[12px] leading-5 tracking-normal text-muted">
          현재 24명이 청취 중입니다.
        </Text>
        <View className="mt-5 flex-row gap-2.5">
          <View className="flex-1">
            <PrimaryButton tone="light" onPress={onCancel}>
              취소
            </PrimaryButton>
          </View>
          <View className="flex-1">
            <PrimaryButton tone="yellow" onPress={onConfirm}>
              종료
            </PrimaryButton>
          </View>
        </View>
      </View>
    </View>
  );
}

export default MentorBroadcastPageModalFinish;
