import React, { useContext, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { BookingListContext } from "./BookingListContext";
import { useBillingData } from "../utility/DataFilterOnDashboard/BillingDataContext";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";

const { width } = Dimensions.get("window");

const BookingList = ({ navigation }) => {
  const theme = useTheme();
  const {
    search,
    filteredHotels,
    loading,
    handleSearch,
    handleFilterChange,
    handleCardPress,
    filter,
  } = useContext(BookingListContext);

  const { billingDataState } = useBillingData();

  const renderCoinItem = useMemo(
    () => ({ item, index }) => {
      const totalAmount = item.totalAmount;
      const totalReceivedAmount = item.totalReceivedAmount;
      const remainingAmount = totalAmount - totalReceivedAmount;

      const getBadgeStyle = (status) => {
        switch (status?.toLowerCase()) {
          case "fully paid":
            return { backgroundColor: "#26A69A" };
          case "partially paid":
            return { backgroundColor: "#EF5350" };
          case "unpaid":
            return { backgroundColor: "#F44336" };
          default:
            return { backgroundColor: "#9E9E9E" };
        }
      };

      return (
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={index * 100}
        >
          <LinearGradient
            colors={["#FFFFFF", "#E3F2FD"]}
            style={styles.coinCard}
          >
            <TouchableOpacity
              onPress={() => handleCardPress(item, navigation)}
              activeOpacity={0.7}
            >
              <View style={styles.row}>
                <Avatar.Text
                  size={40}
                  label={item.name.slice(0, 2).toUpperCase()}
                  style={{ backgroundColor: "#26A69A" }}
                />
                <View style={styles.coinInfo}>
                  <Text style={styles.coinName}>{item.name}</Text>
                  <Text style={styles.coinDate}>{item.dates}</Text>
                </View>
                <View
                  style={[styles.bookingStatus, getBadgeStyle(item.paymentStatus)]}
                >
                  <Text style={styles.bookingStatusText}>{item.paymentStatus}</Text>
                </View>
              </View>

              <View style={styles.amountContainer}>
                <Text style={styles.totalAmount}>{item.totalAmount}</Text>
                <View style={styles.amountRow}>
                  <Text style={[styles.amountText, { color: "#4CAF50" }]}>
                    +{totalReceivedAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </Text>
                  <Text style={styles.separator}> | </Text>
                  <Text style={[styles.amountText, { color: "#EF5350" }]}>
                    -{remainingAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </Animatable.View>
      );
    },
    [handleCardPress, navigation]
  );

  const filteredData = useMemo(
    () =>
      filteredHotels.map((hotel) => ({
        name: hotel.name,
        totalAmount: hotel.totalAmount,
        totalReceivedAmount: hotel.totalReceivedAmount,
        remainingAmount: hotel.remainingAmount,
        paymentStatus: hotel.paymentStatus,
        dates: hotel.dates,
        id: hotel.id,
      })),
    [filteredHotels]
  );

  return (
    <LinearGradient colors={["#F5F7FA", "#E3F2FD"]} style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.contentContainer}>
        <Animatable.View animation="zoomIn" duration={1000}>
          <LinearGradient
            colors={["#FFFFFF", "#E3F2FD"]}
            style={styles.portfolioSummary}
          >
            <Text style={styles.value}>Portfolio</Text>
            <View style={styles.searchBarContainer}>
              <Icon name="search" size={20} color="#666666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchBar}
                placeholder="Search"
                placeholderTextColor="#666666"
                value={search}
                onChangeText={handleSearch}
              />
            </View>

            <View style={styles.metricsContainer}>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Received</Text>
                <Text style={styles.metricValue}>+ {billingDataState.totalReceivedAmount}</Text>
              </View>
              <View style={styles.metric}>
                <Text style={styles.metricLabel}>Unpaid</Text>
                <Text style={[styles.metricValue, { color: "#EF5350" }]}>
                  - {billingDataState.totalRemainingAmount}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animatable.View>

        <View style={styles.filterContainer}>
          {["all", "partially paid", "fully paid"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterButton, filter === status && styles.selectedFilter]}
              onPress={() => handleFilterChange(status)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.filterGradient, filter === status && { backgroundColor: "#3B82F6" }]}
              >
                <Text style={[styles.filterButtonText, filter === status && styles.selectedFilterText]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderCoinItem}
            contentContainerStyle={styles.coinList}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </Animatable.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { flex: 1, padding: 15 },
  portfolioSummary: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  value: { fontSize: 24, fontWeight: "600", color: "#333333" },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchIcon: { marginRight: 10 },
  searchBar: { flex: 1, paddingVertical: 10, fontSize: 16, color: "#333333" },
  metricsContainer: { flexDirection: "row", justifyContent: "space-between" },
  metric: { alignItems: "center" },
  metricLabel: { fontSize: 14, color: "#666666" },
  metricValue: { fontSize: 20, fontWeight: "600", color: "#333333" },
  filterContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  filterButton: { flex: 1, marginHorizontal: 5, borderRadius: 10, overflow: "hidden" },
  filterGradient: { backgroundColor: "#E0E0E0", paddingVertical: 10, alignItems: "center" },
  selectedFilter: { backgroundColor: "transparent" },
  filterButtonText: { fontSize: 14, color: "#333333" },
  selectedFilterText: { color: "#FFFFFF", fontWeight: "600" },
  coinList: { paddingBottom: 80 },
  coinCard: { borderRadius: 10, padding: 15, marginBottom: 10, borderWidth: 1, borderColor: "#E0E0E0" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  coinInfo: { position: "absolute", left: 50 },
  coinName: { fontSize: 16, fontWeight: "600", color: "#333333" },
  coinDate: { fontSize: 14, color: "#666666", marginTop: 2 },
  amountContainer: { alignItems: "flex-end" },
  bookingStatus: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 12, marginBottom: 5 },
  bookingStatusText: { fontSize: 12, color: "#FFFFFF", fontWeight: "600" },
  totalAmount: { fontSize: 16, fontWeight: "600", color: "#333333" },
  amountRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  amountText: { fontSize: 14 },
  separator: { fontSize: 14, color: "#666666", marginHorizontal: 5 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default BookingList;