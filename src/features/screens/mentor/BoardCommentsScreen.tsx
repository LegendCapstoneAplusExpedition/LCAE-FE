import React, { useState } from 'react';
import {
  InputAccessoryView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { boardComments, mentorPosts } from '../../mocks';
import { MentoLogo } from '../../../design-system/components/MentoLogo';
import {
  BackButton,
  PrimaryButton,
  Screen,
} from '../../../design-system/components/Primitives';

type Props = {
  onBack: () => void;
};

const accessoryID = 'board-comment-input-accessory';

export function BoardCommentsScreen({ onBack }: Props): React.JSX.Element {
  const [reply, setReply] = useState('');
  const post = mentorPosts[0];
  const input = (
    <CommentInput
      inputAccessoryViewID={Platform.OS === 'ios' ? accessoryID : undefined}
      onChangeText={setReply}
      value={reply}
    />
  );

  return (
    <Screen>
      <View className="h-12 justify-center px-4">
        <BackButton onPress={onBack} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? undefined : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-24"
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-2.5 rounded-[18px] border border-line bg-card p-[14px]">
            <View className="flex-row items-center gap-2">
              <MentoLogo size={32} />
              <View>
                <Text className="text-[12.5px] font-black tracking-normal text-ink">
                  {post.mentor}
                </Text>
                <Text className="mt-[1px] text-[10.5px] tracking-normal text-muted2">
                  {post.time} 작성됨
                </Text>
              </View>
            </View>
            <Text className="text-[12.5px] leading-[20px] tracking-normal text-ink2">
              {post.body}
            </Text>
            <View className="border-t border-line2 pt-2">
              <Text className="text-[11px] font-bold tracking-normal text-muted">
                ♡ 좋아요 {post.likes}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between pb-2 pt-4">
            <Text className="text-[12.5px] font-black tracking-normal text-muted">
              댓글 {boardComments.length}
            </Text>
            <Text className="text-[11px] tracking-normal text-muted2">
              최신순
            </Text>
          </View>

          <View className="gap-2">
            {boardComments.map(comment => (
              <View
                key={comment.id}
                className="flex-row items-start gap-2.5 rounded-[12px] border border-line bg-card p-3"
              >
                <View className="h-[22px] w-11 items-center justify-center rounded-[5px] bg-ink">
                  <Text className="text-[10px] font-black tracking-normal text-yellow">
                    {comment.author}
                  </Text>
                </View>
                <Text className="flex-1 text-[12px] leading-[18px] tracking-normal text-ink2">
                  {comment.body}
                </Text>
                <Text className="text-[12px] text-muted2">♡</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {Platform.OS === 'ios' ? (
          <InputAccessoryView nativeID={accessoryID}>
            {input}
          </InputAccessoryView>
        ) : (
          input
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

function CommentInput({
  inputAccessoryViewID,
  onChangeText,
  value,
}: {
  inputAccessoryViewID?: string;
  onChangeText: (text: string) => void;
  value: string;
}): React.JSX.Element {
  return (
    <View className="flex-row items-center gap-2 border-t border-line2 bg-white px-4 pb-6 pt-2">
      <TextInput
        className="h-10 flex-1 rounded-full bg-chip px-4 text-[12px] tracking-normal text-ink"
        inputAccessoryViewID={inputAccessoryViewID}
        onChangeText={onChangeText}
        placeholder="댓글을 입력하세요..."
        placeholderTextColor="#9A9DAE"
        returnKeyType="send"
        value={value}
      />
      <View className="w-[58px]">
        <PrimaryButton size="small" tone="yellow">
          등록
        </PrimaryButton>
      </View>
    </View>
  );
}
