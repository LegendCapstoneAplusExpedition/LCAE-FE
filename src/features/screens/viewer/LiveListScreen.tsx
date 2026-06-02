import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { liveCategoryFilters, type LiveSession } from '../../mocks';
import { BottomNavigation } from '../../components/BottomNavigation';
import { useLiveBroadcasts } from '../../hooks/useLiveBroadcasts';
import { useSubscriptions } from '../../hooks/useSubscriptions';
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
  authToken?: string | null;
  initialTab?: 'all' | 'sub';
  onOpenLive: (session?: LiveSession) => void;
  onOpenLogin: () => void;
  onOpenMentor: () => void;
  onOpenMy: () => void;
};

export function LiveListScreen({
  authToken,
  initialTab = 'all',
  onOpenLive,
  onOpenLogin,
  onOpenMentor,
  onOpenMy,
}: Props): React.JSX.Element {
  const [tab, setTab] = useState<'all' | 'sub'>(initialTab);
  const {
    data: liveSessions,
    error: liveError,
    loading: liveLoading,
  } = useLiveBroadcasts();
  const {
    error: subError,
    loading: subLoading,
    mentors: subscribedMentors,
  } = useSubscriptions(authToken ?? null);

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
            구독 중 · {subscribedMentors.length}
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
            {subLoading ? (
              <Text className="py-8 text-center text-[12px] tracking-normal text-muted">
                구독 정보를 불러오는 중입니다.
              </Text>
            ) : subError ? (
              <Text className="py-8 text-center text-[12px] tracking-normal text-muted">
                {subError}
              </Text>
            ) : !authToken ? (
              <Text className="py-8 text-center text-[12px] tracking-normal text-muted">
                로그인 후 구독한 멘토를 볼 수 있어요.
              </Text>
            ) : subscribedMentors.length === 0 ? (
              <Text className="py-8 text-center text-[12px] tracking-normal text-muted">
                구독한 멘토가 없습니다.
              </Text>
            ) : (
              <>
                {subscribedMentors.some(m => m.live) ? (
                  <>
                    <View className="flex-row items-center pb-2.5 pt-[14px]">
                      <LiveDot />
                      <Text className="text-[12px] font-black tracking-normal text-ink">
                        지금 라이브 중 · {subscribedMentors.filter(m => m.live).length}
                      </Text>
                    </View>
                    <ScrollView
                      horizontal
                      contentContainerClassName="gap-2.5 pb-4"
                      showsHorizontalScrollIndicator={false}
                    >
                      {subscribedMentors
                        .filter(m => m.live)
                        .map(mentor => (
                          <SubscribedMentorCard
                            key={mentor.id}
                            compact
                            name={mentor.username}
                            title={mentor.broadcastTitle ?? ''}
                            viewers={mentor.viewers}
                          />
                        ))}
                    </ScrollView>
                  </>
                ) : null}

                <Text className="mb-2 text-[12px] font-black tracking-normal text-ink">
                  구독 멘토
                </Text>
                <View className="gap-2.5">
                  {subscribedMentors.map(mentor => (
                    <MentorRow
                      key={mentor.id}
                      live={mentor.live}
                      name={mentor.username}
                      role=""
                      status={mentor.live ? '라이브 중' : '구독 중'}
                      onPress={
                        mentor.live ? () => onOpenLive() : onOpenMentor
                      }
                    />
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      <BottomNavigation
        active="live"
        onChange={next => {
          if (next === 'home') {
            onOpenLogin();
          } else if (next === 'my') {
            onOpenMy();
          }
        }}
      />
    </Screen>
  );
}
