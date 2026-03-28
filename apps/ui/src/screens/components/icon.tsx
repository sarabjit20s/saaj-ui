import React from 'react';
import { StyleSheet } from 'react-native-unistyles';

import { Icon } from '@/registry/ui/icon';
import { ComponentPreview } from '@/components/component-preview';
import { ScreenWrapper } from '@/components/screen-wrapper';

export default function IconScreen() {
  return (
    <ScreenWrapper>
      <ComponentPreview>
        <Icon name="house" />
      </ComponentPreview>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create(theme => ({
  group: {
    gap: theme.space.xl,
  },
}));
