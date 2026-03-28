import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';
import { TextInput, TextInputProps } from '@/registry/ui/text-input';
import { Icon } from '@/registry/ui/icon';
import { Button } from '@/registry/ui/button';

const sizes: TextInputProps['size'][] = ['sm', 'md', 'lg'];

export default function TextInputScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <Text variant="headlineXs">With Start Adornment</Text>
        <ComponentPreview style={styles.componentPreview}>
          <TextInput
            placeholder="Search"
            startAddon={
              <TextInput.Adornment>
                <Icon name="search" size={18} color="mutedForeground" />
              </TextInput.Adornment>
            }
          />
        </ComponentPreview>
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">With End Adornment</Text>
        <ComponentPreview style={styles.componentPreview}>
          <TextInput
            placeholder="https://google.com"
            defaultValue="https://google.com"
            endAddon={
              <Button
                variant="ghost"
                size="md"
                accessibilityLabel="Copy"
                iconOnly
              >
                <Button.Icon name="copy" />
              </Button>
            }
          />
        </ComponentPreview>
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Sizes</Text>
        {sizes.map(size => (
          <ComponentPreview
            key={size}
            title={size}
            style={styles.componentPreview}
          >
            <TextInput size={size} placeholder="Enter your text here" />
          </ComponentPreview>
        ))}
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Invalid</Text>
        <ComponentPreview style={styles.componentPreview}>
          <TextInput placeholder="Enter your text here" invalid />
        </ComponentPreview>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create(theme => ({
  group: {
    gap: theme.space.xl,
  },
  componentPreview: {
    minHeight: 200,
  },
}));
