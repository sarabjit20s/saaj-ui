import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import Animated from 'react-native-reanimated';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';
import { RadioGroup } from '@/registry/ui/radio-group';

const languages = ['JavaScript', 'Rust', 'Python'];

export default function RadioGroupScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <ComponentPreview>
          <RadioGroup defaultValue="JavaScript">
            {languages.map(language => (
              <RadioGroup.Item key={language} value={language}>
                <RadioGroup.ItemIndicator />
                <Text>{language}</Text>
              </RadioGroup.Item>
            ))}
          </RadioGroup>
        </ComponentPreview>
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Card Style (Custom)</Text>
        <RadioGroup style={styles.radioGroup}>
          <RadioGroup.Item value="anyone">
            <RadioGroup.ItemState>
              {({ checked }) => (
                <Animated.View style={styles.radioCard(checked)}>
                  <View style={styles.radioCardContent}>
                    <Text variant="labelLg">Any Airbnb guest</Text>
                    <Text color="mutedForeground">
                      Get reservation faster when welcome anyone from the Airbnb
                      community
                    </Text>
                  </View>
                  <RadioGroup.ItemIndicator />
                </Animated.View>
              )}
            </RadioGroup.ItemState>
          </RadioGroup.Item>
          <RadioGroup.Item value="experienced">
            <RadioGroup.ItemState>
              {({ checked }) => (
                <Animated.View style={styles.radioCard(checked)}>
                  <View style={styles.radioCardContent}>
                    <Text variant="labelLg">An experienced guest</Text>
                    <Text color="mutedForeground">
                      For your first guest, welcome someone with a good track
                      record of Airbnb who can offer tips for how to be a great
                      host
                    </Text>
                  </View>
                  <RadioGroup.ItemIndicator />
                </Animated.View>
              )}
            </RadioGroup.ItemState>
          </RadioGroup.Item>
        </RadioGroup>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create(({ space, colors, radius }) => ({
  group: {
    gap: space.xl,
  },
  radioGroup: {
    gap: space.xl,
  },
  radioCard: (checked: boolean) => ({
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: checked ? colors.borderPrimary : colors.border,
    borderRadius: radius.md,
    borderCurve: 'continuous',
    backgroundColor: checked ? colors.primaryMinimal : colors.transparent,
    padding: space['2xl'],
    gap: space.xl,
    transition: 'all 0.2s ease',
  }),
  radioCardContent: {
    flexShrink: 1,
    gap: space.sm,
  },
}));
