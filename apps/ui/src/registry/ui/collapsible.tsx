import React, { createContext, useCallback, useContext, useMemo } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Pressable,
  PressableProps,
  View,
  ViewProps,
} from 'react-native';
import Animated, {
  Easing,
  Keyframe,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';

import { useControllableState } from '@/registry/hooks/use-controllable-state';

const animConfig: WithTimingConfig = {
  duration: 200,
  easing: Easing.inOut(Easing.ease),
};

type CollapsibleContextType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
};

const CollapsibleContext = createContext<CollapsibleContextType | null>(null);

const useCollapsible = () => {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error('useCollapsible must be used within a <Collapsible />');
  }
  return ctx;
};

type CollapsibleProps = {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

function Collapsible({
  children,
  defaultOpen,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  disabled = false,
}: CollapsibleProps) {
  const [open, setOpen] = useControllableState({
    defaultValue: defaultOpen ?? false,
    controlledValue: openProp,
    onControlledChange: onOpenChangeProp,
  });

  const contextValue = useMemo<CollapsibleContextType>(
    () => ({
      open,
      onOpenChange: setOpen,
      disabled,
    }),
    [open, setOpen, disabled],
  );

  return (
    <CollapsibleContext value={contextValue}>{children}</CollapsibleContext>
  );
}

type CollapsibleStateProps = {
  children?:
    | React.ReactNode
    | ((ctx: CollapsibleContextType) => React.ReactNode);
};

function CollapsibleState({ children }: CollapsibleStateProps) {
  const ctx = useCollapsible();
  if (typeof children === 'function') {
    return children(ctx);
  }
  return children;
}

Collapsible.State = CollapsibleState;

type CollapsibleTriggerProps<T extends React.ElementType = typeof Pressable> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    ref?: React.Ref<View>;
  };

function CollapsibleTrigger<T extends React.ElementType<PressableProps>>({
  as,
  accessibilityState,
  disabled: disabledProp,
  onPress: onPressProp,
  ...restProps
}: CollapsibleTriggerProps<T>) {
  const { open, onOpenChange, disabled: rootDisabled } = useCollapsible();

  const disabled = rootDisabled ?? disabledProp;

  const onPress = useCallback(
    (e: GestureResponderEvent) => {
      onOpenChange(!open);
      onPressProp?.(e);
    },
    [onOpenChange, open, onPressProp],
  );

  const Comp = as ?? Pressable;

  return (
    <Comp
      accessibilityRole="button"
      accessibilityState={{
        ...accessibilityState,
        expanded: open,
        disabled,
      }}
      disabled={disabled}
      onPress={onPress}
      {...restProps}
    />
  );
}

Collapsible.Trigger = CollapsibleTrigger;

const exitAnim = new Keyframe({
  0: {
    opacity: 1,
  },
  100: {
    opacity: 1,
    easing: animConfig.easing,
  },
});

type CollapsibleContentProps = React.ComponentPropsWithRef<typeof View>;

function CollapsibleContent(props: CollapsibleContentProps) {
  const { open } = useCollapsible();

  const height = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: '100%',
      alignItems: 'center',
      height: withTiming(open ? height.value : 0, animConfig),
      overflow: 'hidden',
    };
  });

  const containerStyles: ViewProps['style'] = {
    position: 'absolute',
  };

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      height.value = e.nativeEvent.layout.height;
    },
    [height],
  );

  return (
    <Animated.View style={animatedStyles}>
      {open && (
        <Animated.View
          style={containerStyles}
          exiting={exitAnim.duration(animConfig.duration ?? 200)}
        >
          <View onLayout={onLayout} {...props} />
        </Animated.View>
      )}
    </Animated.View>
  );
}

Collapsible.Content = CollapsibleContent;

export { Collapsible, useCollapsible };
export type { CollapsibleProps };
