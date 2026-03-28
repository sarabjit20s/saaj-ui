import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ScreenWrapper } from '@/components/screen-wrapper';
import { Avatar, AvatarProps } from '@/registry/ui/avatar';
import { ComponentPreview } from '@/components/component-preview';
import { Text } from '@/registry/ui/text';

const sizes: AvatarProps['size'][] = ['xs', 'sm', 'md', 'lg'];

export default function AvatarScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.group}>
        <Text variant="headlineXs">Sizes</Text>
        {sizes.map(size => (
          <ComponentPreview key={size} title={size}>
            <Avatar size={size}>
              <Avatar.Image
                source={{
                  uri: 'https://pbs.twimg.com/profile_images/2029448992644579331/uEAuKmCQ_400x400.jpg',
                }}
              />
              <Avatar.Fallback>
                <Avatar.Icon name="user" />
              </Avatar.Fallback>
            </Avatar>
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
