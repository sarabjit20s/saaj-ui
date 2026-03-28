import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { BlocksStackParamList } from '@/types/navigation.types';

type Props = NativeStackScreenProps<BlocksStackParamList, 'BlocksList'>;

export default function BlocksListScreen({}: Props) {
  return (
    <View style={styles.container}>
      <Text>🧱 Blocks List Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
