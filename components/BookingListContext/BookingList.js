import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Appbar, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BookingListContext } from './BookingListContext';

const { width } = Dimensions.get('window'); // Get device width

const BookingList = ({ navigation }) => {
  const {
    search,
    filteredHotels,
    loading,
    handleSearch,
    handleCardPress,
    user
  } = useContext(BookingListContext);

  // State for the selected filter
  const [filter, setFilter] = useState('all'); // Default filter is 'all'

  // Handle the filter change
  const handleFilterChange = (status) => {
    setFilter(status);
  };

  // Filter hotels based on the selected filter
  const filterHotels = () => {
    if (filter === 'all') {
      return filteredHotels; // No filter, show all hotels
    }
    return filteredHotels.filter((hotel) => hotel.paymentStatus.toLowerCase() === filter.toLowerCase());
  };

  const renderHotelItem = ({ item }) => {
    const monthCollection = [
      "January", "February", "March", "April", "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];

    const monthIndex = parseInt(item.dates[0].split("-")[1], 10);
    const monthName = monthCollection[monthIndex - 1];

    return (
      <TouchableOpacity
        style={[styles.button, { width: width - 30 }]} // Dynamically adjust width
        onPress={() => handleCardPress(item, navigation)}
      >
        <View style={styles.hotelCard}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{item.dates[0].split("-")[2]}</Text>
            <Text style={styles.monthText}>{monthName}</Text>
          </View>

          <View style={styles.hotelInfo}>
            <View style={styles.row}>
              <Text style={styles.hotelName}>{item.name}</Text>
              <Text style={styles.bookingStatus}>{item.paymentStatus}</Text>
            </View>
            <View style={[styles.row, { paddingTop: 5 }]}>
              <View style={styles.row}>
              </View>
              <Text style={styles.hotelPrice}>{item.totalAmount}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          placeholder="Search"
          value={search}
          onChangeText={handleSearch}
        />

          {/* Filter Buttons Container */}
  <View style={styles.filterContainer}>
  <TouchableOpacity
    style={[styles.filterButton, filter === 'all' && styles.selectedFilter]}
    onPress={() => handleFilterChange('all')}
  >
    <Text style={styles.filterButtonText}>All</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.filterButton, filter === 'fully paid' && styles.selectedFilter]}
    onPress={() => handleFilterChange('fully paid')}
  >
    <Text style={styles.filterButtonText}>Fully Paid</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.filterButton, filter === 'partially paid' && styles.selectedFilter]}
    onPress={() => handleFilterChange('partially paid')}
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
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  containerThree: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
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
    paddingVertical: 8, // Reduce vertical padding
    paddingHorizontal: 15, // Adjust horizontal padding if needed
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    height: 80, // Set a fixed height for the card (optional)
  },

  dateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  dateText: {
    fontSize: 35,
    fontWeight: "bold",
    // color: "#00509E",
    color:"black"
  },
  monthText: {
    fontSize: 15,
    color: "black",
  },
  hotelInfo: {
    flex: 1,
    justifyContent: "center",
  },
  hotelName: {
    fontSize: 18,
    color: "#333333",
    
    
  },
  hotelLocation: {
    fontSize: 15,
    color: "#666666",
  },
  hotelPrice: {
    color: "#333333",
    fontSize: 20,
    fontWeight: "bold",
    
  },
  bookingStatus: {
    fontSize: width * 0.04,
    color: "darkblue",
    fontWeight: "700",
    fontStyle:"italic",
  },
  loadingIndicator: {
    position: "absolute",
    top: 50,
    right: 10,
    zIndex: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    width: width - 30, // Make button width dynamic
    alignSelf: "center",
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: -10,
  },

  filterButton: {
    width:115,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#00509E',
  },

  selectedFilter: {
    backgroundColor: 'lightblue',
    
  },
  filterButtonText: {
    color: 'black',
  fontSize:12,
  fontStyle:"italic",
  fontWeight:700
  },
});

export default BookingList;
