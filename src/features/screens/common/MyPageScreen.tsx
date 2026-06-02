import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { BottomNavigation } from '../../components/BottomNavigation';
import { MentoLogo } from '../../../design-system/components/MentoLogo';
import { Screen } from '../../../design-system/components/Primitives';
import { myPageMenu, myPageProfile, myPageStats } from '../../mocks';

type AuthUser = { id: string; username: string };

type Props = {
  authUser?: AuthUser | null;
  onOpenLive: () => void;
  onOpenLogin: () => void;
  onOpenMentorConsole: () => void;
  onOpenMyLive: () => void;
};

export function MyPageScreen({
  authUser,
  onOpenLive,
  onOpenLogin,
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
          <MentoLogo label={myPageProfile.roleLabel} size={56} />
          <View className="flex-1">
            {authUser ? (
              <>
                <Text className="text-[16px] font-black tracking-normal text-ink">
                  {authUser.username}
                </Text>
                <Text className="mt-[2px] text-[11.5px] tracking-normal text-muted">
                  {myPageProfile.editLabel}
                </Text>
              </>
            ) : (
              <Pressable onPress={onOpenLogin}>
                <Text className="text-[15px] font-black tracking-normal text-yellowDeep">
                  로그인 / 회원가입
                </Text>
                <Text className="mt-[2px] text-[11.5px] tracking-normal text-muted">
                  로그인 후 더 많은 기능을 이용하세요
                </Text>
              </Pressable>
            )}
          </View>
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
          {myPageStats.map(stat => (
            <View
              key={stat.label}
              className="flex-1 rounded-[12px] border border-line bg-card p-3"
            >
              <Text className="text-[11px] font-semibold tracking-normal text-muted">
                {stat.label}
              </Text>
              <Text className="mt-[2px] text-[17px] font-black tracking-normal text-ink">
                {stat.value}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-[14px] overflow-hidden rounded-[14px] border border-line bg-card px-[14px]">
          {myPageMenu.map((item, index) => (
            <Pressable
              key={item.label}
              className={`flex-row items-center justify-between py-[14px] ${
                index < myPageMenu.length - 1 ? 'border-b border-line2' : ''
              }`}
              onPress={
                item.label === '구독 중인 멘토' ? onOpenMyLive : undefined
              }
            >
              <Text className="text-[14px] font-semibold tracking-normal text-ink2">
                {item.label}
              </Text>
              <Text className="text-[12px] tracking-normal text-muted2">
                {item.right ? `${item.right}  ›` : '›'}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNavigation
        active="my"
        onChange={tab => {
          if (tab === 'home') {
            onOpenLogin();
          } else if (tab === 'live') {
            onOpenLive();
          }
        }}
      />
    </Screen>
  );
}
