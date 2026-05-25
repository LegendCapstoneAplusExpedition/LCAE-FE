import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { myLiveTabs, subscribedMentors } from '../../mocks';
import { BottomNavigation } from '../../components/BottomNavigation';
import { LiveDot, Screen } from '../../../design-system/components/Primitives';
import { MentorRow, SubscribedMentorCard } from '../../components/Cards';

type Props = {
  onOpenLive: () => void;
};

export function MyLiveScreen({ onOpenLive }: Props): React.JSX.Element {
  return (
    <Screen>
      <ScrollView contentContainerClassName="px-5 pb-[18px] pt-2.5">
        <Text className="mb-2.5 text-[22px] font-black tracking-normal text-ink">
          내 라이브
        </Text>

        <View className="flex-row gap-4 border-b border-line2">
          {myLiveTabs.map((tab, index) => (
            <Text
              key={tab}
              className={`py-2.5 text-[13px] font-extrabold tracking-normal ${
                index === 0 ? 'border-b-2 border-ink text-ink' : 'text-muted2'
              }`}
            >
              {tab}
            </Text>
          ))}
        </View>

        <View className="mt-[14px] flex-row items-center">
          <LiveDot />
          <Text className="text-[11.5px] font-black tracking-normal text-ink">
            방금 시작한 라이브 · 3
          </Text>
        </View>

        <ScrollView
          horizontal
          contentContainerClassName="gap-2.5 py-2.5"
          showsHorizontalScrollIndicator={false}
        >
          {subscribedMentors.slice(0, 3).map(mentor => (
            <SubscribedMentorCard
              key={mentor.name}
              name={mentor.name}
              title={mentor.title}
              viewers={mentor.viewers}
            />
          ))}
        </ScrollView>

        <Text className="mb-2 mt-[6px] text-[12px] font-black tracking-normal text-ink">
          구독 중 (12)
        </Text>
        <View className="gap-2">
          {subscribedMentors.map(mentor => (
            <MentorRow
              key={mentor.name}
              live={mentor.live}
              name={mentor.name}
              role={mentor.role}
              status={mentor.live ? '라이브 중' : '최근 라이브'}
            />
          ))}
        </View>
      </ScrollView>

      <BottomNavigation
        active="my"
        onChange={tab => {
          if (tab === 'live') {
            onOpenLive();
          }
        }}
      />
    </Screen>
  );
}
