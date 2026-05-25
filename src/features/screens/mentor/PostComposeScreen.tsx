import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  BackButton,
  PrimaryButton,
} from '../../../design-system/components/Primitives';
import { MentoLogo } from '../../../design-system/components/MentoLogo';
import { postComposeAuthor, postComposeToolbarItems } from '../../mocks';

type Props = {
  onBack: () => void;
  onSubmit: () => void;
};

export function PostComposeScreen({
  onBack,
  onSubmit,
}: Props): React.JSX.Element {
  const [body, setBody] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-bg"
    >
      <View className="h-12 flex-row items-center justify-between px-4">
        <BackButton onPress={onBack} />
        <View className="w-[78px]">
          <PrimaryButton size="small" tone="yellow" onPress={onSubmit}>
            등록
          </PrimaryButton>
        </View>
      </View>

      <View className="flex-row items-center gap-2.5 px-5 pb-2.5">
        <MentoLogo size={36} />
        <View className="flex-1">
          <Text className="text-[13px] font-black tracking-normal text-ink">
            {postComposeAuthor.name}
          </Text>
          <Text className="mt-[2px] text-[10.5px] tracking-normal text-muted2">
            {postComposeAuthor.meta}
          </Text>
        </View>
      </View>

      <TextInput
        className="flex-1 px-5 pt-3 text-[14px] leading-[23px] tracking-normal text-ink"
        multiline
        onChangeText={setBody}
        placeholder="오늘의 이야기를 모두와 공유해보세요."
        placeholderTextColor="#9A9DAE"
        textAlignVertical="top"
        value={body}
      />

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
