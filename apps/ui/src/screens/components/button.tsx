import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { Button, ButtonProps } from '@/registry/ui/button';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';

const sizes: ButtonProps['size'][] = ['xs', 'sm', 'md', 'lg'];

export default function ButtonScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <Text variant="headlineXs">Variants</Text>
        <ComponentPreview title="primary">
          <Button variant="primary">
            <Button.Text>Continue</Button.Text>
          </Button>
        </ComponentPreview>
        <ComponentPreview title="secondary">
          <Button variant="secondary">
            <Button.Text>Continue</Button.Text>
          </Button>
        </ComponentPreview>
        <ComponentPreview title="destructive">
          <Button variant="destructive">
            <Button.Text>Delete</Button.Text>
          </Button>
        </ComponentPreview>
        <ComponentPreview title="destructiveSubtle">
          <Button variant="destructiveSubtle">
            <Button.Text>Delete</Button.Text>
          </Button>
        </ComponentPreview>
        <ComponentPreview title="outline">
          <Button variant="outline">
            <Button.Text>Outline</Button.Text>
          </Button>
        </ComponentPreview>
        <ComponentPreview title="ghost">
          <Button variant="ghost">
            <Button.Text>Ghost</Button.Text>
          </Button>
        </ComponentPreview>
        <ComponentPreview title="link">
          <Button variant="link">
            <Button.Text>Link</Button.Text>
          </Button>
        </ComponentPreview>
      </View>

      <View style={styles.group}>
        <Text variant="headlineXs">Sizes</Text>
        {sizes.map(size => (
          <ComponentPreview key={size} title={size}>
            <Button size={size}>
              <Button.Icon name="download" />
              <Button.Text>Download</Button.Text>
            </Button>
          </ComponentPreview>
        ))}
      </View>

      <View style={styles.group}>
        <Text variant="headlineXs">Full Width</Text>
        {sizes.map(size => (
          <ComponentPreview key={size} title={size}>
            <Button size={size} fill>
              <Button.Text>Continue</Button.Text>
            </Button>
          </ComponentPreview>
        ))}
      </View>

      <View style={styles.group}>
        <Text variant="headlineXs">Icon Only</Text>
        {sizes.map(size => (
          <ComponentPreview key={size} title={size}>
            <Button size={size} iconOnly>
              <Button.Icon name="plus" />
            </Button>
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
