import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';
import { Skeleton } from '@/registry/ui/skeleton';

export default function SkeletonScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <ComponentPreview>
          <View style={styles.profileSkeletonContainer}>
            <Skeleton width={60} height={60} radius="full" />
            <View style={styles.profileContent}>
              <Skeleton width={'60%'} radius="full" height={20} />
              <Skeleton width={'90%'} radius="full" height={20} />
            </View>
          </View>
        </ComponentPreview>
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">No animation</Text>
        <ComponentPreview>
          <View style={styles.profileSkeletonContainer}>
            <Skeleton width={60} height={60} radius="full" disableAnimation />
            <View style={styles.profileContent}>
              <Skeleton
                width={'60%'}
                height={20}
                radius="full"
                disableAnimation
              />
              <Skeleton
                width={'90%'}
                height={20}
                radius="full"
                disableAnimation
              />
            </View>
          </View>
        </ComponentPreview>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create(({ space }) => ({
  group: {
    gap: space.xl,
  },
  componentPreview: {
    minHeight: 200,
  },
  profileSkeletonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
  },
  profileContent: {
    flex: 1,
    gap: space.sm,
  },
}));
