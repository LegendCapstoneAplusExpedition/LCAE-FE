import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  liveStreamingPinnedQuestion,
  liveStreamingQuestions,
  liveStreamingSession,
} from '../../mocks';
import { MentoLogo } from '../../../design-system/components/MentoLogo';
import {
  BackButton,
  LiveBadge,
  Screen,
} from '../../../design-system/components/Primitives';
import { Waveform } from '../../../design-system/components/Waveform';
import {
  IconChat,
  IconMic,
  IconMicOff,
  IconStop,
} from '../../../design-system/icons';
import { ds } from '../../../design-system/tokens';

type Props = {
  onBack: () => void;
  onEnd: () => void;
};

export function LiveBroadcastScreen({
  onBack,
  onEnd,
}: Props): React.JSX.Element {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  return (
    <Screen>
      <View className="h-11 flex-row items-center justify-between px-4">
        <BackButton onPress={onBack} />
        <LiveBadge>{`Live · ${liveStreamingSession.liveTime}`}</LiveBadge>
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
            {liveStreamingSession.title}
          </Text>
          <Text className="mt-2 text-[11px] tracking-normal text-muted2">
            ● {liveStreamingSession.viewerCount}명 청취 중
          </Text>
        </View>

        <Waveform />

        <View className="mt-2 gap-[6px] rounded-[18px] bg-ink p-4">
          <Text className="text-[11px] font-black tracking-normal text-yellow">
            핀된 질문
          </Text>
          <Text className="text-[15px] font-extrabold leading-[22px] tracking-normal text-white">
            {liveStreamingPinnedQuestion.body}
          </Text>
          <Text className="text-[11px] tracking-normal text-white/60">
            {liveStreamingPinnedQuestion.name} ·{' '}
            {liveStreamingPinnedQuestion.time}
          </Text>
        </View>

        <View className="mt-[18px] flex-row items-center justify-between">
          <Text className="text-[13px] font-black tracking-normal text-ink">
            질문 큐
          </Text>
          <Text className="text-[11px] tracking-normal text-muted2">
            {liveStreamingQuestions.length}개 대기
          </Text>
        </View>
        {liveStreamingQuestions.map(question => (
          <View
            key={question.id}
            className="mt-2 gap-[6px] rounded-[12px] border border-line bg-card p-3"
          >
            <View className="flex-row justify-between">
              <Text className="text-[12px] font-black tracking-normal text-ink">
                {question.name}
              </Text>
              <Text className="text-[11px] font-black tracking-normal text-yellowDeep">
                핀하기
              </Text>
            </View>
            <Text className="text-[13px] leading-5 tracking-normal text-ink2">
              {question.body}
            </Text>
          </View>
        ))}
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
          className={`h-32 w-28 items-center justify-center rounded-full  ${
            micEnabled ? 'bg-yellow' : 'bg-yellowSoft'
          }`}
          onPress={() => setMicEnabled(value => !value)}
          style={styles.micButtonShadow}
        >
          {micEnabled ? (
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
