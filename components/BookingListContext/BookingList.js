import React, { useContext, useState } from "react";
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
import { Appbar, Avatar } from "react-native-paper";
import { BookingListContext } from "./BookingListContext";
import { useBookings } from "../utility/useBookings";

const { width, height } = Dimensions.get("window");
 
const BookingList = ({ navigation }) => {
  const {
    search,
    filteredHotels,
    loading,
    handleSearch,
    handleFilterChange,
    handleCardPress,
  } = useContext(BookingListContext);
  const { formatDates } = useBookings();
 const [filter,setfilter]= useState('all')

  const renderHotelItem = ({ item }) => {
    const monthCollection = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December",
    ];

    const monthIndex = parseInt(item.dates[0].split("-")[1], 10);
    const monthName = monthCollection[monthIndex - 1];

    const getBadgeStyle = (status) => {
      switch (status.toLowerCase()) {
        case "fully paid":
          return { backgroundColor: "green" };
        case "partially paid":
          return { backgroundColor: "orange" };
        case "unpaid":
          return { backgroundColor: "red" };
        default:
          return { backgroundColor: "grey" };
      }
    };

    return (
      <TouchableOpacity
        style={[styles.button, { width: width - 30 }]}
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
                <Text style={styles.dateText}>{monthName}</Text>
              </View>
              <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {formatDates(item.dates)}
              </Text>
            </View>
            </View>
          </View>
          <View style={{ marginRight: 2, marginTop: 5 }}>
            <Text
              style={[styles.bookingStatus, getBadgeStyle(item.paymentStatus)]}
            >
              {item.paymentStatus}
            </Text>
            <Text style={styles.hotelPrice}>{item.totalReceivedAmount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === "all" && styles.selectedFilter]}
            onPress={() => handleFilterChange("all")}
          >
            <Text style={styles.filterButtonText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === "fully paid" && styles.selectedFilter]}
            onPress={() => handleFilterChange("fully paid")}
          >
            <Text style={styles.filterButtonText}>Fully Paid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === "partially paid" && styles.selectedFilter]}
            onPress={() => handleFilterChange("partially paid")}
          >
            <Text style={styles.filterButtonText}>Partially Paid</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="black"
          style={styles.loadingIndicator}
        />
      )}

      <View style={styles.containerThree}>
        <FlatList
          data={filteredHotels}
          renderItem={renderHotelItem}
          keyExtractor={(item) => item.id}
          style={styles.hotelList}
        />
      </View>
    </View>
  );
};

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
    height: height * 0.10,
  },
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    marginLeft: 4,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "normal",
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
    height: height * 0.11,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: -10,
  },
  filterButton: {
    width: width * 0.3,
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
    fontWeight: "700",
  },
});

export default BookingList;
