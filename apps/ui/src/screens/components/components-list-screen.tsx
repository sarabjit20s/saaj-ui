import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ComponentsStackParamList } from '@/types/navigation.types';
import { List } from '@/components/list';
import { Icon } from '@/registry/ui/icon';

type Props = NativeStackScreenProps<ComponentsStackParamList, 'ComponentsList'>;

const components: (keyof ComponentsStackParamList)[] = [
  'Text',
  'Icon',
  'Alert',
  'Button',
  'Badge',
  'Avatar',
  'Checkbox',
  'Collapsible',
  'Dialog',
  'Progress',
  'TextArea',
  'TextInput',
  'RadioGroup',
  'Separator',
  'Skeleton',
  'Spinner',
  'Switch',
  'Card',
];

export default function ComponentsListScreen({ navigation }: Props) {
  const sorted = components.sort((a, b) => a.localeCompare(b));
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <List>
        <List.Section>
          {sorted.map((component, index) => (
            <List.Item
              key={component}
              onPress={() => navigation.navigate(component)}
              isLast={index === sorted.length - 1}
              startAddon={<Icon name="component" size={20} />}
              endAddon={
                <Icon name="chevron-right" color="mutedForeground" size={18} />
              }
            >
              <List.ItemTitle>{component}</List.ItemTitle>
            </List.Item>
          ))}
        </List.Section>
      </List>
    </ScrollView>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    gap: theme.space.md,
    paddingHorizontal: theme.space.xl,
    paddingBottom: theme.space.xl,
  },
  button: {
    justifyContent: 'space-between',
  },
}));
