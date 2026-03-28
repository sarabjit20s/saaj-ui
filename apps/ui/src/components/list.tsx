import {
  GestureResponderEvent,
  Pressable,
  View,
  ViewProps,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';
import { useAnimatedTheme } from 'react-native-unistyles/reanimated';

import { Text, TextProps } from '@/registry/ui/text';
import { Separator } from '@/registry/ui/separator';

type ListProps = ViewProps;

function List({ style, ...props }: ListProps) {
  return <View style={[styles.list, style]} {...props} />;
}

function ListSection({ style, ...props }: ViewProps) {
  return <View style={[styles.section, style]} {...props} />;
}

List.Section = ListSection;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ListItemProps = ViewProps & {
  onPress?: (e: GestureResponderEvent) => void;
  isLast?: boolean;
  startAddon?: React.ReactNode;
  endAddon?: React.ReactNode;
};

function ListItem({
  children,
  onPress,
  style,
  isLast,
  startAddon,
  endAddon,
  ...props
}: ListItemProps) {
  const animatedTheme = useAnimatedTheme();

  const pressed = useSharedValue(false);

  function handlePressIn() {
    pressed.value = true;
  }

  function handlePressOut() {
    pressed.value = false;
  }

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      pressed.value
        ? animatedTheme.value.colors.accent
        : animatedTheme.value.colors.transparent,
      {
        duration: 200,
      },
    ),
  }));

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={[styles.itemContainer, animatedStyle]}
    >
      <View style={[styles.item, style]} {...props}>
        {startAddon}
        <View style={styles.itemContent}>{children}</View>
        {endAddon}
      </View>
      {!isLast && <Separator style={styles.separator(!!startAddon)} />}
    </AnimatedPressable>
  );
}

List.Item = ListItem;

function ListItemTitle(props: TextProps) {
  return <Text variant="labelMd" {...props} />;
}

List.ItemTitle = ListItemTitle;

function ListItemDescription(props: TextProps) {
  return <Text variant="bodySm" color="mutedForeground" {...props} />;
}

List.ItemDescription = ListItemDescription;

const styles = StyleSheet.create(({ space, colors, radius }) => ({
  list: {
    gap: space.xl,
  },
  section: {
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  itemContainer: {
    paddingHorizontal: space.xl,
  },
  item: {
    flexDirection: 'row',
    gap: space.xl,
    alignItems: 'center',
    paddingVertical: space.xl,
  },
  itemContent: {
    flex: 1,
    gap: space.xs,
  },
  separator: (startAddon: boolean) => ({
    width: 'auto',
    marginLeft: startAddon ? space.xl + space.xl : 0, // item's gap + paddingHorizontal
  }),
}));

export { List };
