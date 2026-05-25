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
  Chip,
  FieldLabel,
  Screen,
} from '../../../design-system/components/Primitives';
import { ToggleSwitch } from '../../../design-system/components/ToggleSwitch';
import { IconPlay } from '../../../design-system/icons';
import { ds } from '../../../design-system/tokens';
import {
  livePrepareActiveCategory,
  livePrepareCategories,
  livePrepareDraft,
  mentorProfile,
} from '../../mocks';
import {
  MentorConsoleNavigation,
  MentorConsoleTab,
} from '../../components/MentorConsoleNavigation';

type Props = {
  onBack: () => void;
  onStart: (title: string) => void;
  onOpenBoard?: () => void;
  onOpenReplay?: () => void;
};

type VisibilityOption = '전체 공개' | '구독자 전용' | '비공개';

const visibilityOptions: VisibilityOption[] = [
  '전체 공개',
  '구독자 전용',
  '비공개',
];

export function LivePrepareScreen({
  onBack,
  onStart,
  onOpenBoard,
  onOpenReplay,
}: Props): React.JSX.Element {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState<VisibilityOption>('전체 공개');
  const [saveReplay, setSaveReplay] = useState(true);
  const [sendNotification, setSendNotification] = useState(true);

  const handleTabChange = (tab: MentorConsoleTab) => {
    if (tab === 'board') {
      onOpenBoard?.();
      return;
    }

    if (tab === 'replay') {
      onOpenReplay?.();
    }
  };

  const cycleVisibility = () => {
    setVisibility(current => {
      const currentIndex = visibilityOptions.indexOf(current);
      return visibilityOptions[(currentIndex + 1) % visibilityOptions.length];
    });
  };

  const settings = [
    {
      label: '공개 범위',
      onPress: cycleVisibility,
      type: 'link',
      value: visibility,
    },
    {
      enabled: saveReplay,
      label: '다시듣기 저장',
      onPress: () => setSaveReplay(value => !value),
      type: 'toggle',
      value: saveReplay ? 'ON' : 'OFF',
    },
    {
      enabled: sendNotification,
      label: '알림 발송',
      onPress: () => setSendNotification(value => !value),
      type: 'toggle',
      value: sendNotification ? mentorProfile.subscriberText : 'OFF',
    },
  ] as const;

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
            {mentorProfile.name}
          </Text>
          <Text className="mt-1 text-[12px] tracking-normal text-muted">
            {mentorProfile.subscriberText}
          </Text>
        </View>

        <View className="px-5 pt-5">
          <FieldLabel>방송 제목</FieldLabel>
          <View className="h-12 flex-row items-center rounded-[12px] border-[1.5px] border-ink bg-white px-4">
            <TextInput
              className="flex-1 p-0 text-[14px] font-extrabold tracking-normal text-ink"
              maxLength={livePrepareDraft.titleMaxLength}
              onChangeText={setTitle}
              placeholder={livePrepareDraft.titlePlaceholder}
              placeholderTextColor={ds.color.muted2}
              value={title}
            />
          </View>
          <Text className="mt-[6px] text-right text-[10.5px] tracking-normal text-muted2">
            {title.length} / {livePrepareDraft.titleMaxLength}
          </Text>
        </View>

        <View className="px-5 pt-5">
          <FieldLabel>카테고리</FieldLabel>
          <View className="flex-row flex-wrap gap-[6px]">
            {livePrepareCategories.map(chip => (
              <Chip key={chip} active={chip === livePrepareActiveCategory}>
                {chip}
              </Chip>
            ))}
          </View>
        </View>

        <View className="mx-5 mt-[18px] overflow-hidden rounded-[14px] border border-line bg-card">
          {settings.map((setting, index) => (
            <Pressable
              key={setting.label}
              accessibilityRole={
                setting.type === 'toggle' ? 'switch' : 'button'
              }
              accessibilityState={
                setting.type === 'toggle'
                  ? { checked: setting.enabled }
                  : undefined
              }
              className={`flex-row items-center justify-between px-4 py-[14px] ${
                index < settings.length - 1 ? 'border-b border-line2' : ''
              }`}
              onPress={setting.onPress}
            >
              <Text className="text-[13px] font-extrabold tracking-normal text-ink2">
                {setting.label}
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-[13px] tracking-normal text-muted">
                  {setting.value}
                  {setting.type === 'link' ? ' ›' : ''}
                </Text>
                {setting.type === 'toggle' ? (
                  <ToggleSwitch value={setting.enabled} />
                ) : null}
              </View>
            </Pressable>
          ))}
        </View>

        <View className="flex-1" />

        <View className="items-center gap-2 px-5 pb-3 pt-7">
          <Pressable
            accessibilityRole="button"
            className="h-[76px] w-[76px] items-center justify-center rounded-full bg-yellow active:bg-yellowSoft"
            onPress={() => onStart(title.trim())}
            style={styles.startButtonShadow}
          >
            <IconPlay color={ds.color.ink} size={32} />
          </Pressable>
          <Text className="text-[13px] font-black tracking-normal text-ink">
            라이브 시작하기
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
