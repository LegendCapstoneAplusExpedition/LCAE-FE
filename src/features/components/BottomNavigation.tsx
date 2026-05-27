import React from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  IconHome,
  IconLive,
  IconMap,
  IconMessage,
  IconMy,
} from '../../design-system/icons';
import type { StatefulIconProps } from '../../design-system/icons';
import { ds } from '../../design-system/tokens';

export type BottomTabKey = 'home' | 'map' | 'live' | 'msg' | 'my';

const tabs: Array<{
  id: BottomTabKey;
  label: string;
  Icon: React.ComponentType<StatefulIconProps>;
}> = [
  { id: 'home', label: '홈', Icon: IconHome },
  { id: 'map', label: '지도', Icon: IconMap },
  { id: 'live', label: '라이브', Icon: IconLive },
  { id: 'msg', label: '메시지', Icon: IconMessage },
  { id: 'my', label: '마이', Icon: IconMy },
];

type Props = {
  active: BottomTabKey;
  onChange?: (tab: BottomTabKey) => void;
};

export function BottomNavigation({
  active,
  onChange,
}: Props): React.JSX.Element {
  return (
    <View className="flex-row border-t border-line bg-white pb-5 pt-4">
      {tabs.map(tab => {
        const selected = tab.id === active;
        const iconColor = selected ? ds.color.ink : ds.color.muted2;
        const Icon = tab.Icon;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="button"
            className="flex-1 items-center gap-[3px]"
            onPress={() => onChange?.(tab.id)}
          >
            <Icon active={selected} color={iconColor} />
            <Text
              className={`text-md tracking-normal ${
                selected ? 'font-black text-ink' : 'font-semibold text-muted2'
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
