import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { login, signup } from '../../../services/api/users';
import {
  BackButton,
  PrimaryButton,
} from '../../../design-system/components/Primitives';
import { MentoLogo } from '../../../design-system/components/MentoLogo';

type AuthUser = { id: string; username: string };

type Props = {
  onBack: () => void;
  onLogin: (token: string, user: AuthUser) => void;
};

export function LoginScreen({ onBack, onLogin }: Props): React.JSX.Element {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) {
      return;
    }

    if (!username.trim()) {
      setError('아이디를 입력하세요.');
      return;
    }

    if (!password) {
      setError('비밀번호를 입력하세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        await signup({ username: username.trim(), password });
      }
      const auth = await login({ username: username.trim(), password });
      onLogin(auth.token, auth.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-bg"
    >
      <View className="h-12 flex-row items-center px-4">
        <BackButton onPress={onBack} />
      </View>

      <View className="flex-1 justify-center px-6">
        <View className="mb-8 items-center gap-2">
          <MentoLogo size={64} />
          <Text className="text-[22px] font-black tracking-normal text-ink">
            {mode === 'login' ? '로그인' : '회원가입'}
          </Text>
        </View>

        <View className="gap-3">
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            className="h-12 rounded-[12px] bg-chip px-4 text-[14px] tracking-normal text-ink"
            onChangeText={setUsername}
            placeholder="아이디"
            placeholderTextColor="#9A9DAE"
            value={username}
          />
          <TextInput
            className="h-12 rounded-[12px] bg-chip px-4 text-[14px] tracking-normal text-ink"
            onChangeText={setPassword}
            placeholder="비밀번호"
            placeholderTextColor="#9A9DAE"
            secureTextEntry
            value={password}
          />

          {error ? (
            <Text className="text-[12px] font-bold tracking-normal text-yellowDeep">
              {error}
            </Text>
          ) : null}

          <View className="mt-1">
            <PrimaryButton
              tone="yellow"
              onPress={() => {
                void handleSubmit();
              }}
            >
              {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
            </PrimaryButton>
          </View>
        </View>

        <Pressable
          className="mt-6 items-center py-2"
          onPress={() => {
            setMode(m => (m === 'login' ? 'signup' : 'login'));
            setError(null);
          }}
        >
          <Text className="text-[13px] tracking-normal text-muted">
            {mode === 'login'
              ? '아직 계정이 없나요?  회원가입'
              : '이미 계정이 있나요?  로그인'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
