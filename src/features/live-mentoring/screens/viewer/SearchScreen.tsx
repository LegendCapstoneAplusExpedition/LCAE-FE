import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { liveSessions, subscribedMentors } from '../../mocks';
import { BottomNavigation } from '../../../components/BottomNavigation';
import {
  BackButton,
  Chip,
  LiveDot,
  PrimaryButton,
  Screen,
  SearchPill,
} from '../../../../design-system/components/Primitives';
import { MentoLogo } from '../../../../design-system/components/MentoLogo';
import { LiveSessionCard } from '../../components/Cards';

type Props = {
  onBack: () => void;
  onOpenLive: () => void;
  onOpenMentor: () => void;
};

export function SearchScreen({
  onBack,
  onOpenLive,
  onOpenMentor,
}: Props): React.JSX.Element {
  return (
    <Screen>
      <View className="flex-row items-center gap-2 px-4 pb-2 pt-1">
        <BackButton onPress={onBack} />
        <View className="flex-1">
          <SearchPill defaultValue="커리어 전환" />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-5"
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          contentContainerClassName="gap-[6px] pb-3"
          showsHorizontalScrollIndicator={false}
        >
          <Chip active small>
            전체 · 18
          </Chip>
          <Chip small>라이브 · 3</Chip>
          <Chip small>멘토 · 7</Chip>
          <Chip small>다시듣기 · 8</Chip>
        </ScrollView>

        <View className="mb-2 flex-row items-center">
          <LiveDot />
          <Text className="text-[12px] font-black tracking-normal text-ink">
            지금 라이브 중
          </Text>
        </View>
        <LiveSessionCard item={liveSessions[0]} onPress={onOpenLive} />

        <Text className="mb-2 mt-4 text-[12px] font-black tracking-normal text-ink">
          관련 멘토
        </Text>
        <View className="gap-2">
          {subscribedMentors.slice(0, 3).map(mentor => (
            <View
              key={mentor.name}
              className="flex-row items-center gap-2.5 rounded-[12px] border border-line bg-card p-3"
            >
              <MentoLogo size={40} />
              <View className="min-w-0 flex-1">
                <Text className="text-[12.5px] font-black tracking-normal text-ink">
                  {mentor.name}
                </Text>
                <Text className="mt-[2px] text-[10.5px] tracking-normal text-muted">
                  {mentor.role}
                </Text>
                <Text className="mt-[2px] text-[10px] tracking-normal text-muted2">
                  구독 {mentor.viewers * 53 + 12}
                </Text>
              </View>
              <View className="w-[62px]">
                <PrimaryButton
                  size="small"
                  tone="yellow"
                  onPress={onOpenMentor}
                >
                  구독
                </PrimaryButton>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNavigation active="live" />
    </Screen>
  );
}
