import * as React from 'react';
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homescreen from './screens/homescreen'
import Chatbot from './screens/chatbot'
import Map from './screens/map'

const Tab = createBottomTabNavigator()

export default function Index() {
  return (
    <Tab.Navigator
    screenOptions={{
      headerShown:false,
    }}
    >
      <Tab.Screen name="Home" component={Homescreen}/>
      <Tab.Screen name="AI" component={Chatbot}/>
      <Tab.Screen name="Map" component={Map}/>
    </Tab.Navigator>
  );
}
