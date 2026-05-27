import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  liveCategoryFilters,
  subscribedMentors,
  type LiveSession,
} from '../../mocks';
import { BottomNavigation } from '../../components/BottomNavigation';
import { useLiveBroadcasts } from '../../hooks/useLiveBroadcasts';
import {
  ChipRow,
  LiveDot,
  Screen,
  SearchPill,
} from '../../../design-system/components/Primitives';
import {
  LiveSessionCard,
  MentorRow,
  SubscribedMentorCard,
} from '../../components/Cards';

type Props = {
  initialTab?: 'all' | 'sub';
  onOpenLive: (session?: LiveSession) => void;
  onOpenMentor: () => void;
  onOpenMy: () => void;
};

export function LiveListScreen({
  initialTab = 'all',
  onOpenLive,
  onOpenMentor,
  onOpenMy,
}: Props): React.JSX.Element {
  const [tab, setTab] = useState<'all' | 'sub'>(initialTab);
  const {
    data: liveSessions,
    error: liveError,
    loading: liveLoading,
  } = useLiveBroadcasts();

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-[18px] pt-[6px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="pb-[14px] pt-[6px]">
          <Text className="text-[22px] font-black leading-7 tracking-normal text-ink">
            지금 <Text className="text-yellowDeep">라이브 중인</Text> 멘토
          </Text>
        </View>

        <SearchPill placeholder="멘토 이름 또는 주제 검색" />

        <View className="mt-[14px] flex-row gap-[18px] border-b border-line2">
          <Text
            className={`py-2.5 text-[13px] font-extrabold tracking-normal ${
              tab === 'all' ? 'border-b-2 border-ink text-ink' : 'text-muted2'
            }`}
            onPress={() => setTab('all')}
          >
            전체 라이브
          </Text>
          <Text
            className={`py-2.5 text-[13px] font-extrabold tracking-normal ${
              tab === 'sub' ? 'border-b-2 border-ink text-ink' : 'text-muted2'
            }`}
            onPress={() => setTab('sub')}
          >
            구독 중 · 12
          </Text>
        </View>

        {tab === 'all' ? (
          <>
            <View className="py-2.5">
              <ChipRow items={liveCategoryFilters} />
            </View>

            <View className="flex-row items-center justify-between pb-[6px] pt-1">
              <Text className="text-[12px] font-extrabold tracking-normal text-muted">
                최신순⌄
              </Text>
              <Text className="text-[11px] tracking-normal text-muted2">
                총 {liveSessions.length}개
              </Text>
            </View>

            {liveLoading ? (
              <Text className="py-8 text-center text-[12px] tracking-normal text-muted">
                라이브 목록을 불러오는 중입니다.
              </Text>
            ) : liveError ? (
              <Text className="py-8 text-center text-[12px] tracking-normal text-muted">
                라이브 목록을 불러오지 못했습니다.
              </Text>
            ) : liveSessions.length === 0 ? (
              <Text className="py-8 text-center text-[12px] tracking-normal text-muted">
                진행 중인 라이브가 없습니다.
              </Text>
            ) : (
              <View className="gap-2.5">
                {liveSessions.map((item, index) => (
                  <LiveSessionCard
                    key={item.id}
                    highlight={index === 0}
                    item={item}
                    onPress={() => onOpenLive(item)}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <View className="flex-row items-center pb-2.5 pt-[14px]">
              <LiveDot />
              <Text className="text-[12px] font-black tracking-normal text-ink">
                방금 시작한 라이브 · 3
              </Text>
            </View>
            <ScrollView
              horizontal
              contentContainerClassName="gap-2.5 pb-4"
              showsHorizontalScrollIndicator={false}
            >
              {subscribedMentors.slice(0, 3).map(mentor => (
                <SubscribedMentorCard
                  key={mentor.name}
                  compact
                  name={mentor.name}
                  title={mentor.title}
                  viewers={mentor.viewers}
                />
              ))}
            </ScrollView>

            <Text className="mb-2 text-[12px] font-black tracking-normal text-ink">
              구독 멘토
            </Text>
            <View className="gap-2.5">
              {subscribedMentors.map(mentor => (
                <MentorRow
                  key={mentor.name}
                  live={mentor.live}
                  name={mentor.name}
                  role={mentor.role}
                  status={mentor.live ? '라이브 중' : '최근 라이브'}
                  onPress={mentor.live ? () => onOpenLive() : onOpenMentor}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <BottomNavigation
        active="live"
        onChange={next => {
          if (next === 'my') {
            onOpenMy();
          }
        }}
      />
    </Screen>
  );
}
