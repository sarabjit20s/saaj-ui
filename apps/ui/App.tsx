import '@/styles/unistyles';
import AppNavigator from '@/navigation/app-navigator';
import { KeyboardProvider } from 'react-native-keyboard-controller';

export default function App() {
  return (
    <KeyboardProvider>
      <AppNavigator />
    </KeyboardProvider>
  );
}
