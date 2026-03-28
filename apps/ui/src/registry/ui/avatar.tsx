import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Image, ImageErrorEvent, ImageLoadEvent, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Icon, IconProps } from '@/registry/ui/icon';
import { Text, TextProps } from '@/registry/ui/text';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg';
type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

type AvatarContextType = {
  size: AvatarSize;
  imageLoadingStatus: ImageLoadingStatus;
  setImageLoadingStatus: (status: ImageLoadingStatus) => void;
};

const AvatarContext = createContext<AvatarContextType | null>(null);

const useAvatar = () => {
  const ctx = useContext(AvatarContext);
  if (!ctx) {
    throw new Error('useAvatar must be used within a <Avatar />');
  }
  return ctx;
};

type AvatarProps = React.ComponentPropsWithRef<typeof View> & {
  size?: AvatarSize;
};

function Avatar({ size = 'md', style, ...restProps }: AvatarProps) {
  const [imageLoadingStatus, setImageLoadingStatus] =
    useState<ImageLoadingStatus>('idle');

  styles.useVariants({
    size,
  });

  const contextValue = useMemo<AvatarContextType>(
    () => ({
      size,
      imageLoadingStatus,
      setImageLoadingStatus,
    }),
    [size, imageLoadingStatus, setImageLoadingStatus],
  );

  return (
    <AvatarContext value={contextValue}>
      <View style={[styles.container, style]} {...restProps} />
    </AvatarContext>
  );
}

type AvatarImageProps = React.ComponentPropsWithRef<typeof Image>;

function AvatarImage({
  onLoad: onLoadProp,
  onError: onErrorProp,
  style,
  ...restProps
}: AvatarImageProps) {
  const { size, setImageLoadingStatus } = useAvatar();

  styles.useVariants({
    size,
  });

  useLayoutEffect(() => {
    setImageLoadingStatus('loading');

    return () => {
      setImageLoadingStatus('idle');
    };
  }, [setImageLoadingStatus]);

  const onLoad = useCallback(
    (e: ImageLoadEvent) => {
      setImageLoadingStatus('loaded');
      onLoadProp?.(e);
    },
    [onLoadProp, setImageLoadingStatus],
  );

  const onError = useCallback(
    (e: ImageErrorEvent) => {
      setImageLoadingStatus('error');
      onErrorProp?.(e);
    },
    [onErrorProp, setImageLoadingStatus],
  );

  return (
    <Image
      onLoad={onLoad}
      onError={onError}
      style={[styles.container, style]}
      {...restProps}
    />
  );
}

Avatar.Image = AvatarImage;

type AvatarFallbackProps = React.ComponentPropsWithRef<typeof View> & {
  delayMs?: number;
};

function AvatarFallback({ delayMs, style, ...restProps }: AvatarFallbackProps) {
  const { size, imageLoadingStatus } = useAvatar();

  styles.useVariants({
    size,
  });

  const [canRender, setCanRender] = useState(delayMs === undefined);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    if (delayMs !== undefined) {
      timerId = setTimeout(() => setCanRender(true), delayMs);
    }

    return () => clearTimeout(timerId);
  }, [delayMs]);

  return canRender && imageLoadingStatus !== 'loaded' ? (
    <View style={[styles.container, styles.fallback, style]} {...restProps} />
  ) : null;
}

Avatar.Fallback = AvatarFallback;

const textVariantMap: Record<AvatarSize, NonNullable<TextProps['variant']>> = {
  xs: 'labelXs',
  sm: 'labelSm',
  md: 'labelMd',
  lg: 'labelLg',
};

function AvatarText(props: TextProps) {
  const { size } = useAvatar();

  return <Text color="foreground" variant={textVariantMap[size]} {...props} />;
}

Avatar.Text = AvatarText;

const iconSizeMap: Record<AvatarSize, NonNullable<IconProps['size']>> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
};

function AvatarIcon(props: IconProps) {
  const { size } = useAvatar();

  return <Icon color="foreground" size={iconSizeMap[size]} {...props} />;
}

Avatar.Icon = AvatarIcon;

const styles = StyleSheet.create(({ colors, radius }) => ({
  container: {
    position: 'relative',
    borderRadius: radius.full,
    borderCurve: 'continuous',
    overflow: 'hidden',
    variants: {
      size: {
        xs: {
          width: 28,
          height: 28,
        },
        sm: {
          width: 36,
          height: 36,
        },
        md: {
          width: 48,
          height: 48,
        },
        lg: {
          width: 56,
          height: 56,
        },
      },
    },
  },
  fallback: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.muted,
  },
}));

export { Avatar, useAvatar };
export type { AvatarProps };
