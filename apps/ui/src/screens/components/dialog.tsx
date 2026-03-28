import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { ComponentPreview } from '@/components/component-preview';
import { Dialog } from '@/registry/ui/dialog';
import { Button } from '@/registry/ui/button';
import { Text } from '@/registry/ui/text';
import { TextArea } from '@/registry/ui/text-area';

export default function DialogScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <Text variant="headlineXs">Default Dialog</Text>
        <DefaultDialogExample />
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Alert Dialog</Text>
        <AlertDialogExample />
      </View>
      <View style={styles.group}>
        <Text variant="headlineXs">Form Dialog</Text>
        <FormDialogExample />
      </View>
    </ScreenWrapper>
  );
}

function DefaultDialogExample() {
  return (
    <ComponentPreview style={styles.componentPreview}>
      <Dialog>
        <Dialog.Trigger as={Button} variant="secondary">
          <Button.Text>Allow Notifications</Button.Text>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>
              `Calendar` would like to send you notifications
            </Dialog.Title>
            <Dialog.Description>
              Notifications may include alerts, sounds, and icon badges. These
              can be configured in Settings.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close as={Button} variant="secondary" fill>
              <Button.Text>Don't Allow</Button.Text>
            </Dialog.Close>
            <Dialog.Close as={Button} variant="secondary" fill>
              <Button.Text>Allow</Button.Text>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </ComponentPreview>
  );
}

function AlertDialogExample() {
  return (
    <ComponentPreview style={styles.componentPreview}>
      <Dialog closeOnBackPress={false} closeOnOutsidePress={false}>
        <Dialog.Trigger as={Button} variant="destructiveSubtle">
          <Button.Text>Delete Account</Button.Text>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Delete Account?</Dialog.Title>
            <Dialog.Description>
              Deleting your account is permanent and cannot be undone.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Dialog.Close as={Button} variant="secondary" fill>
              <Button.Text>Cancel</Button.Text>
            </Dialog.Close>
            <Dialog.Close as={Button} variant="destructive" fill>
              <Button.Text>Delete</Button.Text>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </ComponentPreview>
  );
}

function FormDialogExample() {
  return (
    <ComponentPreview style={styles.componentPreview}>
      <Dialog>
        <Dialog.Trigger as={Button} variant="secondary">
          <Button.Text>Give feedback</Button.Text>
        </Dialog.Trigger>
        <Dialog.Content enableKeyboardAvoidingView>
          <Dialog.Header>
            <Dialog.Title>Help us improve!</Dialog.Title>
            <Dialog.Description>
              How would you describe your experience?
            </Dialog.Description>
          </Dialog.Header>
          <TextArea
            placeholder="Please share your thoughts"
            containerStyle={styles.feedbackInput}
          />
          <Dialog.Footer>
            <Dialog.Close as={Button} variant="secondary" fill>
              <Button.Text>Cancel</Button.Text>
            </Dialog.Close>
            <Dialog.Close as={Button} fill>
              <Button.Text>Submit</Button.Text>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </ComponentPreview>
  );
}

const styles = StyleSheet.create(theme => ({
  group: {
    gap: theme.space.xl,
  },
  componentPreview: {
    minHeight: 200,
  },
  feedbackInput: {
    marginBottom: theme.space.lg,
  },
}));
