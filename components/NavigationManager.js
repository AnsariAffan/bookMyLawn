import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, Text } from 'react-native';

// Import Screens
import UserLocation from "./UserLocation";
import LawnSearch from "./LawnSearch";
import LawnProfile from "./LawnProfile";
import BookingScreen from "./BookingScreen";
import SplashScreen from "./SplashScreen";
import HomeScreen from "./HomeScreen";
import LoginChoice from "./LoginChoice";
import LoginScreen from "./LoginScreen";
import LawnOwnerDashboard from "./LawnOwnerDashboard";
import Dashboard from "./Dashboard";
import SuccessMessage from "./SuccessMessage";
import SignInWithPhoneNumber from "./SignInwithPhoneNumber";
import BookingList from "./BookingList";
import BookingDetails from "./BookingDetails";

// Create Stack Navigator
const Stack = createStackNavigator();

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Stack Navigator for Home Screens
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UserLocation" component={UserLocation} />
      <Stack.Screen name="LawnSearch" component={LawnSearch} />
      <Stack.Screen name="Dashboard" component={Dashboard} />

      <Stack.Screen 
        name="LawnProfile" 
        component={LawnProfile} 
        options={{ title: 'Profile', headerShown: true }} 
      />
      <Stack.Screen 
        name="BookingScreen" 
        component={BookingScreen} 
        options={{ title: 'Booking', headerShown: true }} 
      />
    </Stack.Navigator>
  );
}


// Create a Stack Navigator for Lawn Owner Dashboard
const LawnOwnerStack = createStackNavigator();

// Create a Stack Navigator for LawnOwnerDashboard
function LawnOwnerStackNavigator() {
  return (
    <LawnOwnerStack.Navigator screenOptions={{ headerShown: false }}>
      <LawnOwnerStack.Screen 
        name="LawnOwnerDashboard" 
        component={LawnOwnerDashboard} 
        options={{ title: 'Dashboard',
          headerLeft: () => <View />,
         }} // Set the title or any other options here
     
        />
    </LawnOwnerStack.Navigator>
  );
}



// Main App Component with Tab Navigation
function MainApp({ route }) {
  const isLawnOwner = route.params?.isLawnOwner; // Check if the user is a Lawn Owner
const isEnduser = route.params?.phoneNumber;


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown:false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Theatres":
              iconName = "theater";
              break;
            case "Offers":
              iconName = "tag";
              break;
            default:
              iconName = "circle"; // Default icon if nothing matches
          }
          return <Icon name={iconName} color={color} size={size} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Home" component={isLawnOwner ? Dashboard : HomeStack}  />
      <Tab.Screen name="Theatres" component={isLawnOwner ? LawnOwnerStackNavigator :TheatresScreen} />
      <Tab.Screen name="Offers" component={BookingList} />
    </Tab.Navigator>
  );
}

// Main Navigation Manager
export default function NavigationManager() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="LoginChoice" component={LoginChoice} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="SuccessMessage" component={SuccessMessage} />
          <Stack.Screen name="SignInwithPhoneNumber" component={SignInWithPhoneNumber} />
          <Stack.Screen name="BookingList" component={BookingList} />
          <Stack.Screen name="BookingDetails" component={BookingDetails} />
          </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

// Dummy Components for other tabs
function TheatresScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Theatres Screen</Text>
    </View>
  );
}

function OffersScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Offers Screen</Text>
    </View>
  );
}
