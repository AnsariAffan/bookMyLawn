import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

// Import Screens
import SplashScreen from "./SplashScreen";
import LoginScreen from "./LoginScreen";
import SuccessMessage from "./SuccessMessage";
import BookingDetails from "./BookingDetails";
import LawnOwnerDashboard from "./BookingCalenderprovier/LawnOwnerDashboard";
import { BookingListProvider } from "./BookingListContext/BookingListContext";
import { BookingProvider } from "./BookingCalenderprovier/BookingContext";
import BookingList from "./BookingListContext/BookingList";
import { AuthProvider } from "./Authprovider.js/AuthProvider";
import Settings from "./Settings";
import Dashboard from "./Dashboard";
import AboutContactUs from "./AboutContactUs";
import { BillingDataProvider } from "./utility/DataFilterOnDashboard/BillingDataContext";

// Dummy Components for other tabs
const TheatresScreen = () => (
  <View style={styles.screen}>
    <Text>Theatres Screen</Text>
  </View>
);

// Create Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false, // Show the header
      headerStyle: {
        backgroundColor: "#fff", // Background color of the header
        elevation: 5, // Shadow for Android
        shadowColor: "#000", // Shadow color for iOS
        shadowOffset: { width: 0, height: 2 }, // Horizontal and vertical offset of the shadow
        shadowOpacity: 0.25, // Opacity of the shadow
        shadowRadius: 5, // Radius of the shadow (how far it spreads)
      },
      headerTitleStyle: {
        fontWeight: "bold", // Optional, for customizing the header title
      },
    }}
  >
    <Stack.Screen
      name="Dashboard"
      component={Dashboard}
      options={{
        headerShown: false, // Ensure header is shown for this screen
        headerTitle: "Dashboard", // Set a title for the header
      }}
    />
    <Stack.Screen name="SuccessMessage" component={SuccessMessage} />
    <Stack.Screen name="BookingList" component={BookingList} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="AboutContactUs" component={AboutContactUs} />
    <Stack.Screen name="BookingDetails" component={BookingDetails} />
  </Stack.Navigator>
);

const LawnOwnerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, unmountOnBlur: true }}>
    <Stack.Screen
      name="LawnOwnerDashboard"
      component={LawnOwnerDashboard}
      headerShown={false}
      options={{
    
        headerStyle: {
          backgroundColor: "#fff", // Background color for header
          elevation: 5, // Shadow for Android
          shadowColor: "#000", // Shadow color for iOS
          shadowOffset: { width: 0, height: 2 }, // Vertical shadow offset
          shadowOpacity: 0.25, // Shadow opacity
          shadowRadius: 5, // Shadow spread radius
       
        },
      }}
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
        headerShown: false, // No header shown for bottom tab navigator
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
        tabBarStyle: {
          backgroundColor: "#fff", // White background
          position: "absolute", // Position tab bar at the bottom
          bottom: 0, // Stick to the bottom
          left: 0,
          right: 0,
          borderTopWidth: 0, // No border on top of the tab bar
          height: 65, // Height of the tab bar
          borderRadius: 35, // Rounded corners for the tab bar
          marginBottom: 10, // Floating effect with space at the bottom
          marginHorizontal: 15, // Horizontal margin for spacing
          elevation: 10, // Shadow for Android
          shadowColor: "#000", // Shadow color for iOS
          shadowOffset: { width: 0, height: 5 }, // Vertical offset of the shadow
          shadowOpacity: 0.3, // Opacity of the shadow
          shadowRadius: 10, // Radius of the shadow (how far it spreads)
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 10,
        },
        tabBarActiveTintColor: "#6200ee", // Active tab color
        tabBarInactiveTintColor: "#888888", // Inactive tab color
        tabBarIconStyle: {
          marginBottom: -5, // Space between icon and label
        },
      })}
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

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff", // White background
    text: "#000000", // Black text
    primary: "#6200ee", // Primary color
    accent: "#03dac4", // Accent color
  },
};

const blackTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#000000", // Black background
    text: "#ffffff", // White text
    primary: "#BB86FC", // Primary color
    accent: "#03DAC6", // Accent color
    surface: "#121212", // Surface color
    placeholder: "#888888", // Placeholder text color
    backdrop: "#000000", // Backdrop color
  },
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Screen background color
  },
});

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
                  <Stack.Screen name="Dashboard" component={Dashboard}  />
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
        </BillingDataProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
