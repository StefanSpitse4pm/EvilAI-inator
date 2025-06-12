import { Stack } from "expo-router";
import { AuthProvidor } from '../context/AuthContext'
export default function RootLayout() {
  return (
    <AuthProvidor>
      <Stack screenOptions={{headerTitle:'Wayfindr',headerTitleAlign:'center', headerTitleStyle:{fontWeight:'bold', fontSize: 24}}}/>
    </AuthProvidor>
  )
}
