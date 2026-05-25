import React from 'react';
import { Text, View } from 'react-native';

import { LiveBroadcastScreen } from '../../../screens/mentor/LiveBroadcastScreen';
import { PrimaryButton } from '../../../../design-system/components/Primitives';

type Props = {
  onBack?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
};

const noop = () => undefined;

export function MentorBroadcastPageModalReplay({
  onBack = noop,
  onCancel = noop,
  onConfirm = noop,
}: Props): React.JSX.Element {
  return (
    <View className="flex-1">
      <LiveBroadcastScreen onBack={onBack} onEnd={onConfirm} />
      <View className="absolute inset-0 justify-end bg-black/45 px-5 pb-8">
        <View className="rounded-[18px] bg-white p-5">
          <Text className="text-[16px] font-black tracking-normal text-ink">
            다시 듣기에 등록할까요?
          </Text>
          <Text className="mt-2 text-[12px] leading-5 tracking-normal text-muted">
            구독자에게 라이브 종료 후 다시듣기로 제공됩니다.
          </Text>
          <View className="mt-5 flex-row gap-2.5">
            <View className="flex-1">
              <PrimaryButton tone="light" onPress={onCancel}>
                나중에
              </PrimaryButton>
            </View>
            <View className="flex-1">
              <PrimaryButton tone="yellow" onPress={onConfirm}>
                등록
              </PrimaryButton>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default MentorBroadcastPageModalReplay;
