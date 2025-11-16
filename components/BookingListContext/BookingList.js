import React, {
  useContext,
  useMemo,
  useState,
  useCallback
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  PixelRatio
} from "react-native";

import { Avatar } from "react-native-paper";
import { BookingListContext } from "./BookingListContext";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { exportData } from "../utility/ExportData";
import { useAuth } from "../Authprovider.js/AuthProvider";
import { deleteBillingData } from "../../firebaseConfiguration/FirebaseCrud";

const { width } = Dimensions.get("window");

// Responsive helpers
const scale = width / 375;
const normalize = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const BookingList = ({ navigation }) => {
  const { user } = useAuth();

  const {
    search,
    filteredHotels,
    loading,
    handleSearch,
    handleFilterChange,
    handleCardPress,
    filter
  } = useContext(BookingListContext);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  /* -----------------------------------------
        Month & Year Filter
  ------------------------------------------ */
  const filteredData = useMemo(() => {
    return filteredHotels.filter((hotel) => {
      const bookingDate = new Date(hotel.dates);

      if (
        selectedMonth &&
        bookingDate.getMonth() + 1 !== parseInt(selectedMonth)
      )
        return false;

      if (selectedYear && bookingDate.getFullYear() !== parseInt(selectedYear))
        return false;

      return true;
    });
  }, [filteredHotels, selectedMonth, selectedYear]);

  /* -----------------------------------------
        Delete Booking
  ------------------------------------------ */
  const handleDelete = (item) => {
    Alert.alert(
      "Delete Booking",
      `Delete booking for ${item.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () =>
            deleteBillingData(user.displayName, item.id)
        }
      ]
    );
  };

  /* -----------------------------------------
        Export
  ------------------------------------------ */
  const handleExport = async (format) => {
    try {
      await exportData(filteredData, format);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  /* -----------------------------------------
        Single Booking Card Component
  ------------------------------------------ */
  const RenderBookingItem = React.memo(
    ({ item, index, handleCardPress, navigation }) => {
      const totalAmount = parseFloat(item.totalAmount) || 0;
      const receivedAmount = parseFloat(item.totalReceivedAmount) || 0;
      const balance = totalAmount - receivedAmount;

      const getStatusConfig = (status) => {
        const key = String(status || "")
  .trim()
  .toLowerCase()
  .replace(/_/g, " ")
  .replace(/\s+/g, " ");
        if (key === "fully paid" || key === "confirmed")
          return { bg: "#ECFDF5", color: "#059669", icon: "check-circle" };

        if (key === "partially paid" || key === "pending")
          return { bg: "#FEF3C7", color: "#D97706", icon: "clock" };

        if (key === "unpaid")
          return { bg: "#FEE2E2", color: "#DC2626", icon: "alert-circle" };

        return { bg: "#DBEAFE", color: "#2563EB", icon: "info" };
      };

      const status = getStatusConfig(item.paymentStatus);

      return (
        <Animatable.View animation="fadeInUp" duration={600} delay={index * 100}>
          <TouchableOpacity
            style={styles.bookingCard}
            onPress={() => handleCardPress(item, navigation)}
            activeOpacity={0.96}
          >
            {/* Header */}
            <View style={styles.cardHeader}>
              <View style={styles.customerSection}>
                <Avatar.Text
                  size={normalize(48)}
                  label={item.name?.charAt(0)?.toUpperCase() || "G"}
                  style={styles.avatar}
                  labelStyle={styles.avatarLabel}
                />
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{item.name}</Text>
                  <View style={styles.contactRow}>
                    <Feather name="phone" size={normalize(12)} color="#6B7280" />
                    <Text style={styles.phoneNumber}>
                      {item.contact || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={[
                  styles.statusContainer,
                  { backgroundColor: status.bg }
                ]}
              >
                <Feather
                  name={status.icon}
                  size={normalize(14)}
                  color={status.color}
                />
                <Text
                  style={[styles.statusText, { color: status.color }]}
                >
                  {item.paymentStatus}
                </Text>
              </View>
            </View>

            {/* Event Info */}
            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailColumn}>
                  <View style={styles.detailItem}>
                    <Feather
                      name="calendar"
                      size={normalize(14)}
                      color="#667EEA"
                    />
                    <Text style={styles.detailLabel}>Event Date</Text>
                  </View>
                  <Text style={styles.detailValue}>{item.dates}</Text>
                </View>

                <View style={styles.detailColumn}>
                  <View style={styles.detailItem}>
                    <Feather
                      name="users"
                      size={normalize(14)}
                      color="#10B981"
                    />
                    <Text style={styles.detailLabel}>Guests</Text>
                  </View>
                  <Text style={styles.detailValue}>
                    {item.numberOfGuests || "N/A"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Payment Summary */}
            <LinearGradient
              colors={["#F8FAFC", "#F1F5F9"]}
              style={styles.paymentBackground}
            >
              <View style={styles.paymentGrid}>
                <View style={styles.paymentItem}>
                  <Text style={styles.paymentLabel}>Total</Text>
                  <Text style={styles.totalAmount}>
                    ₹{totalAmount.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.paymentItem}>
                  <Text style={styles.paymentLabel}>Received</Text>
                  <Text style={styles.receivedAmount}>
                    ₹{receivedAmount.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.paymentItem}>
                  <Text style={styles.paymentLabel}>Balance</Text>
                  <Text
                    style={[
                      styles.balanceAmount,
                      { color: balance > 0 ? "#EF4444" : "#059669" }
                    ]}
                  >
                    ₹{balance.toLocaleString()}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      );
    },
() => false
  );

  /* -----------------------------------------
        FlatList Render
  ------------------------------------------ */
  const renderItem = useCallback(
    ({ item, index }) => (
      <RenderBookingItem
        item={item}
        index={index}
        handleCardPress={handleCardPress}
        navigation={navigation}
      />
    ),
    [handleCardPress, navigation]
  );

  /* -----------------------------------------
        Empty State
  ------------------------------------------ */
  const EmptyState = () => (
    <Animatable.View animation="fadeIn" style={styles.emptyState}>
      <Feather name="calendar" size={normalize(64)} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>No bookings found</Text>
      <Text style={styles.emptySubtitle}>Try adjusting your search</Text>
    </Animatable.View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <LinearGradient
          colors={["#667EEA", "#764BA2"]}
          style={styles.header}
        >
          <Animatable.View animation="fadeInDown" duration={800}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.headerTitle}>Bookings</Text>
                <Text style={styles.headerSubtitle}>
                  {filteredData.length} total bookings
                </Text>
              </View>

              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerButton}>
                  <Feather name="filter" size={normalize(20)} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => handleExport("excel")}
                >
                  <Feather name="download" size={normalize(20)} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </Animatable.View>
        </LinearGradient>

        {/* SEARCH BAR */}
        <Animatable.View animation="slideInUp" duration={600}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={normalize(20)} color="#9CA3AF" />
            <TextInput
              placeholder="Search by name, phone, or date..."
              value={search}
              onChangeText={handleSearch}
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Feather name="x" size={normalize(20)} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </Animatable.View>

        {/* LIST */}
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
  extraData={filteredData}     // 🔥 Mandatory for UI refresh
  renderItem={renderItem}
  keyExtractor={(item) => item.id?.toString()}
  contentContainerStyle={styles.listContainer}
  showsVerticalScrollIndicator={false}
/>

        )}
      </SafeAreaView>
    </>
  );
};

/* -----------------------------------------
        Styles
------------------------------------------ */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { paddingBottom: normalize(24), paddingTop: normalize(16) },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: normalize(20)
  },
  headerTitle: {
    fontSize: normalize(32),
    fontWeight: "700",
    color: "#FFF"
  },
  headerSubtitle: {
    fontSize: normalize(16),
    color: "rgba(255,255,255,0.8)"
  },
  headerActions: {
    flexDirection: "row",
    gap: normalize(12)
  },
  headerButton: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)"
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    margin: normalize(18),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
    borderRadius: normalize(16),
    elevation: 3
  },
  searchInput: {
    flex: 1,
    marginHorizontal: normalize(12),
    color: "#1F2937",
    fontSize: normalize(16)
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loadingText: {
    marginTop: normalize(16),
    fontSize: normalize(16),
    color: "#6B7280"
  },

  listContainer: {
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(60)
  },

  bookingCard: {
    backgroundColor: "#FFF",
    borderRadius: normalize(20),
    padding: normalize(20),
    marginBottom: normalize(16),
    elevation: 3
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: normalize(20)
  },
  customerSection: { flexDirection: "row", alignItems: "center" },
  customerInfo: { marginLeft: normalize(12) },
  customerName: {
    fontSize: normalize(18),
    fontWeight: "600",
    color: "#1F2937"
  },
  contactRow: { flexDirection: "row", alignItems: "center" },
  phoneNumber: { fontSize: normalize(14), color: "#6B7280", marginLeft: 6 },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(20),
    gap: 6
  },
  statusText: {
    fontSize: normalize(12),
    fontWeight: "600",
    textTransform: "capitalize"
  },

  eventDetails: { marginBottom: normalize(20) },
  detailRow: { flexDirection: "row", justifyContent: "space-between" },
  detailColumn: { flex: 1 },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(6),
    gap: 6
  },
  detailLabel: { fontSize: normalize(14), color: "#6B7280" },
  detailValue: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#1F2937"
  },

  paymentBackground: {
    borderRadius: normalize(12),
    padding: normalize(16)
  },
  paymentGrid: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  paymentItem: { alignItems: "center" },
  paymentLabel: { fontSize: normalize(12), color: "#6B7280" },
  totalAmount: { fontSize: normalize(16), fontWeight: "700" },
  receivedAmount: {
    fontSize: normalize(16),
    fontWeight: "700",
    color: "#059669"
  },
  balanceAmount: { fontSize: normalize(16), fontWeight: "700" },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: normalize(40)
  },
  emptyTitle: {
    fontSize: normalize(20),
    fontWeight: "600",
    marginTop: normalize(16)
  },
  emptySubtitle: {
    fontSize: normalize(14),
    color: "#6B7280",
    textAlign: "center"
  }
});

export default BookingList;
