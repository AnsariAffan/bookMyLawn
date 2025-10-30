import * as React from "react";

import NavigationManager from "./components/NavigationManager";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
 <GestureHandlerRootView style={{ flex: 1 }}>
   <NavigationManager />

 </GestureHandlerRootView>

  );
}

