import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Spinner } from '@/registry/ui/spinner';
import { Button } from '@/registry/ui/button';
import { Text } from '@/registry/ui/text';

export default function SpinnerScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <ComponentPreview style={styles.componentPreview}>
          <Spinner />
        </ComponentPreview>
      </View>

      <View style={styles.group}>
        <Text variant="headlineXs">Spinner inside button</Text>
        <ComponentPreview>
          <Button disabled>
            <Spinner loading={true} color="primaryForeground" size={20} />
            <Button.Text>Submit</Button.Text>
          </Button>
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
}));
