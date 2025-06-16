import 'react-native-reanimated';
import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { toast } from 'sonner-native';

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerTitle:'Wayfindr',headerTitleAlign:'center', headerTitleStyle:{fontWeight:'bold', fontSize: 24}}}/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
