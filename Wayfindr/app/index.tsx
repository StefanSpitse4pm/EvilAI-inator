import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homescreen from './screens/homescreen'
import Chatbot from './screens/chatbot'

const Tab = createBottomTabNavigator()

export default function Index() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={Homescreen} />
      <Tab.Screen name="AI" component={Chatbot} />
    </Tab.Navigator>
  );
}