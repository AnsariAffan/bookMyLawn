import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Appbar } from "react-native-paper";
import { readDocuments } from "../firebaseConfiguration/crudForBooking"; // Ensure this function listens for changes
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // or any other icon set
import { TouchableOpacity } from "react-native";

// Define a list of standard colors
const standardColors = [
  // "#FF5733", // Red
  // "#33FF57", // Green
  "#00509E", // Blue
  // "#FF33A1", // Pink
  // "#FFB833", // Orange
  // "#33FFF2", // Cyan
  // "#B833FF", // Purple
  // "#FFC300", // Yellow
];

const BookingList = ({ route, navigation }) => {
  const [search, setSearch] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [hotels, setHotels] = useState([]); // State to store fetched hotels
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true); // Start loading
        const fetchedHotels = await readDocuments("bookings"); // Call your readDocuments function
        setHotels(fetchedHotels);
        setFilteredHotels(fetchedHotels); // Initialize filtered hotels with fetched data
      } catch (error) {
        console.error("Error fetching bookings: ", error);
        window.alert("Error fetching bookings: ", error)
      } finally {
        setLoading(false); // End loading
      }
    };

    const unsubscribe = fetchBookings(); // Subscribe to real-time updates
    return () => unsubscribe(); // Clean up on unmount
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredHotels(filtered);
  };

  const renderHotelItem = ({ item }) => {
    // Array of month names
    const monthCollection = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    // Randomly select a color from the standard colors
    const cardColor = standardColors[Math.floor(Math.random() * standardColors.length)];
    // Randomly select a color from the standard colors

    // Extract the month index from the date
    const monthIndex = parseInt(item.dates[0].split("-")[1], 10);

    // Get the month name from monthCollection
    const monthName = monthCollection[monthIndex - 1]; // Adjust for zero-based index
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("BookingDetails")}
      >
        <View style={[styles.hotelCard, { backgroundColor: cardColor }]}>

        <View style={{display:"flex",flexDirection:"column"}}>
        <Text
            style={{
              fontSize: 50,
              fontWeight: "bold",
              color: "black",
              marginRight: 20,
              marginTop: 5,
              color: "#ffff",
            }}
          >
            {item.dates[0].split("-")[2]}
          </Text>
          <Text style={{color:"#ffff",fontWeight:300}}>{monthName}</Text>
        </View>
          

          <View style={styles.hotelInfo}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.hotelName}>{item.name}</Text>
              <Text style={styles.bookingStatus}>{item.paymentStatus}</Text>
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ display: "flex", flexDirection: "row", paddingTop: 5 }}
              >
                <Icon name="map-marker" size={25} color="#ffff" />
                <Text style={styles.hotelLocation}>{item.address}</Text>
              </View>
              <Text style={styles.hotelPrice}>${item.additionalAmount}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00509E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#00509E" }}>
        <Appbar.BackAction
          style={{ color: "#ffffff" }}
          onPress={() => navigation.goBack()}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#ffff" }}>
          Bookings
        </Text>
      </Appbar.Header>
      <View style={styles.containerTwo}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Hotels"
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      <View style={styles.containerThree}>
        <FlatList
          data={filteredHotels} // Use filteredHotels here
          renderItem={renderHotelItem}
          keyExtractor={(item) => item.id}
          style={styles.hotelList}
        />
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00509E",
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  containerTwo: {
    backgroundColor: "#00509E",
  },
  containerThree: {
    flex: 1,
    padding: 15,
    backgroundColor: "#ffff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  searchBar: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginLeft: 20,
    marginRight: 20,
  },
  hotelList: {
    width: "100%",
  },
  hotelCard: {
    flexDirection: "row",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  hotelInfo: {
    flex: 1,
    justifyContent: "center",
  },
  hotelName: {
    fontSize: 18,
    marginBottom: 5,
    color: "#ffff",
    marginTop: -5,
    fontWeight: "bold",
  },
  hotelLocation: {
    fontSize: 14,
    color: "#ffff",
    paddingTop: 5,
  },
  contact: {
    fontSize: 16,
    color: "#ffff",
    paddingLeft: 3,
    paddingTop: 5,
  },
  hotelPrice: {
    color: "#ffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  bookingStatus: {
    fontSize: 16,
    color: "#ffff",
    fontWeight: "bold",
    marginTop: -5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});

export default BookingList;
