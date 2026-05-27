import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import {
  liveStreamingQuestions,
  liveStreamingSession,
  type LiveQuestionItem,
} from '../../mocks';
import { MentoLogo } from '../../../design-system/components/MentoLogo';
import {
  BackButton,
  LiveBadge,
  Screen,
} from '../../../design-system/components/Primitives';
import { Waveform } from '../../../design-system/components/Waveform';
import { IconChat } from '../../../design-system/icons';
import { LiveQuestionBar } from '../../components/LiveQuestionBar';

type Props = {
  onBack: () => void;
};

export function LiveStreamingScreen({ onBack }: Props): React.JSX.Element {
  const [questions, setQuestions] = useState<LiveQuestionItem[]>(
    liveStreamingQuestions,
  );

  const handleSendQuestion = (message: string) => {
    setQuestions(currentQuestions => [
      {
        id: `local-${Date.now()}`,
        name: '나',
        body: message,
        likes: 0,
      },
      ...currentQuestions,
    ]);
  };

  return (
    <Screen>
      <View className="h-11 flex-row items-center justify-between px-4">
        <BackButton onPress={onBack} />
        <LiveBadge>{`Live · ${liveStreamingSession.liveTime}`}</LiveBadge>
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
            {liveStreamingSession.mentorName}
          </Text>
          <Text className="mt-1 text-[12px] tracking-normal text-muted">
            {liveStreamingSession.title}
          </Text>
          <View className="mt-2 flex-row items-center gap-[6px]">
            <View className="h-[5px] w-[5px] rounded-full bg-yellowDeep" />
            <Text className="text-[11px] tracking-normal text-muted2">
              {liveStreamingSession.viewerCount}명 청취 중
            </Text>
          </View>
        </View>

        <Waveform />

        <View className="mt-[18px] gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-[13px] font-black tracking-normal text-ink">
              실시간 질문
            </Text>
          </View>

          {questions.map(question => (
            <View
              key={question.id}
              className="gap-[5px] rounded-[12px] border border-line bg-card p-3"
            >
              <Text className="text-[12px] font-black tracking-normal text-ink">
                {question.name}
              </Text>
              <Text className="text-[13px] leading-5 tracking-normal text-ink2">
                {question.body}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <LiveQuestionBar onSend={handleSendQuestion} />
    </Screen>
  );
}
