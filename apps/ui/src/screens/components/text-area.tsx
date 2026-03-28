import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';
import { TextArea, TextAreaProps } from '@/registry/ui/text-area';

const sizes: TextAreaProps['size'][] = ['sm', 'md', 'lg'];

export default function TextAreaScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <Text variant="headlineXs">Sizes</Text>
        {sizes.map(size => (
          <ComponentPreview key={size} title={size}>
            <TextArea size={size} placeholder="Enter your text here" />
          </ComponentPreview>
        ))}
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Invalid</Text>
        <ComponentPreview>
          <TextArea placeholder="Enter your text here" invalid />
        </ComponentPreview>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create(theme => ({
  group: {
    gap: theme.space.xl,
  },
}));
