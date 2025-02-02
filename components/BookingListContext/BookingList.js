import React, { useContext } from "react";
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
import { Appbar, Avatar, useTheme } from "react-native-paper";
import { BookingListContext } from "./BookingListContext";
import { useBookings } from "../utility/useBookings";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");

const BookingList = ({ navigation }) => {
  const theme = useTheme(); // Use the theme

  const {
    search,
    filteredHotels,
    loading,
    handleSearch,
    handleFilterChange,
    handleCardPress,
    filter,
  } = useContext(BookingListContext);

  const { formatDates } = useBookings();

  const renderHotelItem = ({ item }) => {
    const getBadgeStyle = (status) => {
      switch (status.toLowerCase()) {
        case "fully paid":
          return { backgroundColor: theme.colors.accent }; // Use theme color
        case "partially paid":
          return { backgroundColor: theme.colors.error }; // Use theme color
        case "unpaid":
          return { backgroundColor: "#F44336" }; // Keep as is or add to theme
        default:
          return { backgroundColor: "#9E9E9E" }; // Keep as is or add to theme
      }
    };

    return (
      <TouchableOpacity
        style={[styles.hotelCard, { backgroundColor: theme.colors.surface }]} // Use theme color
        onPress={() => handleCardPress(item, navigation)}
      >
        <Avatar.Text
          size={40}
          label={item.name.slice(0, 2).toUpperCase()}
          style={[styles.avatar, { backgroundColor: theme.colors.primary }]} // Use theme color
          color="#FFFFFF"
        />
        <View style={styles.hotelInfo}>
          <Text style={[styles.hotelName, { color: theme.colors.text }]}>{item.name}</Text> 
          <Text style={[styles.dateText, { color: theme.colors.placeholder }]}>{formatDates(item.dates)}</Text> 
        </View>
        <View style={styles.statusContainer}>
          <Text
            style={[styles.bookingStatus, getBadgeStyle(item.paymentStatus)]}
          >
            {item.paymentStatus}
          </Text>
          <Text style={[styles.hotelPrice, { color: theme.colors.primary }]}>₹{item.totalReceivedAmount}</Text> 
          </View>
          </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.primary }]}>
      
        <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>Bookings List</Text> 
      </Appbar.Header>

      <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}> 
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}> 
          <Icon name="search" size={20} color={theme.colors.placeholder} style={styles.searchIcon} /> 
          <TextInput
            style={[styles.searchBar, { color: theme.colors.text }]}
            placeholder="Search"
            placeholderTextColor={theme.colors.placeholder}
            value={search}
            onChangeText={handleSearch}
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")} style={styles.clearIconContainer}>
              <Icon name="clear" size={20} color={theme.colors.placeholder} /> 
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterContainer}>
        <TouchableOpacity
        style={[
          styles.filterButton,
          filter === "all" && [styles.selectedFilter, { backgroundColor: theme.colors.primary }],
          filter !== "all" && { backgroundColor: theme.colors.surface }
        ]}
        onPress={() => handleFilterChange("all")}
      >
        <Text
          style={[
            styles.filterButtonText,
            { color: filter === "all" ? theme.colors.onPrimary : theme.colors.text }
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterButton,
          filter === "fully paid" && [styles.selectedFilter, { backgroundColor: theme.colors.primary }],
          filter !== "fully paid" && { backgroundColor: theme.colors.surface }
        ]}
        onPress={() => handleFilterChange("fully paid")}
      >
        <Text
          style={[
            styles.filterButtonText,
            { color: filter === "fully paid" ? theme.colors.onPrimary : theme.colors.text }
          ]}
        >
          Fully Paid
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.filterButton,
          filter === "partially paid" && [styles.selectedFilter, { backgroundColor: theme.colors.primary }],
          filter !== "partially paid" && { backgroundColor: theme.colors.surface }
        ]}
        onPress={() => handleFilterChange("partially paid")}
      >
        <Text
          style={[
            styles.filterButtonText,
            { color: filter === "partially paid" ? theme.colors.onPrimary : theme.colors.text }
          ]}
        >
          Partially Paid
        </Text>
      </TouchableOpacity>
      
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary} // Use theme color
            style={styles.loadingIndicator}
          />
        )}

        <FlatList
          data={filteredHotels}
          renderItem={renderHotelItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.hotelList}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  clearIconContainer: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    elevation: 2,
  },
  selectedFilter: {
    // backgroundColor is now set dynamically
    color:"black"
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  hotelCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  avatar: {
    marginRight: 16,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  bookingStatus: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  hotelPrice: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default BookingList;