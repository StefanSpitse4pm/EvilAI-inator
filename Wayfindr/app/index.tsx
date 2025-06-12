import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from '@expo/vector-icons';
import Homescreen from './screens/homescreen';
import Chatbot from './screens/chatbot';
import Notities from "./screens/Notities";
import SettingsScreen from './screens/Settings';
import { Image } from 'react-native';
import { ThemeProvider } from './Theme/ThemeContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
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
        component={Homescreen}
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
        component={Homescreen}
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
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </ThemeProvider>
  );
}
