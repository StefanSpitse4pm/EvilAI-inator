import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Map from "./app/screens/map";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Map />
    </GestureHandlerRootView>
  );
};

export default App;
