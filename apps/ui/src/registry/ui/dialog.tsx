import React, {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
} from 'react';
import {
  GestureResponderEvent,
  Modal,
  Pressable,
  PressableProps,
  View,
} from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  Keyframe,
} from 'react-native-reanimated';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { Text, TextProps } from '@/registry/ui/text';
import { useControllableState } from '@/registry/hooks/use-controllable-state';
import { useComposedRefs } from '@/registry/utils/compose-refs';

type DialogContextType = {
  defaultOpen: boolean;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  closeOnOutsidePress: boolean;
  closeOnBackPress: boolean;
  triggerRef: React.RefObject<View | null>;
  titleId: string;
};

const DialogContext = createContext<DialogContextType | null>(null);

const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error('useDialog must be used within a <Dialog />');
  }
  return ctx;
};

type DialogProps = {
  children?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether to close the dialog when pressing outside(on overlay) of it.
   */
  closeOnOutsidePress?: boolean;
  /**
   * Whether to close the dialog when pressing the back button on Android.
   */
  closeOnBackPress?: boolean;
};

function Dialog({
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  closeOnOutsidePress = true,
  closeOnBackPress = true,
}: DialogProps) {
  const [open, setOpen] = useControllableState({
    defaultValue: defaultOpen,
    controlledValue: openProp,
    onControlledChange: onOpenChange,
  });

  const triggerRef = useRef<View | null>(null);
  const titleId = useId();

  const onOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const contextValue = useMemo<DialogContextType>(
    () => ({
      defaultOpen,
      open,
      onOpen,
      onClose,
      triggerRef,
      titleId,
      closeOnOutsidePress,
      closeOnBackPress,
    }),
    [
      closeOnBackPress,
      closeOnOutsidePress,
      defaultOpen,
      onClose,
      onOpen,
      open,
      titleId,
    ],
  );

  return <DialogContext value={contextValue}>{children}</DialogContext>;
}

type DialogTriggerProps<T extends React.ElementType = typeof Pressable> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    ref?: React.Ref<View>;
  };

function DialogTrigger<T extends React.ElementType<PressableProps>>({
  as,
  ref,
  accessibilityState,
  disabled,
  onPress: onPressProp,
  ...restProps
}: DialogTriggerProps<T>) {
  const { open, onOpen, triggerRef } = useDialog();

  const composedRefs = useComposedRefs(triggerRef, ref);

  const onPress = React.useCallback(
    (e: GestureResponderEvent) => {
      onOpen();
      onPressProp?.(e);
    },
    [onPressProp, onOpen],
  );

  const Comp = as ?? Pressable;

  return (
    <Comp
      ref={composedRefs}
      accessibilityRole="button"
      accessibilityState={{
        ...accessibilityState,
        expanded: open,
        disabled: !!disabled,
      }}
      disabled={disabled}
      onPress={onPress}
      {...restProps}
    />
  );
}

Dialog.Trigger = DialogTrigger;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const animConfig = {
  duration: 250,
  easing: Easing.inOut(Easing.ease),
} as const;

function DialogOverlay() {
  const { onClose, closeOnOutsidePress } = useDialog();

  return (
    <AnimatedPressable
      accessible={false}
      accessibilityElementsHidden={true}
      importantForAccessibility="no"
      disabled={!closeOnOutsidePress}
      entering={FadeIn.duration(animConfig.duration).easing(animConfig.easing)}
      exiting={FadeOut.duration(animConfig.duration).easing(animConfig.easing)}
      onPress={onClose}
      style={styles.overlay}
    />
  );
}

const entryAnim = new Keyframe({
  0: {
    opacity: 0,
    transform: [{ scale: 0.95 }],
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: animConfig.easing,
  },
});

const exitAnim = new Keyframe({
  0: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  100: {
    opacity: 0,
    transform: [{ scale: 0.95 }],
    easing: animConfig.easing,
  },
});

type DialogContentProps = React.ComponentPropsWithRef<typeof View> & {
  enableKeyboardAvoidingView?: boolean;
};

function DialogContent({
  enableKeyboardAvoidingView = false,
  style,
  ...restProps
}: DialogContentProps) {
  const { open, closeOnBackPress, titleId, onClose } = useDialog();

  const handleRequestClose = useCallback(() => {
    if (closeOnBackPress) {
      onClose();
    }
  }, [closeOnBackPress, onClose]);

  if (!open) {
    return;
  }

  return (
    <Modal
      visible={true}
      transparent={true}
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      animationType="none"
      accessibilityLabelledBy={titleId}
      onRequestClose={handleRequestClose}
    >
      <DialogOverlay />
      <View pointerEvents="box-none" style={styles.contentContainer}>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={24}
          enabled={enableKeyboardAvoidingView}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View
            entering={entryAnim.duration(animConfig.duration)}
            exiting={exitAnim.duration(animConfig.duration)}
            style={[styles.content, style]}
            {...restProps}
          />
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

Dialog.Content = DialogContent;

function DialogHeader({
  style,
  ...restProps
}: React.ComponentPropsWithRef<typeof View>) {
  return <View style={[styles.header, style]} {...restProps} />;
}

Dialog.Header = DialogHeader;

function DialogFooter({
  style,
  ...restProps
}: React.ComponentPropsWithRef<typeof View>) {
  return <View style={[styles.footer, style]} {...restProps} />;
}

Dialog.Footer = DialogFooter;

function DialogTitle(props: TextProps) {
  const { titleId } = useDialog();

  return <Text nativeID={titleId} variant="headlineXs" {...props} />;
}

Dialog.Title = DialogTitle;

function DialogDescription(props: TextProps) {
  return <Text color="mutedForeground" variant="bodyMd" {...props} />;
}

Dialog.Description = DialogDescription;

type DialogCloseProps<T extends React.ElementType = typeof Pressable> =
  React.ComponentPropsWithoutRef<T> & {
    as?: T;
    ref?: React.Ref<View>;
  };

function DialogClose<T extends React.ElementType<PressableProps>>({
  as,
  onPress: onPressProp,
  ...restProps
}: DialogCloseProps<T>) {
  const { onClose } = useDialog();

  const onPress = useCallback(
    (e: GestureResponderEvent) => {
      onClose();
      onPressProp?.(e);
    },
    [onPressProp, onClose],
  );

  const Comp = as ?? Pressable;

  return <Comp accessibilityRole="button" onPress={onPress} {...restProps} />;
}

Dialog.Close = DialogClose;

const styles = StyleSheet.create(({ colors, radius, space }, rt) => ({
  container: {
    flex: 1,
    width: rt.screen.width,
    height: rt.screen.height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  keyboardAvoidingView: {
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space['3xl'],
  },
  content: {
    maxHeight: rt.screen.height - rt.insets.top - rt.insets.bottom,
    maxWidth: 480,
    width: '100%',
    gap: space.lg,
    padding: space.xl,
    borderRadius: radius['2xl'],
    borderCurve: 'continuous',
    backgroundColor: colors.dialog,
    boxShadow: `0px 4px 24px 2px rgba(0, 0, 0, 0.1)`,
  },
  header: {
    gap: space.md,
    padding: space.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space.lg,
  },
}));

export { Dialog, useDialog };
export type { DialogProps };
