import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, Text } from "react-native";

// Import Screens
import SplashScreen from "./SplashScreen";
import LoginScreen from "./LoginScreen";

import SuccessMessage from "./SuccessMessage";

import BookingDetails from "./BookingDetails";
import LawnOwnerDashboard from "./BookingCalenderprovier/LawnOwnerDashboard";
import { BookingListProvider } from "./BookingListContext/BookingListContext";
import { BookingProvider } from "./BookingCalenderprovier/BookingContext";
import BookingList from "./BookingListContext/BookingList";
// import { BillingProvider } from './BillingDetails/BillingContext';
import { AuthProvider } from "./Authprovider.js/AuthProvider";
import Settings from "./Settings";
import Dashboard from "./Dashboard";
import AboutContactUs from "./AboutContactUs";

// Dummy Components for other tabs
const TheatresScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Theatres Screen</Text>
  </View>
);

// Create Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={Dashboard} />
    <Stack.Screen name="SuccessMessage" component={SuccessMessage} />
    <Stack.Screen name="BookingList" component={BookingList} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="AboutContactUs" component={AboutContactUs} />
  </Stack.Navigator>
);

const LawnOwnerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, unmountOnBlur: true }}>
    <Stack.Screen
      name="LawnOwnerDashboard"
      component={LawnOwnerDashboard}
      options={{ title: "Dashboard", headerLeft: () => <View /> }}
    />
  </Stack.Navigator>
);

const MainApp = ({ route }) => {
  const isLawnOwner = route.params?.isLawnOwner;

  const getScreenComponent = (screenName) => {
    const screens = {
      Home: isLawnOwner ? Dashboard : HomeStack,
      Booking: isLawnOwner ? LawnOwnerStack : TheatresScreen,
      List: BookingList,
      Settings: Settings,
    };
    return screens[screenName] || View; // Default to View if no match
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Booking: "calendar",
            List: "notebook",
            Settings: "cog",
          };
          return (
            <Icon
              name={icons[route.name] || "circle"}
              color={color}
              size={size}
            />
          );
        },
      })}
      tabBarOptions={{ activeTintColor: "#00509E", inactiveTintColor: "gray" }}
    >
      {["Home", "Booking", "List", "Settings"].map((screenName) => (
        <Tab.Screen
          key={screenName}
          name={screenName}
          component={getScreenComponent(screenName)}
        />
      ))}
    </Tab.Navigator>
  );
};

export default function NavigationManager() {
  return (
    <PaperProvider>
      <AuthProvider>
        <NavigationContainer>
          <BookingListProvider>
            <BookingProvider>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="MainApp" component={MainApp} />
                <Stack.Screen
                  name="SuccessMessage"
                  component={SuccessMessage}
                />
                <Stack.Screen name="BookingList" component={BookingList} />
                <Stack.Screen
                  name="BookingDetails"
                  component={BookingDetails}
                />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen
                  name="AboutContactUs"
                  component={AboutContactUs}
                />
              </Stack.Navigator>
            </BookingProvider>
          </BookingListProvider>
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
