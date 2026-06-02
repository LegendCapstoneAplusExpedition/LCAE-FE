import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { LiveSession, MentorPost } from '../mocks';
import { Card, Tag } from '../../design-system/components/Primitives';
import { MentoLogo } from '../../design-system/components/MentoLogo';
import { IconChat, IconHeart } from '../../design-system/icons';
import { ds } from '../../design-system/tokens';

type LiveCardProps = {
  item: LiveSession;
  highlight?: boolean;
  onPress?: () => void;
};

export function LiveSessionCard({
  item,
  highlight = false,
  onPress,
}: LiveCardProps): React.JSX.Element {
  return (
    <Card highlight={highlight} onPress={onPress}>
      <View className="flex-row gap-3 p-[14px]">
        <View className="relative shrink-0">
          <MentoLogo size={64} />
          <View className="absolute bottom-[-5px] self-center rounded-full border-2 border-white bg-yellowDeep px-[7px] py-[2px]">
            <View className="flex-row items-center gap-[3px]">
              <View className="h-1 w-1 rounded-full bg-ink" />
              <Text className="text-[9px] font-black tracking-normal text-ink">
                LIVE
              </Text>
            </View>
          </View>
        </View>
        <View className="min-w-0 flex-1 gap-[5px]">
          <View className="flex-row flex-wrap gap-1">
            {item.tags.map((tag, index) => (
              <Tag key={tag} tone={index === 0 ? 'dark' : 'line'}>
                {tag}
              </Tag>
            ))}
          </View>
          <Text
            className="text-[14.5px] font-black leading-5 tracking-normal text-ink"
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text className="text-[12px] font-black tracking-normal text-yellowDeep">
            {item.free ? '무료' : '구독 전용'}
          </Text>
          <Text
            className="text-[11.5px] tracking-normal text-muted"
            numberOfLines={1}
          >
            {item.mentor}
          </Text>
          <View className="mt-[2px] flex-row items-center gap-1">
            <View className="h-[5px] w-[5px] rounded-full bg-yellowDeep" />
            <Text className="text-[11px] tracking-normal text-muted2">
              {item.viewers}명 청취 중
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

export function SubscribedMentorCard({
  name,
  title,
  viewers,
  compact = false,
}: {
  name: string;
  title: string;
  viewers: number;
  compact?: boolean;
}): React.JSX.Element {
  return (
    <View
      className={`${
        compact ? 'w-[138px]' : 'w-[150px]'
      } gap-[6px] rounded-[14px] border-[1.5px] border-yellow bg-card p-2.5`}
    >
      <View>
        <MentoLogo size={compact ? 40 : 46} />
        <View className="mt-[-8px] self-start rounded-full border-[1.5px] border-white bg-yellow px-[6px] py-[1px]">
          <Text className="text-[8px] font-black tracking-normal text-ink">
            LIVE
          </Text>
        </View>
      </View>
      <Text className="text-[12px] font-black tracking-normal text-ink">
        {name}
      </Text>
      <Text
        className="text-[10.5px] leading-[15px] tracking-normal text-muted"
        numberOfLines={2}
      >
        {title}
      </Text>
      <Text className="text-[10px] tracking-normal text-muted2">
        {viewers}명 청취 중
      </Text>
    </View>
  );
}

export function MentorRow({
  name,
  role,
  live,
  status,
  onPress,
}: {
  name: string;
  role: string;
  live?: boolean;
  status?: string;
  onPress?: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      className="flex-row items-center gap-2.5 rounded-[12px] border border-line bg-card p-2.5 active:bg-chip"
      onPress={onPress}
    >
      <View className="relative">
        <MentoLogo size={42} />
        {live ? (
          <View className="absolute right-[-2px] top-[-2px] h-3 w-3 rounded-full border-2 border-white bg-yellowDeep" />
        ) : null}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-[12.5px] font-black tracking-normal text-ink">
          {name}
        </Text>
        <Text className="mt-[2px] text-[10.5px] tracking-normal text-muted">
          {role}
        </Text>
      </View>
      <Text
        className={`rounded-[6px] px-2 py-1 text-[10.5px] font-extrabold tracking-normal ${
          live ? 'bg-yellowSoft text-yellowDeep' : 'bg-chip text-muted2'
        }`}
      >
        {status ?? (live ? '라이브 중' : '예정')}
      </Text>
    </Pressable>
  );
}

export function PostCard({
  actions,
  post,
  onPress,
}: {
  actions?: React.ReactNode;
  post: MentorPost;
  onPress?: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      className="gap-2.5 rounded-[18px] border border-line bg-card p-[14px] active:bg-chip"
      onPress={onPress}
    >
      <View className="flex-row items-center justify-between gap-2.5">
        <View className="flex-row gap-2">
          <MentoLogo size={34} />
          <View>
            <Text className="text-[12.5px] font-black tracking-normal text-ink">
              {post.mentor}
            </Text>
            <Text className="mt-[2px] text-[10.5px] tracking-normal text-muted2">
              {post.time}
            </Text>
          </View>
        </View>
        {actions}
      </View>
      <Text className="text-[13px] leading-[21px] tracking-normal text-ink2">
        {post.body}
      </Text>
      <View className="flex-row justify-end gap-4 border-t border-line2 pt-[9px]">
        <View className="flex-row items-center gap-[5px]">
          <IconHeart color={ds.color.muted} size={16} />
          <Text className="text-[11.5px] font-bold tracking-normal text-muted">
            {post.likes}
          </Text>
        </View>
        <View className="flex-row items-center gap-[5px]">
          <IconChat color={ds.color.muted} size={16} />
          <Text className="text-[11.5px] font-bold tracking-normal text-muted">
            {post.comments}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
