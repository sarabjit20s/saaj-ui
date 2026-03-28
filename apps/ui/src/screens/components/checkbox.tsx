import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';
import { Checkbox } from '@/registry/ui/checkbox';
import Animated from 'react-native-reanimated';

export default function CheckboxScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <ComponentPreview>
          <Checkbox>
            <Checkbox.Indicator />
            <Text variant="labelMd">I accept the terms and conditions</Text>
          </Checkbox>
        </ComponentPreview>
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Card Style</Text>
        <ComponentPreview style={styles.componentPreview}>
          <Checkbox>
            <Checkbox.State>
              {({ checked }) => (
                <Animated.View
                  style={[
                    styles.checkboxCard,
                    checked && styles.checkboxCardChecked,
                  ]}
                >
                  <Checkbox.Indicator />
                  <View style={styles.checkboxCardContent}>
                    <Text variant="labelMd">Enable notifications</Text>
                    <Text
                      variant="bodySm"
                      color="mutedForeground"
                      lineBreakStrategyIOS="standard"
                    >
                      You can always change this later in your settings
                    </Text>
                  </View>
                </Animated.View>
              )}
            </Checkbox.State>
          </Checkbox>
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
  checkboxCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.lg,
    padding: space.xl,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderCurve: 'continuous',
    backgroundColor: colors.transparent,
    transition: 'all 0.2s ease',
  },
  checkboxCardChecked: {
    borderColor: colors.borderPrimary,
    backgroundColor: colors.primaryMinimal,
  },
  checkboxCardContent: {
    gap: space.xs,
  },
}));
