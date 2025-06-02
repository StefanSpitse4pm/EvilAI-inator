import { AppRegistry } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homescreen from './screens/homescreen'
import Chatbot from './screens/chatbot'
import Map from './screens/map'
import { Redirect } from "expo-router";

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
