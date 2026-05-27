import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { liveStreamingSession } from '../../mocks';
import { MentoLogo } from '../../../design-system/components/MentoLogo';
import {
  LiveBadge,
  Screen,
} from '../../../design-system/components/Primitives';
import { Waveform } from '../../../design-system/components/Waveform';
import { LiveChatList } from '../../components/LiveChatList';
import {
  IconChat,
  IconMic,
  IconMicOff,
  IconStop,
} from '../../../design-system/icons';
import { ds } from '../../../design-system/tokens';
import type { BroadcastSession } from '../../../services/socket/broadcastSocket';
import {
  startBroadcastAudioProducer,
  type BroadcastAudioProducerSession,
} from '../../../services/socket/broadcastAudioProducer';
import { useBroadcastChat } from '../../hooks/useBroadcastChat';
import { useBroadcastRuntimeStatus } from '../../hooks/useBroadcastRuntimeStatus';

type Props = {
  mentorToken?: string | null;
  onEnd: () => void;
  session?: BroadcastSession | null;
};

const SILENT_WAVEFORM_VALUES = Array.from({ length: 20 }, () => 0.04);
const BAND_WEIGHTS = [
  0.22, 0.3, 0.42, 0.58, 0.74, 0.92, 1, 0.9, 0.78, 0.66, 0.56, 0.48, 0.42, 0.36,
  0.31, 0.26, 0.22, 0.18, 0.14, 0.1,
];

export function LiveBroadcastScreen({
  mentorToken,
  onEnd,
  session,
}: Props): React.JSX.Element {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);
  const [micEnabled, setMicEnabled] = useState(false);
  const [micStarting, setMicStarting] = useState(false);
  const audioProducerSessionRef = useRef<BroadcastAudioProducerSession | null>(
    null,
  );
  const broadcastTitle = session?.title ?? liveStreamingSession.title;
  const [waveformValues, setWaveformValues] = useState(SILENT_WAVEFORM_VALUES);
  const {
    error: chatError,
    messages: chatMessages,
  } = useBroadcastChat({
    autoJoin: false,
    broadcastId: session?.broadcastId,
    token: mentorToken,
  });
  const { liveTime, viewersCount } = useBroadcastRuntimeStatus({
    broadcastId: session?.broadcastId,
    initialCreatedAt: session?.createdAt,
    initialViewersCount: session?.viewersCount ?? 0,
  });

  const handleAudioLevel = useCallback((level: number) => {
    setWaveformValues(createWaveformValues(level));
  }, []);

  const stopMic = () => {
    audioProducerSessionRef.current?.stop();
    audioProducerSessionRef.current = null;
    setMicEnabled(false);
    setWaveformValues(SILENT_WAVEFORM_VALUES);
  };

  const toggleMic = async () => {
    if (micStarting) {
      return;
    }

    if (micEnabled) {
      stopMic();
      return;
    }

    if (!session) {
      setMicError('방송 방 정보가 없습니다.');
      return;
    }

    if (!mentorToken) {
      setMicError('멘토 토큰이 없습니다.');
      return;
    }

    setMicStarting(true);
    setMicError(null);

    try {
      audioProducerSessionRef.current = await startBroadcastAudioProducer({
        broadcastId: session.broadcastId,
        onAudioLevel: handleAudioLevel,
        routerRtpCapabilities: session.rtpCapabilities,
        token: mentorToken,
      });
      setMicEnabled(true);
    } catch (error) {
      audioProducerSessionRef.current = null;
      setMicEnabled(false);
      setMicError(
        error instanceof Error
          ? error.message
          : '마이크 송출을 시작하지 못했습니다.',
      );
      setWaveformValues(SILENT_WAVEFORM_VALUES);
    } finally {
      setMicStarting(false);
    }
  };

  useEffect(() => {
    return () => {
      audioProducerSessionRef.current?.stop();
      audioProducerSessionRef.current = null;
    };
  }, []);

  return (
    <Screen>
      <View className="h-11 flex-row items-center justify-between px-4">
        <LiveBadge>{`Live · ${liveTime}`}</LiveBadge>
        <View className="w-8 items-end">
          <IconChat />
        </View>
      </View>

      <ScrollView contentContainerClassName="px-5 pb-[18px]">
        <View className="items-center pb-1 pt-3">
          <MentoLogo size={76} />
          <Text className="mt-2.5 text-[16px] font-black tracking-normal text-ink">
            {liveStreamingSession.mentorName}
          </Text>
          <Text className="mt-[3px] text-[11.5px] tracking-normal text-muted">
            {broadcastTitle}
          </Text>
          {session ? (
            <Text className="mt-[3px] text-[10.5px] tracking-normal text-muted2">
              방 ID {session.broadcastId}
            </Text>
          ) : null}
          <Text className="mt-2 text-[11px] tracking-normal text-muted2">
            ● {viewersCount}명 청취 중
          </Text>
        </View>

        <Waveform values={waveformValues} />
        {micError ? (
          <Text className="px-2 pb-2 text-center text-[11px] font-bold tracking-normal text-yellowDeep">
            {micError}
          </Text>
        ) : null}

        <LiveChatList
          emptyText="시청자 채팅이 여기에 표시됩니다."
          error={chatError}
          messages={chatMessages}
        />
      </ScrollView>

      <View className="flex-row items-center justify-center gap-8 px-6 pb-3 pt-2">
        <Pressable
          accessibilityLabel={aiEnabled ? 'AI 끄기' : 'AI 켜기'}
          accessibilityRole="button"
          className={`h-20 w-20 items-center justify-center rounded-full ${
            aiEnabled ? 'bg-ink' : ' bg-[#9A9DAE]'
          }`}
          onPress={() => setAiEnabled(value => !value)}
        >
          <Text className="text-[24px] font-black tracking-normal text-white">
            AI
          </Text>
          {!aiEnabled ? <View style={styles.aiDisabledSlash} /> : null}
        </Pressable>

        <Pressable
          accessibilityLabel={micEnabled ? '마이크 끄기' : '마이크 켜기'}
          accessibilityRole="button"
          disabled={micStarting}
          className={`h-32 w-28 items-center justify-center rounded-full  ${
            micEnabled ? 'bg-yellow' : 'bg-yellowSoft'
          }`}
          onPress={() => {
            void toggleMic();
          }}
          style={styles.micButtonShadow}
        >
          {micStarting ? (
            <Text className="text-[12px] font-black tracking-normal text-ink">
              연결중
            </Text>
          ) : micEnabled ? (
            <IconMic color={ds.color.ink} size={42} />
          ) : (
            <IconMicOff color={ds.color.ink} size={42} />
          )}
        </Pressable>

        <Pressable
          accessibilityLabel="라이브 종료"
          accessibilityRole="button"
          className="h-20 w-20 items-center justify-center rounded-full bg-ink active:bg-ink2"
          onPress={onEnd}
        >
          <IconStop color={ds.color.white} size={28} />
        </Pressable>
      </View>
    </Screen>
  );
}

function createWaveformValues(level: number): number[] {
  const normalizedLevel = Math.max(0, Math.min(1, level));

  if (normalizedLevel <= 0.015) {
    return SILENT_WAVEFORM_VALUES;
  }

  return BAND_WEIGHTS.map((weight, index) => {
    const movement = Math.sin(Date.now() / 95 + index * 0.83) * 0.08;
    return Math.max(
      0.05,
      Math.min(1, normalizedLevel * weight * 1.9 + movement),
    );
  });
}

const styles = StyleSheet.create({
  aiDisabledSlash: {
    backgroundColor: '#FF8F8F',
    borderRadius: 999,
    height: 5,
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    width: 56,
  },
  micButtonShadow: {
    elevation: 5,
    shadowColor: ds.color.yellowDeep,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
  },
});
