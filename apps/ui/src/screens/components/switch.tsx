import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';
import { Switch } from '@/registry/ui/switch';

export default function SwitchScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <ComponentPreview style={styles.componentPreview}>
          <Switch />
        </ComponentPreview>
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Card Style</Text>
        <ComponentPreview style={styles.componentPreview}>
          <Switch style={styles.switchCard}>
            <View style={styles.switchCardContent}>
              <Text variant="labelMd">Display total price</Text>
              <Text variant="bodySm" color="mutedForeground">
                Include all fees, before taxes
              </Text>
            </View>
            <Switch.Indicator />
          </Switch>
        </ComponentPreview>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create(({ space, colors, radius }) => ({
  group: {
    gap: space.xl,
  },
  componentPreview: {
    minHeight: 200,
  },
  switchCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
    padding: space.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
  },
  switchCardContent: {
    gap: space.xs,
  },
}));
