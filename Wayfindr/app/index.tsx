import React, {use, useContext, useEffect, useState} from 'react';
import { Text, View } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import Homescreen from './screens/homescreen';
import Chatbot from './screens/chatbot'
import Login from './login';
import { ActivityIndicator } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import Notities from "./screens/Notities";
import { Image } from 'react-native';
import Map from './screens/map';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Agenda from './screens/agenda'; 
import SettingsScreen from './screens/Settings';
import AccountPage from './screens/accountpage';
const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator(); 

const AuthStack = () => (
  <Stack.Navigator
  screenOptions={{
    headerShown:false,
  }}
  >
    <Stack.Screen name="login" component={Login}/>
  </Stack.Navigator>
)

const tabStack = () => (
    <GestureHandlerRootView style={{flex: 1}}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Home"
          component={Homescreen}
          options={{
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Map"
          component={Map}
          options={{
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AI"
          component={Chatbot}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('../assets/images/aipic.png')}
                style={{ width: size + 8, height: size + 8 }}
                resizeMode="contain"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Agenda"
          component={Agenda}
          options={{
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Notities"
          component={Notities}
          options={{
            tabBarIcon: ({ color, size }: { color: string; size: number }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </GestureHandlerRootView>
)

const AppStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="tabs" component={tabStack} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="account" component={AccountPage} />
  </Stack.Navigator>
)

export default function Index() {
  const { isAuthenticated } = useContext(AuthContext)   
  console.log(isAuthenticated);  
  if (isAuthenticated === null) {
    return(
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View> 
    )}
  else if (isAuthenticated) {
    return <AppStack/>
  } else {
    return (
    <AuthStack/>
  )}
}