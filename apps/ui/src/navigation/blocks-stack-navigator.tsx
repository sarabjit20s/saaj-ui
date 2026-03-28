import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BlocksListScreen from '@/screens/blocks/blocks-list-screen';
import { BlocksStackParamList } from '@/types/navigation.types';

const Stack = createNativeStackNavigator<BlocksStackParamList>();

export default function BlocksStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BlocksList"
        component={BlocksListScreen}
        options={{ title: 'Blocks' }}
      />
    </Stack.Navigator>
  );
}
