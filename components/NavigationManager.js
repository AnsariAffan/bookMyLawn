import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

// Import Screens
import SplashScreen from "./SplashScreen";
import LoginScreen from "./LoginScreen";
import SuccessMessage from "./SuccessMessage";
import LawnOwnerDashboard from "./BookingCalenderprovier/LawnOwnerDashboard";
import { BookingListProvider } from "./BookingListContext/BookingListContext";
import { BookingProvider } from "./BookingCalenderprovier/BookingContext";
import BookingList from "./BookingListContext/BookingList";
import { AuthProvider } from "./Authprovider.js/AuthProvider";
import Settings from "./Settings";
import Dashboard from "./Dashboard";
import AboutContactUs from "./AboutContactUs";
import { BillingDataProvider } from "./utility/DataFilterOnDashboard/BillingDataContext";
import Billingdetail from "./BillingDetails/Billingdetail";
import BookingFormScreen from "./BookingCalenderprovier/BookingFormScreen";
import TabScreen from "./TabScreen";
import EditForm from "./editform/EditForm";

// Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
const MainApp = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const iconName = {
          Home: "home",
          Booking: "calendar",
          List: "notebook",
          Settings: "cog",
        }[route.name];
        return (
          <Icon
            name={iconName}
            size={focused ? 28 : 24}
            color={color}
          />
        );
      },
      tabBarStyle: {
        backgroundColor: "#FFFFFF",
        borderTopWidth: 0,
        height: 60,
        paddingBottom: 5,
        paddingTop: 5,
        borderRadius: 20,
        marginHorizontal: 10,
        marginBottom: 10,
        position: "absolute",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      tabBarActiveTintColor: "#34C759",
      tabBarInactiveTintColor: "#A0A0A0",
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "600",
        marginBottom: 5,
      },
    })}
  >
    <Tab.Screen name="Home" component={Dashboard} />
    <Tab.Screen name="Booking" component={LawnOwnerDashboard} />
    <Tab.Screen name="List" component={BookingList} />
    <Tab.Screen name="Settings" component={Settings} />
    

  </Tab.Navigator>
);

// Custom Theme
const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
    text: "#000000",
    primary: "#34C759",
    accent: "#3B82F6",
  },
};

export default function NavigationManager() {
  return (
    <PaperProvider theme={customTheme}>
      <AuthProvider>
        <BillingDataProvider>
          <NavigationContainer>
            <BookingListProvider>
              <BookingProvider>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Splash" component={SplashScreen} />
                  <Stack.Screen name="LoginScreen" component={LoginScreen} />
                  <Stack.Screen name="MainApp" component={MainApp} />
                  <Stack.Screen name="SuccessMessage" component={SuccessMessage} />
                  <Stack.Screen name="Billingdetails" component={Billingdetail} />
                  <Stack.Screen name="AboutContactUs" component={AboutContactUs} />
                  <Stack.Screen name="BookingFormScreen" component={BookingFormScreen} options={{ title: "Booking Form" }} />
                  <Stack.Screen name="TabScreen" component={TabScreen} />
                <Stack.Screen name="EditForm" component={EditForm} options={{ headerShown:true,title: "Booking" }} />

                  </Stack.Navigator>
              </BookingProvider>
            </BookingListProvider>
          </NavigationContainer>
        </BillingDataProvider>
      </AuthProvider>
    </PaperProvider>
  );
}