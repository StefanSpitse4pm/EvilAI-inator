import 'react-native-reanimated';
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return <Stack />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
