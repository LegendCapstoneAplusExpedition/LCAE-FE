import React from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  IconBoard,
  IconLiveStart,
  IconReplay,
} from '../../design-system/icons';
import { ds } from '../../design-system/tokens';

export type MentorConsoleTab = 'board' | 'live' | 'replay';

type Props = {
  active: MentorConsoleTab;
  onChange?: (tab: MentorConsoleTab) => void;
};

const items: {
  id: MentorConsoleTab;
  label: string;
  icon: (color: string) => React.ReactNode;
  accent?: boolean;
}[] = [
  {
    id: 'board',
    label: '게시판',
    icon: color => <IconBoard color={color} />,
  },
  {
    id: 'live',
    label: '라이브 시작',
    icon: color => <IconLiveStart color={color} size={22} />,
    accent: true,
  },
  {
    id: 'replay',
    label: '다시듣기',
    icon: color => <IconReplay color={color} />,
  },
];

export function MentorConsoleNavigation({
  active,
  onChange,
}: Props): React.JSX.Element {
  return (
    <View className="flex-row border-t border-line bg-white pb-5 pt-3">
      {items.map(item => {
        const isActive = active === item.id;
        const color = isActive
          ? item.accent
            ? ds.color.yellowDeep
            : ds.color.ink
          : ds.color.muted2;

        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            className="flex-1 items-center gap-1"
            onPress={() => onChange?.(item.id)}
          >
            <View className="relative h-md w-md items-center justify-center">
              {item.icon(color)}
            </View>
            <Text
              className={`text-md tracking-normal ${
                isActive ? 'font-black' : 'font-bold'
              }`}
              style={{ color }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
