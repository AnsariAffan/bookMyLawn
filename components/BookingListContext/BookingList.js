import React, { useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Appbar, Avatar, useTheme } from "react-native-paper";
import { BookingListContext } from "./BookingListContext";
import { useBookings } from "../utility/useBookings";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useBillingData } from "../utility/DataFilterOnDashboard/BillingDataContext";

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

  const { billingDataState } = useBillingData(); // Access the billing data from context

  const renderCoinItem = ({ item }) => {
    const totalAmount = item.totalAmount;
    const totalReceivedAmount = item.totalReceivedAmount;
    const remainingAmount = totalAmount - totalReceivedAmount;

    const getBadgeStyle = (status) => {
      switch (status?.toLowerCase()) {
        case "fully paid":
          return { backgroundColor: "#4DB6AC" }; // Use theme color
        case "partially paid":
          return { backgroundColor: theme.colors.error }; // Use theme color
        case "unpaid":
          return { backgroundColor: "#F44336" }; // Keep as is or add to theme
        default:
          return { backgroundColor: "#9E9E9E" }; // Keep as is or add to theme
      }
    };
    // console.log(item);
    return (
      <TouchableOpacity
        style={[styles.coinCard]}
        onPress={() => handleCardPress(item, navigation)}
      >
        <Avatar.Text
          size={40}
          label={item.name.slice(0, 2).toUpperCase()}
          style={{ backgroundColor: theme.colors.secondary }} // Use theme color
        />
        <View style={styles.coinInfo}>
          <View>
            <Text style={[styles.coinName, { color: "#333333" }]}>
              {item.name}
            </Text>
            <Text style={{ color: "#333333", marginLeft: 8, paddingTop: 5 }}>
              {item.dates}
            </Text>
          </View>

          {/*
            <View style={styles.amountContainer}>
            <Text style={[styles.priceText, { color: "#666666" }]}>
              $
              {totalAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <View style={styles.amountDetails}>
              <Text
                style={[
                  styles.bookingStatus,
                  getBadgeStyle(item.paymentStatus),
                ]}
              >
                {item.paymentStatus}
              </Text>

              <View Style={{display:"flex",flexDirection:"column"}}>
              <Text
                style={[
                  styles.amountText,
                  { color: "#4CAF50" }, // Green for positive amounts
                ]}
              >
                +
                {totalReceivedAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <Text
                style={[
                  styles.amountText,
                  { color: "red" }, // Red for negative amounts
                ]}
              >
                -
                {remainingAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              </View>
              
            </View>
          </View>
            */}
        </View>
        <View style={{width:98,paddingRight:5}}>
          <Text
            style={[styles.bookingStatus, getBadgeStyle(item.paymentStatus)]}
          >
            {item.paymentStatus}
          </Text>
          <Text style={{ color: "#333333", marginLeft: 8, paddingTop: 5,textAlign:"right",paddingRight:5,fontWeight:"bold" }}>
            {item.totalAmount}
          </Text>

          <View style={{ display: "flex", flexDirection: "row" }}>
            <Text
              style={[
                styles.amountText,
                { color: "#4CAF50" }, // Green for positive amounts
              ]}
            >
              +
              {totalReceivedAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text> | </Text>

            <Text
              style={[
                styles.amountText,
                { color: "red" }, // Red for negative amounts
              ]}
            >
              -
              {remainingAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  console.log("---billingDataState----");
  console.log(billingDataState);
  console.log("----billingDataState---");
  return (
    <View style={[styles.contentContainer, { backgroundColor: "#fff" }]}>
      <View style={styles.portfolioSummary}>
        <Text style={styles.value}>Portfolio</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
        
          value={search}
          onChangeText={handleSearch}
        />

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Text style={styles.holdingValue}>Recevied</Text>
          <Text style={styles.holdingValue}>|</Text>
          <Text style={styles.holdingValue}>Unpaid</Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Text style={styles.holdingValues}>
            + {billingDataState.totalReceivedAmount}
          </Text>
          <Text style={styles.holdingValue}></Text>
          <Text style={styles.holdingValues}>
           - {billingDataState.totalRemainingAmount}
          </Text>
        </View>

        {/*
        <Text style={styles.holdingValue}>Portfolio</Text>
        <Text style={styles.value}>${billingDataState?.totalReceivedAmount} +50%</Text>
        <Text style={styles.investedValue}>Remaining Amount</Text>
        <Text style={styles.availableUSD}>${billingDataState.totalRemainingAmount} |100 %</Text>
     */}
      </View>

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
            filter === "partially paid" && styles.selectedFilter,
          ]}
          onPress={() => handleFilterChange("partially paid")}
        >
          <Text style={styles.filterButtonText}>Partially Paid</Text>
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
      </View>

      <FlatList
        data={filteredHotels.map((hotel) => ({
          name: hotel.name,
          totalAmount: hotel.totalAmount,
          totalReceivedAmount: hotel.totalReceivedAmount,
          remainingAmount: hotel.remainingAmount,
          paymentStatus: hotel.paymentStatus,
          address: hotel.address,
          contact: hotel.contact,
          dates: hotel.dates,
          AdvBookAmount: hotel.AdvBookAmount,
          id: hotel.id,
        }))}
        renderItem={renderCoinItem}
        // keyExtractor={(item) => item.name}
        contentContainerStyle={styles.coinList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#009688",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginLeft: 10,
    fontFamily: "Roboto",
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
  },
  searchBar: {
    backgroundColor: "#FFFFFF", // White background
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderColor: "#CCCCCC", // Light black border
    borderWidth: 1,
    marginRight: 0,
    marginBottom: 5,
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 10,
    color: "#999999", // Light black color for the icon
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-between",
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: "#E0F2F1",
  },
  selectedFilter: {
    backgroundColor: "#4DB6AC",
  },
  bookingStatus: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
    padding: 4,
    borderRadius: 12,
    textAlign:"center"
  },
  filterButtonText: {
    fontSize: 12,
    color: "black",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 40,
  },
  portfolioSummary: {
    backgroundColor: "#4DB6AC",
    borderRadius: 30,
    padding: 15,
  },
  holdingValue: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 4,
    color: "#fff",
    fontWeight: "bold",
  },
  holdingValues: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 4,
    color: "#fff",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#009688",
    color: "#fff",
    marginTop: 0,
    marginBottom: 5,
  },
  investedValue: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    color: "#fff",
  },
  availableUSD: {
    fontSize: 14,
    color: "#666666666",
    color: "#fff",
  },
  coinCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 5,
    elevation: 0.8,
    height: 80, // Set a fixed height for the card
    paddingLeft: 10,
  },
  avatar: {
    marginRight: 10,
  },
  coinInfo: {
    flex: 1,
    // backgroundColor:"#fff",
  },

  coinName: {
    fontSize: 17,
    fontWeight: "600",
    fontWeight: "bold",
    marginLeft: 10,
  },
  priceText: {
    fontSize: 14,
    paddingBottom: 15,
    marginLeft: 10,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountDetails: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 14,
  },
  coinList: {
    marginTop: 20,
  },
  icon: {
    marginLeft: 10,
  },
});

export default BookingList;
