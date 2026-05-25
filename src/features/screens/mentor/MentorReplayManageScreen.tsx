import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { mentorReplayFilters, replayItems } from '../../mocks';
import {
  BackButton,
  Chip,
  Screen,
} from '../../../design-system/components/Primitives';
import { IconPlay } from '../../../design-system/icons';
import { ds } from '../../../design-system/tokens';
import {
  MentorConsoleNavigation,
  MentorConsoleTab,
} from '../../components/MentorConsoleNavigation';

type Props = {
  onBack: () => void;
  onOpenBoard?: () => void;
  onOpenLive?: () => void;
};

const statusTone = (status: string) => {
  if (status === '공개') {
    return { backgroundColor: ds.color.yellowSoft, color: '#7A5B00' };
  }

  if (status === '구독자 전용') {
    return { backgroundColor: '#EBF1FF', color: '#2A5BC9' };
  }

  return { backgroundColor: ds.color.chip, color: ds.color.muted };
};

export function MentorReplayManageScreen({
  onBack,
  onOpenBoard,
  onOpenLive,
}: Props): React.JSX.Element {
  const handleTabChange = (tab: MentorConsoleTab) => {
    if (tab === 'board') {
      onOpenBoard?.();
      return;
    }

    if (tab === 'live') {
      onOpenLive?.();
    }
  };

  return (
    <Screen>
      <View className="h-12 justify-center px-4">
        <BackButton onPress={onBack} />
      </View>

      <ScrollView
        contentContainerClassName="px-5 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-[18px] font-black tracking-normal text-ink">
          다시듣기 관리
        </Text>
        <Text className="mt-1 text-[11.5px] leading-4 tracking-normal text-muted">
          공개 범위와 제목을 수정하거나 삭제할 수 있어요.
        </Text>

        <ScrollView
          horizontal
          contentContainerClassName="gap-[6px] py-3"
          showsHorizontalScrollIndicator={false}
        >
          {mentorReplayFilters.map((filter, index) => (
            <Chip key={filter} active={index === 0} small>
              {filter}
            </Chip>
          ))}
        </ScrollView>

        <View className="gap-2">
          {replayItems.map(item => {
            const tone = statusTone(item.status);

            return (
              <View
                key={item.title}
                className="flex-row items-center gap-2.5 rounded-[12px] border border-line bg-card p-3"
              >
                <View className="h-12 w-12 items-center justify-center rounded-[10px] bg-ink">
                  <IconPlay color={ds.color.yellow} size={18} />
                </View>
                <View className="min-w-0 flex-1">
                  <Text
                    className="text-[12.5px] font-black tracking-normal text-ink"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text className="mt-[2px] text-[10.5px] tracking-normal text-muted">
                    {item.date} · {item.duration}
                    {item.listeners > 0 ? ` · ${item.listeners}명 청취` : ''}
                  </Text>
                  <Text
                    className="mt-[6px] self-start rounded-[5px] px-2 py-[3px] text-[10px] font-extrabold tracking-normal"
                    style={tone}
                  >
                    {item.status}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  className="h-8 w-8 items-center justify-center rounded-lg active:bg-chip"
                >
                  <Text className="text-[18px] font-black leading-5 tracking-normal text-muted">
                    ...
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <MentorConsoleNavigation active="replay" onChange={handleTabChange} />
    </Screen>
  );
}
