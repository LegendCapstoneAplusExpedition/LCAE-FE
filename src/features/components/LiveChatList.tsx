import React from 'react';
import { Text, View } from 'react-native';

import type { BroadcastChatMessage } from '../hooks/useBroadcastChat';

type Props = {
  emptyText?: string;
  error?: string | null;
  messages: BroadcastChatMessage[];
  title?: string;
};

export function LiveChatList({
  emptyText = '아직 채팅이 없습니다.',
  error,
  messages,
  title = '실시간 채팅',
}: Props): React.JSX.Element {
  return (
    <View className="mt-[18px] gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-[13px] font-black tracking-normal text-ink">
          {title}
        </Text>
        <Text className="text-[11px] tracking-normal text-muted2">
          {messages.length}개
        </Text>
      </View>

      {error ? (
        <Text className="rounded-[12px] border border-line bg-card p-3 text-[12px] leading-5 tracking-normal text-yellowDeep">
          {error}
        </Text>
      ) : messages.length === 0 ? (
        <Text className="rounded-[12px] border border-line bg-card p-3 text-[12px] leading-5 tracking-normal text-muted">
          {emptyText}
        </Text>
      ) : (
        messages.map(message => (
          <View
            key={message.id}
            className="gap-[5px] rounded-[12px] border border-line bg-card p-3"
          >
            <Text className="text-[12px] font-black tracking-normal text-ink">
              {message.username}
            </Text>
            <Text className="text-[13px] leading-5 tracking-normal text-ink2">
              {message.message}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}
