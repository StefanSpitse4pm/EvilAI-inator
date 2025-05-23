import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{headerTitle:'Wayfindr',headerTitleAlign:'center', headerTitleStyle:{fontWeight:'bold', fontSize: 24}}}/>;
}