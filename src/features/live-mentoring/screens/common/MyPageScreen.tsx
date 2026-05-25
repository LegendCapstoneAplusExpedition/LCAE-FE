import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BottomNavigation } from '../../../components/BottomNavigation';
import { MentoLogo } from '../../../../design-system/components/MentoLogo';
import { Screen } from '../../../../design-system/components/Primitives';

type Props = {
  onOpenLive: () => void;
  onOpenMentorConsole: () => void;
  onOpenMyLive: () => void;
};

const menu = [
  ['구독 중인 멘토', '12명'],
  ['예약 내역', '1건'],
  ['작성한 리뷰', '8개'],
  ['알림 설정', ''],
];

export function MyPageScreen({
  onOpenLive,
  onOpenMentorConsole,
  onOpenMyLive,
}: Props): React.JSX.Element {
  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-5 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-12 flex-row items-center justify-between">
          <Text className="text-[18px] font-black tracking-normal text-ink">
            마이페이지
          </Text>
          <Text className="text-[20px] text-ink">⚙</Text>
        </View>

        <View className="mt-2 flex-row items-center gap-3 rounded-[18px] border border-line bg-card p-[14px]">
          <MentoLogo label="멘티" size={56} />
          <View>
            <Text className="text-[16px] font-black tracking-normal text-ink">
              무무
            </Text>
            <Text className="mt-[2px] text-[11.5px] tracking-normal text-muted">
              프로필 편집 ›
            </Text>
          </View>
          <View className="flex-1" />
          <Pressable
            accessibilityRole="button"
            className="rounded-full bg-yellow px-[14px] py-2.5 active:bg-yellowSoft"
            onPress={onOpenMentorConsole}
          >
            <Text className="text-center text-[11.5px] font-black leading-4 tracking-normal text-ink">
              온라인 멘토링{'\n'}시작하기
            </Text>
          </Pressable>
        </View>

        <View className="mt-[14px] flex-row gap-2">
          {[
            ['내 카풀', '3'],
            ['예약', '1'],
            ['리뷰', '8'],
          ].map(([label, value]) => (
            <View
              key={label}
              className="flex-1 rounded-[12px] border border-line bg-card p-3"
            >
              <Text className="text-[11px] font-semibold tracking-normal text-muted">
                {label}
              </Text>
              <Text className="mt-[2px] text-[17px] font-black tracking-normal text-ink">
                {value}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-[14px] overflow-hidden rounded-[14px] border border-line bg-card px-[14px]">
          {menu.map(([label, right], index) => (
            <Pressable
              key={label}
              className={`flex-row items-center justify-between py-[14px] ${
                index < menu.length - 1 ? 'border-b border-line2' : ''
              }`}
              onPress={label === '구독 중인 멘토' ? onOpenMyLive : undefined}
            >
              <Text className="text-[14px] font-semibold tracking-normal text-ink2">
                {label}
              </Text>
              <Text className="text-[12px] tracking-normal text-muted2">
                {right ? `${right}  ›` : '›'}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNavigation
        active="my"
        onChange={tab => {
          if (tab === 'live') {
            onOpenLive();
          }
        }}
      />
    </Screen>
  );
}
