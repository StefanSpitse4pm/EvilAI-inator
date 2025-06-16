import { AppRegistry } from 'react-native';
import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homescreen from './screens/homescreen';
import Chatbot from './screens/chatbot';
import Map from './screens/map';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Tab = createBottomTabNavigator()

export default function Index() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
        headerShown: false,
      }}
      >
        <Tab.Screen name="Home" component={Homescreen} />
        <Tab.Screen name="AI" component={Chatbot} />
        <Tab.Screen name="Map" component={Map} />
      </Tab.Navigator>
    </GestureHandlerRootView>
  );
}
