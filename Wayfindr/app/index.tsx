import * as React from 'react';
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Homescreen from './screens/homescreen';
import Chatbot from './screens/chatbot';
import Notities from './screens/Notities';
import SlideMenu from './screens/sidemenu';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={Homescreen} />
      <Tab.Screen name="AI" component={Chatbot} />
      <Tab.Screen name="Notities" component={Notities} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
      <Drawer.Navigator
        drawerContent={props => (
          <SlideMenu
            {...props}
            isVisible={true}
            onClose={() => props.navigation.closeDrawer()}
          />
        )}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Tabs" component={Tabs} />
      </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  }
});