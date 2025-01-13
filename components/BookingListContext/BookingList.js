import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Appbar, Avatar, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BookingListContext } from "./BookingListContext";
import { useBookings } from "../utility/useBookings";
import { useBilling } from "../BillingDetails/BillingContext";
import { readDocuments } from "../../firebaseConfiguration/crudForBooking";
import { useAuth } from "../Authprovider.js/AuthProvider";
import { auth, db } from "../../firebaseConfiguration/firebaseConfig";
import { collection, getDocs, query, where,onSnapshot } from "firebase/firestore";
const { width, height } = Dimensions.get("window"); // Get device width and height
import { fetchDataBasedOnUserId } from "../../firebaseConfiguration/crudForBooking";


const BookingList = ({ navigation }) => {
  const {
    search,
    filteredHotels,
    loading,
    handleSearch,
    handleCardPress,

    billingDetails
   
  } = useContext(BookingListContext,useBilling);

  // const { user, signOut } = useAuth();
  
  const { formatDates } = useBookings();
  
  // State for the selected filter
  const [filter, setFilter] = useState("all"); // Default filter is 'all'

  // Handle the filter change
  const handleFilterChange = (status) => {
    setFilter(status);
  };

const [billData, setBillData] = useState()
const user = auth?.currentUser; // Get the currently signed-in user

  useEffect(() => {

    const fetchData = async () => {
      if (user) {
        const data = await fetchDataBasedOnUserId(user?.uid, "billings"); // Await the data
        setBillData(data)
      } else {
        console.log("No user signed in");
      }
    };

    fetchData(); // Call the async function
  }, []);

  
  // Log the updated state when it changes
useEffect(() => {
  if (billData) {
    console.log("---- Updated Bill Data ----");
    console.log(billData);
    console.log("---- End of Updated Bill Data ----");
  }
}, [billData]); // Runs whenever billData changes

  // Filter hotels based on the selected filter
  const filterHotels = () => {
    if (filter === "all") {
      console.log("-----filteredHotels-----");
      console.log(billingDetails);
      return billData; // No filter, show all hotels
    }
    return billData.filter(
      (hotel) => hotel.paymentStatus.toLowerCase() === filter.toLowerCase()
    );
  };

  const renderHotelItem = ({ item }) => {
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

    const monthIndex = parseInt(item.dates[0].split("-")[1], 10);
    const monthName = monthCollection[monthIndex - 1];

    // Determine badge color based on payment status
    const getBadgeStyle = (status) => {
      switch (status.toLowerCase()) {
        case "fully paid":
          return { backgroundColor: "green" }; // Green for fully paid
        case "partially paid":
          return { backgroundColor: "orange" }; // Orange for partially paid
        case "unpaid":
          return { backgroundColor: "red" }; // Red for unpaid
        default:
          return { backgroundColor: "grey" }; // Default color
      }
    };

  

    return (
      <TouchableOpacity
        style={[styles.button, { width: width - 30 }]} // Dynamically adjust width
        onPress={() => handleCardPress(item, navigation)}
      >
        <View style={styles.hotelCard}>
          <Avatar.Text
            size={40}
            label={item.name.slice(0, 2).toUpperCase()}
            style={{ marginTop: 12, marginLeft: 5 }}
          />

          <View style={styles.hotelInfo}>
            <View style={styles.row}>
              <Text style={styles.hotelName}>{item.name}</Text>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>
                  {formatDates(item.dates)}
                </Text>
              </View>
            </View>
          </View>
          <View style={{marginRight:2,marginTop:5}}>
            <Text
              style={[
                styles.bookingStatus,
                getBadgeStyle(item.paymentStatus),
              ]}
            >
              {item.paymentStatus}
            </Text>
            <Text style={styles.hotelPrice}>{item.totalReceivedAmount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

 // Real-time listener for Firestore updates
 useEffect(() => {
  if (!user?.uid) {
    // If the user is not logged in, skip the Firestore query
    return;
  }

  const unsubscribe = onSnapshot(
    query(collection(db, "billings"), where("userId", "==", user?.uid)),
    (snapshot) => {
      const bookingsData = snapshot?.docs.map((doc) => ({
        id: doc?.id,
        userId: doc.data().userId,
        ...doc?.data(),
      }));
      setBillData(bookingsData);
    },
    (error) => {
      console.error("Error fetching data:", error);
    }
  );

  // Cleanup the subscription on unmount or when user logs out
  return () => {
    unsubscribe();
  };
}, [user?.uid]); // Make sure to re-run this effect when the user's UID changes


  
  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#00509E" }}>
        <Appbar.BackAction
          style={{ color: "#F5F5F5" }}
          onPress={() => navigation.goBack()}
        />
        <Text style={{ fontSize: 20, fontWeight: "normal", color: "#ffff" }}>
          Bookings
        </Text>
      </Appbar.Header>

      <View style={styles.containerTwo}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={search}
          onChangeText={handleSearch}
        />

        {/* Filter Buttons Container */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "all" && styles.selectedFilter,
            ]}
            onPress={() => handleFilterChange("all")}
          >
            <Text style={styles.filterButtonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "fully paid" && styles.selectedFilter,
            ]}
            onPress={() => handleFilterChange("fully paid")}
          >
            <Text style={styles.filterButtonText}>Fully Paid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "partially paid" && styles.selectedFilter,
            ]}
            onPress={() => handleFilterChange("partially paid")}
          >
            <Text style={styles.filterButtonText}>Partially Paid</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size="large"
          color="black"
          style={styles.loadingIndicator}
        />
      )}

      <View style={styles.containerThree}>
        <FlatList
          data={filterHotels()} // Apply the filter here
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
    paddingHorizontal: 10,
    paddingBottom: 2,
  },
  containerThree: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
  },
  hotelList: {
    width: "100%",
  },
  hotelCard: {
    flexDirection: "row",
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 5,
    marginBottom: 0,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    height: height * 0.10, // Dynamic height based on screen size
  },

  dateContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft:4
  },

  dateText: {
    fontSize: 15,
    fontWeight: "normal",
    color: "grey",
  },
  monthText: {
    fontSize: 15,
    color: "grey",
  },
  hotelInfo: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 5,
  },
  hotelName: {
    fontSize: 15,
    color: "black",
    marginLeft: 5,
    fontWeight: "bold",
  },
  hotelLocation: {
    fontSize: 15,
    color: "#666666",
  },
  hotelPrice: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "normal",
    
  },
  bookingStatus: {
    fontSize: width * 0.03,
    color: "white",
    fontWeight: "700",
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRadius: 15,
    textAlign: "center",
    overflow: "hidden",
    marginBottom: 10,
  },
  loadingIndicator: {
    position: "absolute",
    top: 50,
    right: 10,
    zIndex: 2,
  },
  row: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    width: width - 30,
    alignSelf: "center",
    height:height*0.11
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: -10,
  },

  filterButton: {
    width: width*0.3,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#00509E",
  },

  selectedFilter: {
    backgroundColor: "lightblue",
  },
  filterButtonText: {
    color: "black",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: 700,
  },
});

export default BookingList;
