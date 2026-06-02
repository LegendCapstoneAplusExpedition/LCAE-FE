import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { MentoLogo } from '../../../design-system/components/MentoLogo';
import {
  BackButton,
  FieldLabel,
  Screen,
} from '../../../design-system/components/Primitives';
import { IconPlay } from '../../../design-system/icons';
import { ds } from '../../../design-system/tokens';
import {
  MentorConsoleNavigation,
  MentorConsoleTab,
} from '../../components/MentorConsoleNavigation';

export type LivePrepareDraft = {
  title: string;
  topic: string;
};

type Props = {
  mentorUsername?: string | null;
  onBack: () => void;
  onStart: (draft: LivePrepareDraft) => Promise<void> | void;
  onOpenBoard?: () => void;
};

const TITLE_MAX_LENGTH = 40;
const TOPIC_MAX_LENGTH = 160;

export function LivePrepareScreen({
  mentorUsername,
  onBack,
  onStart,
  onOpenBoard,
}: Props): React.JSX.Element {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const mentorName = mentorUsername?.trim() || '멘토';

  const handleTabChange = (tab: MentorConsoleTab) => {
    if (tab === 'board') {
      onOpenBoard?.();
      return;
    }
  };

  const handleStart = async () => {
    const nextTitle = title.trim();
    const nextTopic = topic.trim();

    if (!nextTitle) {
      setError('방송 제목을 입력하세요.');
      return;
    }

    if (!nextTopic) {
      setError('방송 주제를 입력하세요.');
      return;
    }

    if (starting) {
      return;
    }

    setStarting(true);
    setError(null);

    try {
      await onStart({
        title: nextTitle,
        topic: nextTopic,
      });
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : '라이브 방을 생성하지 못했습니다.',
      );
    } finally {
      setStarting(false);
    }
  };

  return (
    <Screen>
      <View className="h-12 justify-center px-4">
        <BackButton onPress={onBack} />
      </View>

      <ScrollView
        contentContainerClassName="flex-grow pb-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center pb-2.5 pt-5">
          <MentoLogo size={84} />
          <Text className="mt-[14px] text-[18px] font-black tracking-normal text-ink">
            {mentorName}
          </Text>
          <Text className="mt-1 text-[12px] tracking-normal text-muted">
            라이브 방송 준비
          </Text>
        </View>

        <View className="px-5 pt-5">
          <FieldLabel>방송 제목</FieldLabel>
          <View className="h-12 flex-row items-center rounded-[12px] border-[1.2px] border-line bg-white px-4">
            <TextInput
              className="flex-1 p-0 py-1 text-[14px] font-extrabold tracking-normal text-ink"
              maxLength={TITLE_MAX_LENGTH}
              onChangeText={setTitle}
              placeholder="제목을 입력하세요."
              placeholderTextColor={ds.color.muted2}
              value={title}
            />
          </View>
          <Text className="mt-[6px] text-right text-[10.5px] tracking-normal text-muted2">
            {title.length} / {TITLE_MAX_LENGTH}
          </Text>
        </View>

        <View className="px-5 pt-5">
          <FieldLabel>방송 주제</FieldLabel>
          <View className="min-h-[104px] rounded-[12px] border-[1.2px] border-line bg-white px-4 py-3">
            <TextInput
              className="min-h-[78px] p-0 py-1 text-[14px] font-bold leading-5 tracking-normal text-ink"
              maxLength={TOPIC_MAX_LENGTH}
              multiline
              onChangeText={setTopic}
              placeholder="오늘 다룰 핵심 주제를 적어주세요"
              placeholderTextColor={ds.color.muted2}
              textAlignVertical="top"
              value={topic}
            />
          </View>
          <Text className="mt-[6px] text-right text-[10.5px] tracking-normal text-muted2">
            {topic.length} / {TOPIC_MAX_LENGTH}
          </Text>
          {error ? (
            <Text className="mt-2 text-[11px] font-bold tracking-normal text-yellowDeep">
              {error}
            </Text>
          ) : null}
        </View>

        <View className="flex-1" />

        <View className="items-center gap-2 px-5 pb-3 pt-7">
          <Pressable
            accessibilityRole="button"
            disabled={starting}
            className="h-[76px] w-[76px] items-center justify-center rounded-full bg-yellow active:bg-yellowSoft"
            onPress={() => {
              void handleStart();
            }}
            style={styles.startButtonShadow}
          >
            <IconPlay color={ds.color.ink} size={32} />
          </Pressable>
          <Text className="text-[13px] font-black tracking-normal text-ink">
            {starting ? '라이브 생성중' : '라이브 시작하기'}
          </Text>
        </View>
      </ScrollView>

      <MentorConsoleNavigation active="live" onChange={handleTabChange} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  startButtonShadow: {
    elevation: 4,
    shadowColor: ds.color.yellowDeep,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.34,
    shadowRadius: 18,
  },
});
