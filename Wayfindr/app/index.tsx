import * as React from 'react';
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homescreen from './screens/homescreen';
import Chatbot from './screens/chatbot'
import { Image } from 'react-native'

const Tab = createBottomTabNavigator()

export default function Index() {
  return (
    <Tab.Navigator
    screenOptions={{
      headerShown:false,
    }}
    >
      <Tab.Screen 
  name="Home" 
  component={Homescreen} 
  options={{
    tabBarIcon: ({ focused, color, size }) => (
      <Image 
        source={require('../assets/images/House.png')} 
        style={{ width: size, height: size, tintColor: color }} 
      />
    ),
  }}
/>
      <Tab.Screen 
  name="AI" 
  component={Chatbot} 
  options={{
    tabBarIcon: ({ focused, color, size }) => (
      <Image 
        source={require('../assets/images/ChatBotLogo.png')} 
        style={{ width: size, height: size, tintColor: color }} 
      />
    ),
  }}
/>
    </Tab.Navigator>
  );
}
