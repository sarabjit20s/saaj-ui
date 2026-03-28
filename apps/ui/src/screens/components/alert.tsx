import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { Alert } from '@/registry/ui/alert';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';
import { Button } from '@/registry/ui/button';

export default function AlertScreen() {
  return (
    <ScreenWrapper>
      <Alert>
        <Alert.Icon name="clock" />
        <Alert.Content>
          <Alert.Title>No days available</Alert.Title>
          <Alert.Description>
            Days will appear here when more photos and videos are added to the
            library.
          </Alert.Description>
        </Alert.Content>
      </Alert>
      <View style={styles.group}>
        <Text variant="headlineXs">Variants</Text>
        <ComponentPreview title="primary">
          <Alert variant="primary">
            <Alert.Icon name="info" />
            <Alert.Title>We have a new release!</Alert.Title>
          </Alert>
        </ComponentPreview>
        <ComponentPreview title="secondary">
          <Alert variant="secondary">
            <Alert.Icon name="info" />
            <Alert.Title>We have a new release!</Alert.Title>
          </Alert>
        </ComponentPreview>
        <ComponentPreview title="success">
          <Alert variant="success">
            <Alert.Icon name="badge-check" />
            <Alert.Title>Payment successful</Alert.Title>
          </Alert>
        </ComponentPreview>
        <ComponentPreview title="destructive">
          <Alert variant="destructive">
            <Alert.Icon name="triangle-alert" />
            <Alert.Content>
              <Alert.Title>Payment failed</Alert.Title>
              <Alert.Description>
                Please try again, or contact support if the issue persists.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </ComponentPreview>
        <ComponentPreview title="outline">
          <Alert variant="outline">
            <Alert.Content>
              <Alert.Title>Big Deals</Alert.Title>
              <Alert.Description>
                Check out our big deals for this week.
              </Alert.Description>
              <View />
            </Alert.Content>
            <Button size="sm">
              <Button.Text>Shop Now</Button.Text>
            </Button>
          </Alert>
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
