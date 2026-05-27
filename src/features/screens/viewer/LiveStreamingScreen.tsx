import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { liveStreamingSession, type LiveSession } from '../../mocks';
import { MentoLogo } from '../../../design-system/components/MentoLogo';
import {
  BackButton,
  LiveBadge,
  Screen,
} from '../../../design-system/components/Primitives';
import { Waveform } from '../../../design-system/components/Waveform';
import { IconChat } from '../../../design-system/icons';
import { LiveChatList } from '../../components/LiveChatList';
import { LiveQuestionBar } from '../../components/LiveQuestionBar';
import { useBroadcastAudioConsumer } from '../../hooks/useBroadcastAudioConsumer';
import { useBroadcastChat } from '../../hooks/useBroadcastChat';
import { useBroadcastRuntimeStatus } from '../../hooks/useBroadcastRuntimeStatus';

type Props = {
  onBack: () => void;
  onBroadcastEnded?: () => void;
  session?: LiveSession | null;
  viewerToken?: string | null;
};

export function LiveStreamingScreen({
  onBack,
  onBroadcastEnded,
  session,
  viewerToken,
}: Props): React.JSX.Element {
  const {
    error: chatError,
    joined: chatJoined,
    messages: chatMessages,
    sendMessage,
  } = useBroadcastChat({
    autoJoin: false,
    broadcastId: session?.id,
    disconnectOnUnmount: true,
    token: viewerToken,
  });
  const { error: audioError, status: audioStatus } = useBroadcastAudioConsumer({
    broadcastId: session?.id,
    onBroadcastEnded,
    token: viewerToken,
  });
  const chatReady = chatJoined && audioStatus === 'listening';
  const mentorName = session?.mentor ?? liveStreamingSession.mentorName;
  const title = session?.title ?? liveStreamingSession.title;
  const { liveTime, viewersCount } = useBroadcastRuntimeStatus({
    broadcastId: session?.id,
    initialCreatedAt: session?.createdAt,
    initialViewersCount: session?.viewers ?? 0,
  });

  return (
    <Screen>
      <View className="h-11 flex-row items-center justify-between px-4">
        <BackButton onPress={onBack} />
        <LiveBadge>{`Live · ${liveTime}`}</LiveBadge>
        <View className="w-8 items-end">
          <IconChat />
        </View>
      </View>

      <ScrollView
        contentContainerClassName="px-5 pb-[18px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center pb-2 pt-[14px]">
          <MentoLogo size={92} />
          <Text className="mt-[14px] text-[18px] font-black tracking-normal text-ink">
            {mentorName}
          </Text>
          <Text className="mt-1 text-[12px] tracking-normal text-muted">
            {title}
          </Text>
          {session ? (
            <Text className="mt-[3px] text-[10.5px] tracking-normal text-muted2">
              방 ID {session.id}
            </Text>
          ) : null}
          <View className="mt-2 flex-row items-center gap-[6px]">
            <View className="h-[5px] w-[5px] rounded-full bg-yellowDeep" />
            <Text className="text-[11px] tracking-normal text-muted2">
              {viewersCount}명 청취 중
            </Text>
          </View>
        </View>

        <Waveform />
        <Text className="px-2 pb-2 text-center text-[11px] font-bold tracking-normal text-muted2">
          {getAudioStatusLabel(audioStatus, audioError)}
        </Text>

        <LiveChatList
          emptyText="채팅을 입력해 멘토와 대화해보세요."
          error={
            session
              ? chatError
              : '선택된 라이브 정보가 없어 채팅방에 입장하지 못했습니다.'
          }
          messages={chatMessages}
        />
      </ScrollView>
      <LiveQuestionBar
        placeholder={chatReady ? '채팅을 입력하세요' : '채팅 연결 중'}
        onSend={message => {
          if (!chatReady) {
            return;
          }

          void sendMessage(message);
        }}
      />
    </Screen>
  );
}

function getAudioStatusLabel(
  status: ReturnType<typeof useBroadcastAudioConsumer>['status'],
  error: string | null,
): string {
  if (error) {
    return error;
  }

  if (status === 'connecting') {
    return '방송 오디오 연결 중';
  }

  if (status === 'listening') {
    return '방송 청취 중';
  }

  return '방송 오디오 대기 중';
}
