import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';
import { Separator, SeparatorProps } from '@/registry/ui/separator';

const variants: SeparatorProps['variant'][] = [
  'hairline',
  'pixel',
  'cell',
  'section',
];

export default function SeparatorScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <ComponentPreview>
          <View style={styles.aboutContainer}>
            <Text>Saaj UI</Text>
            <Text color="mutedForeground">
              Styled, flexible, and accessible React Native components for your
              next project.
            </Text>
          </View>
          <Separator style={styles.middleSeparator} />
          <View style={styles.linksContainer}>
            <Text>Blog</Text>
            <Separator orientation="vertical" />
            <Text>Docs</Text>
            <Separator orientation="vertical" />
            <Text>Source</Text>
            <Separator orientation="vertical" />
            <Text>Releases</Text>
          </View>
        </ComponentPreview>
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Variants</Text>
        {variants.map(variant => (
          <ComponentPreview key={variant} title={variant}>
            <Separator variant={variant} />
          </ComponentPreview>
        ))}
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Orientation</Text>
        <ComponentPreview title="horizontal">
          <Separator orientation="horizontal" />
        </ComponentPreview>
        <ComponentPreview title="vertical">
          <Separator orientation="vertical" />
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
  aboutContainer: {
    gap: space.sm,
  },
  middleSeparator: {
    marginVertical: space.lg,
  },
  linksContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: space.md,
    justifyContent: 'space-evenly',
  },
}));
