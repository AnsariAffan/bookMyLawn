import * as React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack"; // Add this import
import {
  Provider as PaperProvider,
  Appbar,
  Button,
  Card,
  Text,
  Searchbar,
} from "react-native-paper";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import ImageSlider from "./ImageSlider";
import BookLawnFilter from "./BookLawnFilter";
import LownCards from "./LownCards";






const HomeScreen = ({route}) => {

    const navigation = useNavigation(); // Get the navigation object
  // Accept navigation as a prop
//   const headerImage = require("./assets/download (1).jpeg");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showSearchbar, setshowSearchbar] = React.useState();

  const showAndHideSearch = () => {
    // setshowSearchbar((prevState) => !prevState);
    // setshowSearchbar(true)
  };

  return (
    <TouchableWithoutFeedback onPress={showAndHideSearch}>
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: "#fff" }}
      stickyHeaderIndices={[0]}
    >
      <Appbar.Header>
        <Appbar.Content title="Book My Lawn" />
        <Appbar.Action
          icon="magnify"
          onPress={() => navigation.navigate("LawnSearch")}
        />
        <Appbar.Action
          icon="map-marker"
          onPress={() => navigation.navigate("UserLocation")} // Navigate to userLocation
        />
      </Appbar.Header>
      {showSearchbar && (
        <Searchbar
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={{ position: "absolute", top: 5, width: "100%" }}
        />
      )}
      
      <ImageSlider/>
    
      {/* <View style={styles.section}>
        <Card>
          <Card.Content>
            <Text>Exciting News!</Text>
            <Text>We're now part of the Zomato Fam! Know more </Text>
          </Card.Content>
        </Card>
      </View> */}

      <View style={styles.section}>
        <Text style={styles.header}>Book Lawn</Text>
        <BookLawnFilter />
        <LownCards />
      </View>
     
    </ScrollView>
  </TouchableWithoutFeedback>
  )
}
const styles = StyleSheet.create({
    button: {
      margin: 16,
    },
    section: {
      padding: 10,
    },
    header: {
      fontSize: 18,
      fontWeight: "bold",
    
    },
    horizontalScroll: {
      marginVertical: 16,
    },
    scrollButton: {
      marginHorizontal: 8,
    },
    cardRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 16,
    },
    card: {
      width: 150,
      height: 200,
    },
  });
  
export default HomeScreen