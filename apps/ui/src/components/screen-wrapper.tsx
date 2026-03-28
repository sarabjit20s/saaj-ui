import { ScrollView, ScrollViewProps } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

function ScreenWrapper({
  contentContainerStyle,
  style,
  ...props
}: ScrollViewProps) {
  return (
    <ScrollView
      contentContainerStyle={[styles.container, contentContainerStyle]}
      style={[styles.background, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flexGrow: 1,
    gap: theme.space['3xl'],
    padding: theme.space.xl,
  },
  background: {
    backgroundColor: theme.colors.background,
  },
}));

export { ScreenWrapper };
