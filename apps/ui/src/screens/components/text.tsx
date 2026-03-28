import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { Text } from '@/registry/ui/text';
import { typography, TextVariants } from '@/styles/tokens/typography';
import { ComponentPreview } from '@/components/component-preview';

const textVariants = Object.keys(typography.variants) as (keyof TextVariants)[];

export default function TextScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <Text variant="headlineXs">Variants</Text>
        {textVariants.map(variant => (
          <ComponentPreview key={variant} title={variant}>
            <Text variant={variant}>
              The quick brown fox jumps over the lazy dog.
            </Text>
          </ComponentPreview>
        ))}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create(theme => ({
  group: {
    gap: theme.space.xl,
  },
}));
