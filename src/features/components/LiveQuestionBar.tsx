import React, { useState } from 'react';
import { View } from 'react-native';
import {
  SendButton,
  SearchPill,
} from '../../design-system/components/Primitives';

type Props = {
  placeholder?: string;
  onSend?: (message: string) => void;
};

export function LiveQuestionBar({
  placeholder = '질문을 입력해보세요',
  onSend,
}: Props): React.JSX.Element {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    onSend?.(trimmedMessage);
    setMessage('');
  };

  return (
    <View className="flex-row items-center gap-2.5 border-t border-line bg-white p-[14px]">
      <View className="flex-1">
        <SearchPill
          showIcon={false}
          placeholder={placeholder}
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
      </View>
      <View>
        <SendButton onPress={sendMessage} />
      </View>
    </View>
  );
}
