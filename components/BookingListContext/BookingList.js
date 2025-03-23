import React, { useContext, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { BookingListContext } from "./BookingListContext";
import { useBillingData } from "../utility/DataFilterOnDashboard/BillingDataContext";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import { Picker } from "@react-native-picker/picker";
import { exportData } from "../utility/ExportData";

const { width } = Dimensions.get("window");

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

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

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const handleMonthChange = (month) => setSelectedMonth(month);
  const handleYearChange = (year) => setSelectedYear(year);

  const handleApplyFilter = () => {
    setFilterModalVisible(false);
  };

  const handleClearFilter = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setFilterModalVisible(false);
  };

  const handleExport = async (format) => {
    try {
      await exportData(filteredData, format);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // Memoized component for rendering list items
  const RenderCoinItem = React.memo(
    ({ item, index, handleCardPress, navigation }) => {
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
    (prevProps, nextProps) => {
      // Custom comparison function to prevent unnecessary re-renders
      return (
        prevProps.item === nextProps.item &&
        prevProps.index === nextProps.index &&
        prevProps.handleCardPress === nextProps.handleCardPress &&
        prevProps.navigation === nextProps.navigation
      );
    }
  );

  // Memoize the renderItem function
  const renderItem = useCallback(
    ({ item, index }) => (
      <RenderCoinItem
        item={item}
        index={index}
        handleCardPress={handleCardPress}
        navigation={navigation}
      />
    ),
    [handleCardPress, navigation]
  );

  const filteredData = useMemo(() => {
    return filteredHotels.filter((hotel) => {
      const bookingDate = new Date(hotel.dates);

      if (selectedMonth) {
        const hotelMonth = bookingDate.getMonth() + 1; // Months are 0-indexed
        if (hotelMonth !== parseInt(selectedMonth)) return false;
      }

      if (selectedYear) {
        const hotelYear = bookingDate.getFullYear();
        if (hotelYear !== parseInt(selectedYear)) return false;
      }

      return true;
    });
  }, [filteredHotels, selectedMonth, selectedYear]);

  const filterCounts = useMemo(() => {
    const counts = { all: filteredHotels.length, "partially paid": 0, "fully paid": 0 };
    filteredHotels.forEach((hotel) => {
      if (hotel.paymentStatus?.toLowerCase() === "partially paid") {
        counts["partially paid"]++;
      } else if (hotel.paymentStatus?.toLowerCase() === "fully paid") {
        counts["fully paid"]++;
      }
    });
    return counts;
  }, [filteredHotels]);

  return (
    <LinearGradient colors={["#F5F7FA", "#E3F2FD"]} style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={1000} style={styles.contentContainer}>
        <Animatable.View animation="zoomIn" duration={1000}>
          <LinearGradient
            colors={["#FFFFFF", "#E3F2FD"]}
            style={styles.portfolioSummary}
          >
            <View style={styles.portfolioHeader}>
              <Text style={styles.value}>Portfolio</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                  <Icon name="calendar-today" size={24} color="#666666" />
                </TouchableOpacity>
                {/*  <TouchableOpacity onPress={() => handleExport("excel")} style={{ marginLeft: 10 }}>
                  <Icon name="file-excel" size={24} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleExport("pdf")} style={{ marginLeft: 10 }}>
                  <Icon name="file-pdf" size={24} color="#EF5350" />
                </TouchableOpacity> */}
                  
                  
                 
               
              </View>
            </View>
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

        <Modal visible={filterModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.filterModal}>
              <Text style={styles.modalTitle}>Filter by Date</Text>

              <Text style={styles.filterLabel}>Month</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedMonth}
                  onValueChange={handleMonthChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Month" value="" />
                  {monthNames.map((month, index) => (
                    <Picker.Item key={index} label={month} value={`${index + 1}`} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.filterLabel}>Year</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={handleYearChange}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Year" value="" />
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <Picker.Item key={year} label={`${year}`} value={`${year}`} />;
                  })}
                </Picker>
              </View>

              <View style={styles.filterButtons}>
                <TouchableOpacity onPress={handleApplyFilter} style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClearFilter} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

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
                  {`${status.charAt(0).toUpperCase() + status.slice(1)} (${filterCounts[status]})`}
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
            renderItem={renderItem}
            contentContainerStyle={styles.coinList}
            keyExtractor={(item) => item.id.toString()}
            getItemLayout={(data, index) => ({
              length: 100, // Approximate height of each item
              offset: 100 * index,
              index,
            })}
            initialNumToRender={10} // Render only a few items initially
            maxToRenderPerBatch={10} // Limit the number of items rendered per batch
            windowSize={5} // Adjust the window size for better performance
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
  picker: {
    height: 40,
    marginVertical: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
  },
  portfolioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  filterModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    width: "90%", // Increased width for better visibility
    maxWidth: 400, // Added max width for larger screens
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 10,
  },
  picker: {
    height: 40,
    backgroundColor: "#F5F5F5",
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: "#EF5350",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default BookingList;