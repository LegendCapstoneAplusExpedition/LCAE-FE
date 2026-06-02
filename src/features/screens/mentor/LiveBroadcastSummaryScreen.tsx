import React from 'react';
import { Text, View } from 'react-native';

import { MentoLogo } from '../../../design-system/components/MentoLogo';
import {
  PrimaryButton,
  Screen,
} from '../../../design-system/components/Primitives';

export type LiveBroadcastSummary = {
  durationSeconds: number;
  title: string;
  viewersCount: number;
};

type Props = {
  onExit: () => void;
  summary?: LiveBroadcastSummary | null;
};

export function LiveBroadcastSummaryScreen({
  onExit,
  summary,
}: Props): React.JSX.Element {
  return (
    <Screen>
      <View className="flex-1 px-5 pb-6 pt-16">
        <View className="items-center">
          <MentoLogo size={76} />
          <Text className="mt-5 text-[20px] font-black tracking-normal text-ink">
            라이브가 종료되었습니다
          </Text>
          <Text className="mt-2 text-center text-[12px] leading-5 tracking-normal text-muted">
            {summary?.title ?? '라이브 멘토링'} 방송 결과입니다.
          </Text>
        </View>

        <View className="mt-10 flex-row gap-3">
          <View className="flex-1 rounded-[14px] border border-line bg-card p-4">
            <Text className="text-[11px] font-black tracking-normal text-muted">
              진행 시간
            </Text>
            <Text className="mt-2 text-[22px] font-black tracking-normal text-ink">
              {formatDuration(summary?.durationSeconds ?? 0)}
            </Text>
          </View>
          <View className="flex-1 rounded-[14px] border border-line bg-card p-4">
            <Text className="text-[11px] font-black tracking-normal text-muted">
              청취자
            </Text>
            <Text className="mt-2 text-[22px] font-black tracking-normal text-ink">
              {summary?.viewersCount ?? 0}명
            </Text>
          </View>
        </View>

        <View className="flex-1" />

        <PrimaryButton onPress={onExit}>나가기</PrimaryButton>
      </View>
    </Screen>
  );
}

function formatDuration(durationSeconds: number): string {
  const seconds = Math.max(0, Math.floor(durationSeconds));
  const totalMinutes = Math.floor(seconds / 60);

  if (totalMinutes <= 0) {
    return '1분 미만';
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `${totalMinutes}분`;
  }

  if (minutes <= 0) {
    return `${hours}시간`;
  }

  return `${hours}시간 ${minutes}분`;
}
