import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { mentorBoardSummary, mentorPosts, mentorProfile } from '../../mocks';
import {
  BackButton,
  Screen,
  Tag,
} from '../../../design-system/components/Primitives';
import { MentoLogo } from '../../../design-system/components/MentoLogo';
import { PostCard } from '../../components/Cards';
import {
  MentorConsoleNavigation,
  MentorConsoleTab,
} from '../../components/MentorConsoleNavigation';

type Props = {
  onBack: () => void;
  onCompose?: () => void;
  onOpenPost?: () => void;
  onOpenPrepare?: () => void;
  onOpenReplay: () => void;
};

export function MentorBoardScreen({
  onBack,
  onCompose,
  onOpenPost,
  onOpenPrepare,
  onOpenReplay,
}: Props): React.JSX.Element {
  const handleTabChange = (tab: MentorConsoleTab) => {
    if (tab === 'live') {
      onOpenPrepare?.();
      return;
    }

    if (tab === 'replay') {
      onOpenReplay();
    }
  };

  return (
    <Screen>
      <View className="h-12 justify-center px-4">
        <BackButton onPress={onBack} />
      </View>

      <ScrollView
        contentContainerClassName="px-5 pb-[18px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 pb-[14px] pt-1">
          <MentoLogo size={56} />
          <View className="flex-1">
            <View className="flex-row items-center gap-[6px]">
              <Text className="text-[18px] font-black tracking-normal text-ink">
                {mentorProfile.name}
              </Text>
              <Tag tone="yellow">내 채널</Tag>
            </View>
            <Text className="mt-[2px] text-[11.5px] leading-4 tracking-normal text-muted">
              {mentorProfile.subtitle}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between pb-2">
          <Text className="text-[13px] font-black tracking-normal text-ink">
            내 게시글 {mentorBoardSummary.postCount}
          </Text>
          <Text className="text-[11px] tracking-normal text-muted2">
            {mentorBoardSummary.sortLabel}
          </Text>
        </View>

        <View className="gap-2">
          {mentorPosts.map(post => (
            <PostCard key={post.id} post={post} onPress={onOpenPost} />
          ))}
          <Pressable
            accessibilityRole="button"
            className="h-11 flex-row items-center justify-center gap-[6px] rounded-[12px] border-[1.5px] border-dashed border-line bg-white active:bg-chip"
            onPress={onCompose}
          >
            <Text className="text-[16px] font-black text-yellowDeep">+</Text>
            <Text className="text-[13px] font-extrabold tracking-normal text-muted">
              새 게시글 작성
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <MentorConsoleNavigation active="board" onChange={handleTabChange} />
    </Screen>
  );
}
