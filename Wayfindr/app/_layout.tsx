import 'react-native-reanimated';
import { Stack } from "expo-router";
import { AuthProvidor } from '../context/AuthContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <AuthProvidor>
      <Stack screenOptions={{headerTitle:'Wayfindr',headerTitleAlign:'center', headerTitleStyle:{fontWeight:'bold', fontSize: 24}}}/>
    </AuthProvidor>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
