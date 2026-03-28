import { View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/registry/ui/text';

type Props = ViewProps & {
  title?: string;
};

function ComponentPreview({ children, title, style, ...props }: Props) {
  return (
    <View style={[styles.container, style]} {...props}>
      {title && (
        <View style={styles.header}>
          <Text variant="labelSm" color="mutedForeground">
            {title.slice(0, 1).toUpperCase() + title.slice(1)}
          </Text>
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    paddingHorizontal: theme.space.xl,
    paddingVertical: theme.space.xl,
    gap: theme.space.md,
    borderWidth: 1,
    borderColor: theme.colors.borderMinimal,
    borderRadius: theme.radius.lg,
    borderCurve: 'continuous',
    minHeight: 150,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: theme.space.md,
    rowGap: theme.space.xs,
  },
  metaDataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.xs,
  },
  content: {
    // alignItems: 'flex-start',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export { ComponentPreview };
