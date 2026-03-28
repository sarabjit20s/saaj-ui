import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';
import { Collapsible } from '@/registry/ui/collapsible';
import { Button } from '@/registry/ui/button';

const recoveryKeys = ['4829-1735-6621', '9182-6407-5532', '3051-7924-9018'];

export default function CollapsibleScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <ComponentPreview style={styles.componentPreview}>
          <Collapsible>
            <Collapsible.Trigger as={Button} size="sm" variant="outline">
              <Button.Text>Show recovery keys</Button.Text>
              <Collapsible.State>
                {state => (
                  <Button.Icon
                    name={state.open ? 'chevron-up' : 'chevron-down'}
                  />
                )}
              </Collapsible.State>
            </Collapsible.Trigger>
            <Collapsible.Content style={styles.collapsibleContent}>
              {recoveryKeys.map(key => (
                <Text key={key} style={styles.keyItem}>
                  {key}
                </Text>
              ))}
            </Collapsible.Content>
          </Collapsible>
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
    minHeight: 300,
  },
  collapsibleContent: {
    paddingTop: theme.space.md,
    gap: theme.space.md,
  },
  keyItem: {
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    backgroundColor: theme.colors.muted,
  },
}));
