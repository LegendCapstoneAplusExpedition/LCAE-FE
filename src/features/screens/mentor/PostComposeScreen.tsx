import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useMentorBoard } from '../../hooks/useMentorBoard';
import {
  BackButton,
  PrimaryButton,
} from '../../../design-system/components/Primitives';
import { MentoLogo } from '../../../design-system/components/MentoLogo';
import { postComposeToolbarItems } from '../../mocks';

type Props = {
  onBack: () => void;
  onSubmit: (title: string, body: string) => Promise<void> | void;
};

export function PostComposeScreen({
  onBack,
  onSubmit,
}: Props): React.JSX.Element {
  const { profile: mentorProfile } = useMentorBoard();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (submitting) {
      return;
    }

    if (!title.trim()) {
      setError('제목을 입력하세요.');
      return;
    }

    if (!body.trim()) {
      setError('내용을 입력하세요.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(title, body);
    } catch (err) {
      setError('게시글을 등록하지 못했습니다.');
      console.error('Failed to submit post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-bg"
    >
      <View className="h-12 flex-row items-center justify-between px-4">
        <BackButton onPress={onBack} />
      </View>

      <View className="flex-row items-center gap-2.5 px-5 pb-2.5">
        <MentoLogo size={36} />
        <View className="flex-1">
          <Text className="text-lg font-black tracking-normal text-ink">
            {mentorProfile?.name ?? '멘토'}
          </Text>
        </View>
        <View className="w-[78px]">
          <PrimaryButton size="small" tone="yellow" onPress={handleSubmit}>
            {submitting ? '등록중' : '등록'}
          </PrimaryButton>
        </View>
      </View>

      <TextInput
        className="border-b border-line px-5 py-3 text-[15px] font-bold tracking-normal text-ink"
        onChangeText={setTitle}
        placeholder="제목을 입력하세요."
        placeholderTextColor="#9A9DAE"
        returnKeyType="next"
        value={title}
      />
      <TextInput
        className="flex-1 px-5 pt-3 text-[14px] leading-[23px] tracking-normal text-ink"
        multiline
        onChangeText={setBody}
        placeholder="오늘의 이야기를 모두와 공유해보세요."
        placeholderTextColor="#9A9DAE"
        textAlignVertical="top"
        value={body}
      />

      {error ? (
        <Text className="px-5 pb-2 text-[11px] font-bold tracking-normal text-yellowDeep">
          {error}
        </Text>
      ) : null}

      <View className="flex-row items-center gap-2.5 px-4 pb-3">
        {postComposeToolbarItems.map(icon => (
          <View
            key={icon}
            className="h-9 w-9 items-center justify-center rounded-[10px] bg-chip"
          >
            <Text className="text-[18px] font-extrabold text-muted">
              {icon}
            </Text>
          </View>
        ))}
        <View className="flex-1" />
        <Text className="text-[11px] tracking-normal text-muted2">
          {body.length} / 1000
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}
