import { useCallback } from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import ComponentsStackNavigator from './components-stack-navigator';
import BlocksStackNavigator from './blocks-stack-navigator';
import { MainTabParamList } from '@/types/navigation.types';
import { Text } from '@/registry/ui/text';
import { Icon, IconProps } from '@/registry/ui/icon';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const tabBar = useCallback(
    (props: BottomTabBarProps) => <TabBar {...props} />,
    [],
  );

  return (
    <Tab.Navigator tabBar={tabBar} screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="ComponentsTab"
        component={ComponentsStackNavigator}
        options={{ title: 'Components' }}
      />
      <Tab.Screen
        name="BlocksTab"
        component={BlocksStackNavigator}
        options={{ title: 'Blocks' }}
      />
    </Tab.Navigator>
  );
}

const tabIcons: Record<keyof MainTabParamList, IconProps['name']> = {
  ComponentsTab: 'layers',
  BlocksTab: 'blocks',
};

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Pressable
            key={index}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarButton}
          >
            <Icon
              size={16}
              name={tabIcons[route.name as keyof MainTabParamList]}
              color={isFocused ? 'foreground' : 'mutedForeground'}
            />
            <Text
              variant="labelXs"
              color={isFocused ? 'foreground' : 'mutedForeground'}
            >
              {label.toString()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  tabBarButton: {
    paddingTop: theme.space.md,
    paddingBottom: rt.insets.bottom + theme.space.xs,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.xs,
  },
}));
