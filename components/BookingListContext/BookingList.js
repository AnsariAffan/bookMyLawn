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
} from "react-native";
import { Avatar, useTheme } from "react-native-paper";
import { BookingListContext } from "./BookingListContext";
import { useBillingData } from "../utility/DataFilterOnDashboard/BillingDataContext";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable";
import { Picker } from "@react-native-picker/picker";
import { exportData } from "../utility/ExportData";
import { useAuth } from "../Authprovider.js/AuthProvider";
import { deleteBillingData } from "../../firebaseConfiguration/FirebaseCrud";

const { width, height } = Dimensions.get("window");

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
  const [viewMode, setViewMode] = useState("card"); // card or list

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


  
  const handleDelete = (item) => {
    console.log(user.displayName)
    Alert.alert(
      "Delete Booking",
      `Are you sure you want to delete ${item.name}'s booking?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteBillingData(user.displayName,item.id)
          
        }
      ]
    );
  };

  // Memoized component for rendering list items
  const RenderBookingItem = React.memo(
    ({ item, index, handleCardPress, navigation }) => {
      const totalAmount = parseFloat(item.totalAmount) || 0;
      const totalReceivedAmount = parseFloat(item.totalReceivedAmount) || 0;
      const remainingAmount = totalAmount - totalReceivedAmount;

      const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
          case "fully paid":
          case "confirmed":
            return { 
              backgroundColor: "#ECFDF5", 
              color: "#059669",
              icon: "check-circle"
            };
          case "partially paid":
          case "pending":
            return { 
              backgroundColor: "#FEF3C7", 
              color: "#D97706",
              icon: "clock"
            };
          case "unpaid":
            return { 
              backgroundColor: "#FEE2E2", 
              color: "#DC2626",
              icon: "alert-circle"
            };
          default:
            return { 
              backgroundColor: "#DBEAFE", 
              color: "#2563EB",
              icon: "info"
            };
        }
      };

      const statusConfig = getStatusConfig(item.paymentStatus);

      return (
        <Animatable.View
          animation="fadeInUp"
          duration={600}
          delay={index * 100}
        >
          <TouchableOpacity
            style={styles.bookingCard}
            onPress={() => handleCardPress(item, navigation)}
            activeOpacity={0.96}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.customerSection}>
                <View style={styles.avatarContainer}>
                  <Avatar.Text 
                    size={48} 
                    label={item.name ? item.name.charAt(0).toUpperCase() : "G"}
                    style={styles.avatar}
                    labelStyle={styles.avatarLabel}
                  />
                </View>
                <View style={styles.customerInfo}>
                  <Text style={styles.customerName}>{item.name}</Text>
                  <View style={styles.contactRow}>
                    <Feather name="phone" size={12} color="#6B7280" />
                    <Text style={styles.phoneNumber}>
                      {item.phone || "+91 98765 43210"}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={[styles.statusContainer, { backgroundColor: statusConfig.backgroundColor }]}>
                <Feather name={statusConfig.icon} size={14} color={statusConfig.color} />
                <Text style={[styles.statusText, { color: statusConfig.color }]}>
                  {item.paymentStatus || "Confirmed"}
                </Text>
              </View>
            </View>

            {/* Event Details */}
            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailColumn}>
                  <View style={styles.detailItem}>
                    <Feather name="calendar" size={14} color="#667EEA" />
                    <Text style={styles.detailLabel}>Event Date</Text>
                  </View>
                  <Text style={styles.detailValue}>{item.dates}</Text>
                </View>
                
                <View style={styles.detailColumn}>
                  <View style={styles.detailItem}>
                    <Feather name="users" size={14} color="#10B981" />
                    <Text style={styles.detailLabel}>Guests</Text>
                  </View>
                  <Text style={styles.detailValue}>{item.numberOfGuests || "300"}</Text>
                </View>
              </View>
            </View>

            {/* Payment Summary */}
            <View style={styles.paymentSummary}>
              <LinearGradient
                colors={["#F8FAFC", "#F1F5F9"]}
                style={styles.paymentBackground}
              >
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
                    <Text style={[
                      styles.balanceAmount,
                      { color: remainingAmount > 0 ? "#EF4444" : "#059669" }
                    ]}>
                      ₹{remainingAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="eye" size={16} color="#667EEA" />
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="edit-3" size={16} color="#059669" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDelete(item)}
              >
                <Feather name="trash-2" size={16} color="#EF4444" />
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      );
    }
  );

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

  const filteredData = useMemo(() => {
    return filteredHotels.filter((hotel) => {
      const bookingDate = new Date(hotel.dates);

      if (selectedMonth) {
        const hotelMonth = bookingDate.getMonth() + 1;
        if (hotelMonth !== parseInt(selectedMonth)) return false;
      }

      if (selectedYear) {
        const hotelYear = bookingDate.getFullYear();
        if (hotelYear !== parseInt(selectedYear)) return false;
      }

      return true;
    });
  }, [filteredHotels, selectedMonth, selectedYear]);

  const EmptyState = () => (
    <Animatable.View animation="fadeIn" style={styles.emptyState}>
      <Feather name="calendar" size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>No bookings found</Text>
      <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
    </Animatable.View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      <SafeAreaView style={styles.container}>
        {/* Modern Header */}
        <LinearGradient
          colors={["#667EEA", "#764BA2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Animatable.View animation="fadeInDown" duration={800} style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Bookings</Text>
                <Text style={styles.headerSubtitle}>
                  {filteredData.length} total bookings
                </Text>
              </View>
              
              <View style={styles.headerActions}>
                <TouchableOpacity 
                  style={styles.headerButton}
                  onPress={() => setFilterModalVisible(true)}
                >
                  <Feather name="filter" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.headerButton}>
                  <Feather name="download" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </Animatable.View>
        </LinearGradient>

        {/* Search Bar */}
        <Animatable.View animation="slideInUp" duration={600} style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, phone, or date..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={handleSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <Feather name="x" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </Animatable.View>

        {/* Content */}
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

        {/* Floating Action Button */}
        <Animatable.View animation="bounceIn" delay={1000}>
          <TouchableOpacity style={styles.fab}>
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.fabGradient}
            >
              <Feather name="plus" size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        {/* Filter Modal */}
        <Modal 
          visible={filterModalVisible} 
          transparent={true} 
          animationType="slide"
          statusBarTranslucent
        >
          <View style={styles.modalOverlay}>
            <Animatable.View animation="slideInUp" duration={400}>
              <View style={styles.modalContainer}>
                <LinearGradient
                  colors={['#FFFFFF', '#F8FAFC']}
                  style={styles.modalContent}
                >
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Filter Bookings</Text>
                    <TouchableOpacity
                      onPress={() => setFilterModalVisible(false)}
                      style={styles.closeButton}
                    >
                      <Feather name="x" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  {/* Filter Options */}
                  <View style={styles.filterContent}>
                    <Text style={styles.filterLabel}>Month</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={selectedMonth}
                        onValueChange={handleMonthChange}
                        style={styles.picker}
                      >
                        <Picker.Item label="All Months" value="" />
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
                        <Picker.Item label="All Years" value="" />
                        {Array.from({ length: 5 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return <Picker.Item key={year} label={`${year}`} value={`${year}`} />;
                        })}
                      </Picker>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.modalActions}>
                      <TouchableOpacity 
                        onPress={handleClearFilter} 
                        style={styles.clearButton}
                      >
                        <Text style={styles.clearButtonText}>Clear All</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        onPress={handleApplyFilter} 
                        style={styles.applyButton}
                      >
                        <LinearGradient
                          colors={["#667EEA", "#764BA2"]}
                          style={styles.applyButtonGradient}
                        >
                          <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </Animatable.View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingBottom: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Roboto',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Roboto',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: -12,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Roboto',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Roboto',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Roboto',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Roboto',
  },
  emptyButton: {
    backgroundColor: '#667EEA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(103, 126, 234, 0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  customerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    backgroundColor: '#667EEA',
  },
  avatarLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Roboto',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontFamily: 'Roboto',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
    fontFamily: 'Roboto',
  },
  eventDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailColumn: {
    flex: 1,
    marginRight: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  paymentSummary: {
    marginBottom: 16,
  },
  paymentBackground: {
    borderRadius: 12,
    padding: 16,
  },
  paymentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentItem: {
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: 'Roboto',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Roboto',
  },
  receivedAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    fontFamily: 'Roboto',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    fontFamily: 'Roboto',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: height * 0.7,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Roboto',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 24,
    marginBottom: 12,
    fontFamily: 'Roboto',
  },
  pickerContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  picker: {
    height: 50,
  },
  modalActions: {
    flexDirection: 'row',
    paddingTop: 32,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Roboto',
  },
  applyButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
});

export default BookingList;