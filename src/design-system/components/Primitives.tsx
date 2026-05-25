import React from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { IconChevronLeft, IconSearch, IconSend } from '../icons';
import { ds, Tone } from '../tokens';

export function Screen({
  children,
}: React.PropsWithChildren): React.JSX.Element {
  return <View className="flex-1 bg-bg">{children}</View>;
}

export function Header({
  title,
  onBack,
  right,
}: {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}): React.JSX.Element {
  return (
    <View className="h-12 flex-row items-center justify-between px-4">
      <BackButton onPress={onBack} />
      {title ? (
        <Text className="text-[13px] font-extrabold tracking-normal text-muted">
          {title}
        </Text>
      ) : (
        <View />
      )}
      {right ?? <View className="w-8" />}
    </View>
  );
}

export function BackButton({
  onPress,
}: {
  onPress?: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      className="h-8 w-8 items-center justify-center"
      onPress={onPress}
    >
      <IconChevronLeft />
    </Pressable>
  );
}

export function IconButton({
  children,
  onPress,
}: React.PropsWithChildren<{ onPress?: () => void }>): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      className="h-8 w-8 items-center justify-center rounded-lg active:bg-chip"
      onPress={onPress}
    >
      <Text className="text-[18px] font-black text-ink">{children}</Text>
    </Pressable>
  );
}

export function LiveDot({ size = 6 }: { size?: number }): React.JSX.Element {
  return (
    <View
      className="mr-[5px] bg-yellowDeep"
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
}

export function LiveBadge({
  children = 'Live',
  dark = false,
}: {
  children?: string;
  dark?: boolean;
}): React.JSX.Element {
  return (
    <View className="flex-row items-center">
      <LiveDot />
      <Text
        className={`text-[13px] font-extrabold tracking-normal ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {children}
      </Text>
    </View>
  );
}

export function Chip({
  children,
  active = false,
  small = false,
}: {
  children: string;
  active?: boolean;
  small?: boolean;
}): React.JSX.Element {
  return (
    <View
      className={`${
        small ? 'px-[10px] py-[5px]' : 'px-[14px] py-[7px]'
      } rounded-full ${active ? 'bg-ink' : 'bg-chip'}`}
    >
      <Text
        className={`${
          small ? 'text-[12px]' : 'text-[13px]'
        } font-bold tracking-normal ${active ? 'text-white' : 'text-muted'}`}
      >
        {children}
      </Text>
    </View>
  );
}

export function ChipRow({
  items,
  activeIndex = 0,
}: {
  items: string[];
  activeIndex?: number;
}): React.JSX.Element {
  return (
    <ScrollView
      horizontal
      contentContainerClassName="gap-[6px]"
      showsHorizontalScrollIndicator={false}
    >
      {items.map((item, index) => (
        <Chip key={item} active={index === activeIndex}>
          {item}
        </Chip>
      ))}
    </ScrollView>
  );
}

export function Tag({
  children,
  tone = 'neutral',
}: {
  children: string;
  tone?: 'neutral' | 'dark' | 'yellow' | 'line';
}): React.JSX.Element {
  const className = {
    neutral: 'bg-chip text-muted',
    dark: 'bg-ink text-white',
    yellow: 'bg-yellowSoft text-[#7A5B00]',
    line: 'border border-line bg-white text-muted',
  }[tone];

  return (
    <View className={`rounded-[4px] px-[7px] py-[3px] ${className}`}>
      <Text
        className={`text-[10.5px] font-extrabold tracking-normal ${
          tone === 'dark'
            ? 'text-white'
            : tone === 'yellow'
            ? 'text-[#7A5B00]'
            : 'text-muted'
        }`}
      >
        {children}
      </Text>
    </View>
  );
}

export function Card({
  children,
  onPress,
  highlight = false,
}: React.PropsWithChildren<{
  onPress?: () => void;
  highlight?: boolean;
}>): React.JSX.Element {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      accessibilityRole={onPress ? 'button' : undefined}
      className={`rounded-[18px] border bg-card active:bg-chip ${
        highlight ? 'border-yellow' : 'border-line'
      }`}
      onPress={onPress}
    >
      {children}
    </Wrapper>
  );
}

type SearchPillProps = TextInputProps & {
  showIcon?: boolean;
};

export function SearchPill({
  showIcon = true,
  ...props
}: SearchPillProps): React.JSX.Element {
  return (
    <View className="h-[42px] flex-row items-center gap-2 rounded-full bg-chip px-4">
      {showIcon ? <IconSearch color={ds.color.muted} /> : null}
      <TextInput
        className="flex-1 p-0 text-[13px] font-semibold tracking-normal text-ink"
        placeholderTextColor={ds.color.muted2}
        {...props}
      />
    </View>
  );
}

export function PrimaryButton({
  children,
  onPress,
  tone = 'dark',
  size = 'regular',
}: {
  children: string;
  onPress?: () => void;
  tone?: Tone;
  size?: 'regular' | 'small' | 'circle';
}): React.JSX.Element {
  const buttonTone = {
    dark: 'bg-ink',
    yellow: 'bg-yellow',
    light: 'border border-line bg-white',
  }[tone];
  const textTone = tone === 'dark' ? 'text-white' : 'text-ink';
  const sizing =
    size === 'small'
      ? 'h-9 px-3 rounded-[10px]'
      : size === 'circle'
      ? 'h-[72px] w-[72px] rounded-full'
      : 'h-12 px-[18px] rounded-[12px]';

  return (
    <Pressable
      accessibilityRole="button"
      className={`${sizing} items-center justify-center ${buttonTone}`}
      onPress={onPress}
    >
      <Text
        className={`${
          size === 'small' ? 'text-[12px]' : 'text-[14px]'
        } font-black tracking-normal ${textTone}`}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export function FieldLabel({
  children,
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <Text className="mb-2 text-[11px] font-black tracking-normal text-muted">
      {children}
    </Text>
  );
}

export function RowDivider(): React.JSX.Element {
  return <View className="h-px bg-line2" />;
}

export function SendButton({
  onPress,
}: {
  onPress?: () => void;
}): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      className="h-12 w-12 bg-yellow items-center justify-center rounded-3xl active:bg-chip"
      onPress={onPress}
    >
      <IconSend color={ds.color.ink} />
    </Pressable>
  );
}
