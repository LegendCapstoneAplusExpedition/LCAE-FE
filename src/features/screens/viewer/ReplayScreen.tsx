import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { MentoLogo } from '../../../design-system/components/MentoLogo';
import {
  BackButton,
  PrimaryButton,
  Screen,
} from '../../../design-system/components/Primitives';
import { Waveform } from '../../../design-system/components/Waveform';
import { HighlightRow } from '../../components/Cards';
import {
  replayDetail,
  replayHighlights,
  replayRecap,
  replayRecapStats,
} from '../../mocks';

type Props = {
  recap?: boolean;
  onBack: () => void;
};

export function ReplayScreen({
  recap = false,
  onBack,
}: Props): React.JSX.Element {
  return (
    <Screen>
      <View className="h-12 justify-center px-4">
        <BackButton onPress={onBack} />
      </View>

      <ScrollView contentContainerClassName="px-5 pb-[18px]">
        {recap ? (
          <>
            <View className="mb-3 flex-row items-center gap-3 rounded-[18px] bg-ink p-[18px]">
              <View className="h-11 w-11 items-center justify-center rounded-[12px] bg-yellow">
                <Text className="text-[20px] font-black text-ink">✓</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-black tracking-normal text-white">
                  {replayRecap.title}
                </Text>
                <Text className="mt-[2px] text-[11px] tracking-normal text-white/65">
                  {replayRecap.meta}
                </Text>
              </View>
            </View>
            <View className="mb-[14px] flex-row gap-2">
              {replayRecapStats.map(stat => (
                <View
                  key={stat.label}
                  className="flex-1 rounded-[12px] border border-line bg-card p-3"
                >
                  <Text className="text-[10.5px] font-semibold tracking-normal text-muted">
                    {stat.label}
                  </Text>
                  <Text className="mt-[2px] text-[18px] font-black tracking-normal text-ink">
                    {stat.value}
                  </Text>
                  {stat.sub ? (
                    <Text className="text-[10px] font-bold tracking-normal text-yellowDeep">
                      {stat.sub}
                    </Text>
                  ) : null}
                </View>
              ))}
            </View>
          </>
        ) : null}

        <View className="flex-row items-center gap-3 rounded-[18px] border border-line bg-card p-[14px]">
          <MentoLogo size={58} />
          <View className="flex-1">
            <Text className="text-[16px] font-black tracking-normal text-ink">
              {replayDetail.title}
            </Text>
            <Text className="mt-1 text-[11.5px] tracking-normal text-muted">
              {replayDetail.meta}
            </Text>
          </View>
        </View>

        <View className="my-[14px]">
          <Waveform compact />
          <View className="flex-row justify-between">
            <Text className="text-[11px] tracking-normal text-muted2">
              {replayDetail.currentTime}
            </Text>
            <Text className="text-[11px] tracking-normal text-muted2">
              {replayDetail.totalTime}
            </Text>
          </View>
        </View>

        <Text className="mb-2 text-[13px] font-black tracking-normal text-ink">
          오늘의 하이라이트
        </Text>
        {replayHighlights.map(highlight => (
          <HighlightRow
            key={highlight.time}
            sub={highlight.sub}
            time={highlight.time}
            title={highlight.title}
          />
        ))}
      </ScrollView>

      <View className="gap-2 px-5 pb-6 pt-3">
        <PrimaryButton>다시듣기로 들어보기</PrimaryButton>
        <PrimaryButton tone="light" onPress={onBack}>
          홈으로 돌아가기
        </PrimaryButton>
      </View>
    </Screen>
  );
}
