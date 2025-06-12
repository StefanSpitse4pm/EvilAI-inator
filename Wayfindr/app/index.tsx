import React, {use, useContext, useEffect, useState} from 'react';
import { Text, View } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homescreen from './screens/homescreen';
import Chatbot from './screens/chatbot'
import Login from './login';
import { ActivityIndicator } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
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

const AppStack = () => (
    <Tab.Navigator
    screenOptions={{
      headerShown:false,
    }}
    >
      <Tab.Screen name="Home" component={Homescreen}/>
      <Tab.Screen name="AI" component={Chatbot}/>
    </Tab.Navigator>
  
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
