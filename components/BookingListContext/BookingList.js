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
  SafeAreaView,
  StatusBar,
  Alert,
  PixelRatio,
} from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { BookingListContext } from "./BookingListContext";
import { useBillingData } from "../utility/DataFilterOnDashboard/BillingDataContext";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Picker } from "@react-native-picker/picker";
import { exportData } from "../utility/ExportData";
import { useAuth } from "../Authprovider.js/AuthProvider";
import { deleteBillingData } from "../../firebaseConfiguration/FirebaseCrud";

const { width, height } = Dimensions.get("window");

// Responsive size helpers
const scale = width / 375; // 375 is base width (iPhone 8)
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const BookingList = ({ navigation }) => {
  const { user } = useAuth();
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
   //console.log("Filter is open")
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

  const handleDelete = (item) => {
    Alert.alert(
      "Delete Booking",
      `Are you sure you want to delete ${item.name}'s booking?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteBillingData(user.displayName, item.id)
        }
      ]
    );
  };

  const RenderBookingItem = React.memo(({ item, index, handleCardPress, navigation }) => {
    const totalAmount = parseFloat(item.totalAmount) || 0;
    const totalReceivedAmount = parseFloat(item.totalReceivedAmount) || 0;
    const remainingAmount = totalAmount - totalReceivedAmount;

    const getStatusConfig = (status) => {
      switch (status?.toLowerCase()) {
        case "fully paid":
        case "confirmed":
          return { backgroundColor: "#ECFDF5", color: "#059669", icon: "check-circle" };
        case "partially paid":
        case "pending":
          return { backgroundColor: "#FEF3C7", color: "#D97706", icon: "clock" };
        case "unpaid":
          return { backgroundColor: "#FEE2E2", color: "#DC2626", icon: "alert-circle" };
        default:
          return { backgroundColor: "#DBEAFE", color: "#2563EB", icon: "info" };
      }
    };

    const statusConfig = getStatusConfig(item.paymentStatus);

    return (
      <Animatable.View animation="fadeInUp" duration={600} delay={index * 100}>
        <TouchableOpacity
          style={styles.bookingCard}
          onPress={() => handleCardPress(item, navigation)}
          activeOpacity={0.96}
        >
          <View style={styles.cardHeader}>
            <View style={styles.customerSection}>
              <View style={styles.avatarContainer}>
                <Avatar.Text 
                  size={normalize(48)} 
                  label={item.name ? item.name.charAt(0).toUpperCase() : "G"}
                  style={styles.avatar}
                  labelStyle={styles.avatarLabel}
                />
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{item.name}</Text>
                <View style={styles.contactRow}>
                  <Feather name="phone" size={normalize(12)} color="#6B7280" />
                  <Text style={styles.phoneNumber}>{item.phone || "+91 98765 43210"}</Text>
                </View>
              </View>
            </View>
            <View style={[styles.statusContainer, { backgroundColor: statusConfig.backgroundColor }]}>
              <Feather name={statusConfig.icon} size={normalize(14)} color={statusConfig.color} />
              <Text style={[styles.statusText, { color: statusConfig.color }]}>{item.paymentStatus || "Confirmed"}</Text>
            </View>
          </View>

          {/* Event Details */}
          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailColumn}>
                <View style={styles.detailItem}>
                  <Feather name="calendar" size={normalize(14)} color="#667EEA" />
                  <Text style={styles.detailLabel}>Event Date</Text>
                </View>
                <Text style={styles.detailValue}>{item.dates}</Text>
              </View>
              <View style={styles.detailColumn}>
                <View style={styles.detailItem}>
                  <Feather name="users" size={normalize(14)} color="#10B981" />
                  <Text style={styles.detailLabel}>Guests</Text>
                </View>
                <Text style={styles.detailValue}>{item.numberOfGuests || "300"}</Text>
              </View>
            </View>
          </View>

          {/* Payment Summary */}
          <View style={styles.paymentSummary}>
            <LinearGradient colors={["#F8FAFC", "#F1F5F9"]} style={styles.paymentBackground}>
              <View style={styles.paymentGrid}>
                <View style={styles.paymentItem}>
                  <Text style={styles.paymentLabel}>Total Amount</Text>
                  <Text style={styles.totalAmount}>₹{totalAmount.toLocaleString()}</Text>
                </View>
                <View style={styles.paymentItem}>
                  <Text style={styles.paymentLabel}>Received</Text>
                  <Text style={styles.receivedAmount}>₹{totalReceivedAmount.toLocaleString()}</Text>
                </View>
                <View style={styles.paymentItem}>
                  <Text style={styles.paymentLabel}>Balance Due</Text>
                  <Text style={[styles.balanceAmount, { color: remainingAmount > 0 ? "#EF4444" : "#059669" }]}>
                    ₹{remainingAmount.toLocaleString()}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Quick Actions */}
        {/* <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="eye" size={normalize(16)} color="#667EEA" />
              <Text style={styles.actionButtonText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="edit-3" size={normalize(16)} color="#059669" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
              <Feather name="trash-2" size={normalize(16)} color="#EF4444" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>*/}  
        </TouchableOpacity>
      </Animatable.View>
    );
  });

  const renderItem = useCallback(
    ({ item, index }) => (
      <RenderBookingItem item={item} index={index} handleCardPress={handleCardPress} navigation={navigation} />
    ),
    [handleCardPress, navigation]
  );

  const filteredData = useMemo(() => {
    return filteredHotels.filter((hotel) => {
      const bookingDate = new Date(hotel.dates);
      if (selectedMonth && (bookingDate.getMonth() + 1) !== parseInt(selectedMonth)) return false;
      if (selectedYear && bookingDate.getFullYear() !== parseInt(selectedYear)) return false;
      return true;
    });
  }, [filteredHotels, selectedMonth, selectedYear]);

  const EmptyState = () => (
    <Animatable.View animation="fadeIn" style={styles.emptyState}>
      <Feather name="calendar" size={normalize(64)} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>No bookings found</Text>
      <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
    </Animatable.View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#667EEA", "#764BA2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <Animatable.View animation="fadeInDown" duration={800} style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Bookings</Text>
                <Text style={styles.headerSubtitle}>{filteredData.length} total bookings</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerButton} >
                  <Feather name="filter" size={normalize(20)} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerButton}>
                  <Feather name="download" size={normalize(20)} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </Animatable.View>
        </LinearGradient>

        {/* Search Bar */}
        <Animatable.View animation="slideInUp" duration={600} style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={normalize(20)} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, phone, or date..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={handleSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Feather name="x" size={normalize(20)} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </Animatable.View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667EEA" />
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        ) : filteredData.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={5}
          />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { paddingBottom: normalize(24) },
  headerContent: { paddingHorizontal: normalize(20), paddingTop: normalize(16) },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerLeft: { flex: 1 },
  headerTitle: { fontSize: normalize(32), fontWeight: "700", color: "#FFFFFF", marginBottom: normalize(4) },
  headerSubtitle: { fontSize: normalize(16), color: "rgba(255, 255, 255, 0.8)" },
  headerActions: { flexDirection: "row", gap: normalize(12) },
  headerButton: { width: normalize(44), height: normalize(44), borderRadius: normalize(22), backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  searchSection: { paddingHorizontal: normalize(18), paddingVertical: normalize(15), marginTop: -normalize(8), zIndex: 1 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", borderRadius: normalize(16), paddingHorizontal: normalize(16), paddingVertical: normalize(12), shadowColor: "#667EEA", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: normalize(12), elevation: 6 },
  searchInput: { flex: 1, marginLeft: normalize(12), fontSize: normalize(16), color: "#1F2937" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: normalize(16), fontSize: normalize(16), color: "#6B7280" },
  listContainer: { paddingHorizontal: normalize(20), paddingBottom: normalize(100) },
  bookingCard: { backgroundColor: "#fff", borderRadius: normalize(20), marginBottom: normalize(16), padding: normalize(20), shadowColor: "#667EEA", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: normalize(12), elevation: 4, borderWidth: 1, borderColor: "rgba(103, 126, 234, 0.08)" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: normalize(20) },
  customerSection: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatarContainer: { marginRight: normalize(12) },
  avatarLabel: { fontSize: normalize(18), fontWeight: "600" },
  customerInfo: { flex: 1 },
  customerName: { fontSize: normalize(18), fontWeight: "600", color: "#1F2937", marginBottom: normalize(4) },
  contactRow: { flexDirection: "row", alignItems: "center" },
  phoneNumber: { fontSize: normalize(14), color: "#6B7280", marginLeft: normalize(6) },
  statusContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: normalize(12), paddingVertical: normalize(6), borderRadius: normalize(20), gap: normalize(6) },
  statusText: { fontSize: normalize(12), fontWeight: "600", textTransform: "capitalize" },
  eventDetails: { marginBottom: normalize(20) },
  detailRow: { flexDirection: "row", justifyContent: "space-between" },
  detailColumn: { flex: 1, marginRight: normalize(16) },
  detailItem: { flexDirection: "row", alignItems: "center", marginBottom: normalize(8), gap: normalize(8) },
  detailLabel: { fontSize: normalize(14), color: "#6B7280", fontWeight: "500" },
  detailValue: { fontSize: normalize(16), color: "#1F2937", fontWeight: "600" },
  paymentSummary: { marginBottom: normalize(0) },
  paymentBackground: { borderRadius: normalize(12), padding: normalize(16) },
  paymentGrid: { flexDirection: "row", justifyContent: "space-between" },
  paymentItem: { alignItems: "center" },
  paymentLabel: { fontSize: normalize(12), color: "#6B7280", marginBottom: normalize(4) },
  totalAmount: { fontSize: normalize(16), fontWeight: "700", color: "#1F2937" },
  receivedAmount: { fontSize: normalize(16), fontWeight: "700", color: "#059669" },
  balanceAmount: { fontSize: normalize(16), fontWeight: "700" },
  quickActions: { flexDirection: "row", justifyContent: "space-between", paddingTop: normalize(16), borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  actionButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", paddingHorizontal: normalize(16), paddingVertical: normalize(10), borderRadius: normalize(10), flex: 1, marginHorizontal: normalize(4), justifyContent: "center", gap: normalize(6) },
  actionButtonText: { fontSize: normalize(14), color: "#374151", fontWeight: "500" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: normalize(40) },
  emptyTitle: { fontSize: normalize(20), fontWeight: "600", color: "#1F2937", marginTop: normalize(16), marginBottom: normalize(8) },
  emptySubtitle: { fontSize: normalize(14), color: "#6B7280", textAlign: "center", marginBottom: normalize(24) },
});

export default BookingList;
