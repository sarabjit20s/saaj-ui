import { NavigationContainer } from '@react-navigation/native';

import MainTabNavigator from './main-tab-navigator';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainTabNavigator />
    </NavigationContainer>
  );
}
