import { useCallback } from 'react';
import { View } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { ScreenLayoutArgs } from '@react-navigation/native';
import { StyleSheet } from 'react-native-unistyles';

import { ComponentsStackParamList } from '@/types/navigation.types';
import ComponentsListScreen from '@/screens/components/components-list-screen';
import TextScreen from '@/screens/components/text';
import IconScreen from '@/screens/components/icon';
import AlertScreen from '@/screens/components/alert';
import ButtonScreen from '@/screens/components/button';
import { Button } from '@/registry/ui/button';
import { Text } from '@/registry/ui/text';
import BadgeScreen from '@/screens/components/badge';
import AvatarScreen from '@/screens/components/avatar';
import CheckboxScreen from '@/screens/components/checkbox';
import CollapsibleScreen from '@/screens/components/collapsible';
import DialogScreen from '@/screens/components/dialog';
import ProgressScreen from '@/screens/components/progress';
import TextAreaScreen from '@/screens/components/text-area';
import TextInputScreen from '@/screens/components/text-input';
import RadioGroupScreen from '@/screens/components/radio-group';
import SeparatorScreen from '@/screens/components/separator';
import SkeletonScreen from '@/screens/components/skeleton';
import SpinnerScreen from '@/screens/components/spinner';
import SwitchScreen from '@/screens/components/switch';
import CardScreen from '@/screens/components/card';

const Stack = createNativeStackNavigator<ComponentsStackParamList>();

export default function ComponentsStackNavigator() {
  const screenLayout = useCallback((props: any) => {
    return <ScreenLayout {...props} />;
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      screenLayout={screenLayout}
    >
      <Stack.Screen
        name="ComponentsList"
        component={ComponentsListScreen}
        options={{ title: 'Components' }}
      />
      <Stack.Screen
        name="Text"
        component={TextScreen}
        options={{ title: 'Text' }}
      />
      <Stack.Screen
        name="Icon"
        component={IconScreen}
        options={{ title: 'Icon' }}
      />
      <Stack.Screen
        name="Alert"
        component={AlertScreen}
        options={{ title: 'Alert' }}
      />
      <Stack.Screen
        name="Button"
        component={ButtonScreen}
        options={{ title: 'Button' }}
      />
      <Stack.Screen
        name="Badge"
        component={BadgeScreen}
        options={{ title: 'Badge' }}
      />
      <Stack.Screen
        name="Avatar"
        component={AvatarScreen}
        options={{ title: 'Avatar' }}
      />
      <Stack.Screen
        name="Checkbox"
        component={CheckboxScreen}
        options={{ title: 'Checkbox' }}
      />
      <Stack.Screen
        name="Collapsible"
        component={CollapsibleScreen}
        options={{ title: 'Collapsible' }}
      />
      <Stack.Screen
        name="Dialog"
        component={DialogScreen}
        options={{ title: 'Dialog' }}
      />
      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Stack.Screen
        name="TextArea"
        component={TextAreaScreen}
        options={{ title: 'TextArea' }}
      />
      <Stack.Screen
        name="TextInput"
        component={TextInputScreen}
        options={{ title: 'TextInput' }}
      />
      <Stack.Screen
        name="RadioGroup"
        component={RadioGroupScreen}
        options={{ title: 'RadioGroup' }}
      />
      <Stack.Screen
        name="Separator"
        component={SeparatorScreen}
        options={{ title: 'Separator' }}
      />
      <Stack.Screen
        name="Skeleton"
        component={SkeletonScreen}
        options={{ title: 'Skeleton' }}
      />
      <Stack.Screen
        name="Spinner"
        component={SpinnerScreen}
        options={{ title: 'Spinner' }}
      />
      <Stack.Screen
        name="Switch"
        component={SwitchScreen}
        options={{ title: 'Switch' }}
      />
      <Stack.Screen
        name="Card"
        component={CardScreen}
        options={{ title: 'Card' }}
      />
    </Stack.Navigator>
  );
}

type AnyComponentNavigationProp = {
  [K in keyof ComponentsStackParamList]: NativeStackNavigationProp<
    ComponentsStackParamList,
    K
  >;
}[keyof ComponentsStackParamList];

type ScreenLayoutProps = ScreenLayoutArgs<
  ComponentsStackParamList,
  keyof ComponentsStackParamList,
  NativeStackNavigationOptions,
  AnyComponentNavigationProp
>;

function ScreenLayout({ children, navigation, options }: ScreenLayoutProps) {
  const renderBackButton = navigation.canGoBack();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {renderBackButton && (
          <Button
            variant="secondary"
            size="sm"
            iconOnly
            onPress={navigation.goBack}
          >
            <Button.Icon name="arrow-left" />
          </Button>
        )}
        <Text variant="labelLg">{options.title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: rt.insets.top,
  },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.lg,
    paddingHorizontal: theme.space.xl,
  },
}));
