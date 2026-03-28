import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';
import { Badge, BadgeProps } from '@/registry/ui/badge';

const variants: BadgeProps['variant'][] = [
  'primary',
  'secondary',
  'destructive',
  'success',
  'outline',
];

export default function BadgeScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <ComponentPreview>
          <Badge>
            <Badge.Text>Most Popular</Badge.Text>
          </Badge>
        </ComponentPreview>
        <Text variant="headlineXs">Variants</Text>
        {variants.map((variant, i) => (
          <ComponentPreview key={i} title={variant}>
            <Badge variant={variant}>
              <Badge.Icon name="badge-check" />
              <Badge.Text>Badge</Badge.Text>
            </Badge>
          </ComponentPreview>
        ))}
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Icon Only</Text>
        {variants.map((variant, i) => (
          <ComponentPreview key={i} title={variant}>
            <Badge variant={variant} iconOnly>
              <Badge.Icon name="badge-check" />
            </Badge>
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
