import React, { useContext, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import { BookingContext } from "../BookingCalenderprovier/BookingContext";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const BookingScreen = () => {
  const {
    selectedDates,
    setSelectedDates,
    markedDates,
    setMarkedDates,
    isDateBooked,
    successMessage,
    showSuccessMessage,
    setShowSuccessMessage,
    getBookingForDate,
    selectedBooking,
    setSelectedBooking,
    detailsModalVisible,
    setDetailsModalVisible,
  } = useContext(BookingContext);

  const navigation = useNavigation();
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().split("T")[0]);

  const handleDayPress = useCallback(
    (day) => {
      const dateString = day.dateString;
      
      // Check if the date is already booked using your context logic
      if (isDateBooked(dateString)) {
        // Get booking details for this date
        const booking = getBookingForDate(dateString);
        if (booking) {
          setSelectedBooking(booking);
          setDetailsModalVisible(true);
        } else {
          alert("No booking details found for this date.");
        }
        return; // Exit early, don't allow selection of booked dates
      }
      
      // Handle selection/deselection of available dates
      setSelectedDates((prevDates) =>
        prevDates.includes(dateString)
          ? prevDates.filter((date) => date !== dateString) // Remove if already selected
          : [...prevDates, dateString] // Add if not selected
      );
    },
    [isDateBooked, getBookingForDate, setSelectedDates, setSelectedBooking, setDetailsModalVisible]
  );

  const getMarkedDates = useMemo(() => {
    const marked = {};
    
    // First, apply all existing marked dates from context (booked dates)
    // Your context uses teal color (#4DB6AC) for booked dates
    Object.keys(markedDates).forEach((date) => {
      marked[date] = {
        customStyles: {
          container: { 
            backgroundColor: "#EF4444", // Red for booked dates in modern UI
            borderRadius: 12,
            elevation: 3,
            shadowColor: "#EF4444",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          text: { 
            color: "#FFFFFF", 
            fontWeight: "600",
            fontSize: 16,
          },
        },
      };
    });
    
    // Then, mark selected dates (only if they're not booked)
    selectedDates.forEach((date) => {
      if (!markedDates[date]) { // If not in markedDates, it's available
        marked[date] = {
          customStyles: {
            container: { 
              backgroundColor: "#6366F1",
              borderRadius: 12,
              elevation: 3,
              shadowColor: "#6366F1",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            text: { 
              color: "#FFFFFF", 
              fontWeight: "600",
              fontSize: 16,
            },
          },
        };
      }
    });

    return marked;
  }, [markedDates, selectedDates]);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient 
          colors={["#FAFBFF", "#F0F4FF"]} 
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animatable.View animation="fadeInUp" duration={600} style={styles.content}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <Animatable.View animation="fadeInDown" duration={800} delay={200}>
                <Text style={styles.title}>Book Your Lawn</Text>
                <Text style={styles.subtitle}>Select your preferred dates to continue</Text>
              </Animatable.View>
              
              {/* Selected Dates Counter */}
              {selectedDates.length > 0 && (
                <Animatable.View animation="zoomIn" duration={400} style={styles.selectedCounter}>
                  <View style={styles.counterBadge}>
                    <Icon name="event" size={16} color="#6366F1" />
                    <Text style={styles.counterText}>
                      {selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} selected
                    </Text>
                  </View>
                </Animatable.View>
              )}
            </View>

            {/* Calendar Section */}
            <Animatable.View animation="fadeInUp" duration={600} delay={300}>
              <View style={styles.calendarWrapper}>
                <LinearGradient 
                  colors={["#FFFFFF", "#FEFEFF"]} 
                  style={styles.calendarContainer}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Calendar
                    current={currentMonth}
                    onMonthChange={(month) => setCurrentMonth(month.dateString)}
                    onDayPress={handleDayPress}
                    markedDates={getMarkedDates}
                    markingType="custom"
                    firstDay={1}
                    showWeekNumbers={false}
                    disableMonthChange={false}
                    hideExtraDays={true}
                    theme={{
                      backgroundColor: "transparent",
                      calendarBackground: "transparent",
                      textSectionTitleColor: "#8B5CF6",
                      textSectionTitleDisabledColor: "#D1D5DB",
                      selectedDayBackgroundColor: "#6366F1",
                      selectedDayTextColor: "#FFFFFF",
                      todayTextColor: "#6366F1",
                      dayTextColor: "#374151",
                      textDisabledColor: "#D1D5DB",
                      dotColor: "#6366F1",
                      selectedDotColor: "#FFFFFF",
                      arrowColor: "#6366F1",
                      disabledArrowColor: "#D1D5DB",
                      monthTextColor: "#1F2937",
                      indicatorColor: "#6366F1",
                      textDayFontFamily: "System",
                      textMonthFontFamily: "System",
                      textDayHeaderFontFamily: "System",
                      textDayFontSize: 16,
                      textMonthFontSize: 18,
                      textDayHeaderFontSize: 14,
                      textDayFontWeight: "500",
                      textMonthFontWeight: "700",
                      textDayHeaderFontWeight: "600",
                    }}
                    style={styles.calendar}
                  />
                </LinearGradient>
              </View>
            </Animatable.View>

            {/* Legend */}
            <Animatable.View animation="fadeInUp" duration={600} delay={400} style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#6366F1" }]} />
                <Text style={styles.legendText}>Selected</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#EF4444" }]} />
                <Text style={styles.legendText}>Booked</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
                <Text style={styles.legendText}>Available</Text>
              </View>
            </Animatable.View>

            {/* Proceed Button */}
            <Animatable.View animation="fadeInUp" duration={600} delay={500}>
              <TouchableOpacity
                style={[
                  styles.proceedButton,
                  { opacity: selectedDates.length > 0 ? 1 : 0.6 }
                ]}
                onPress={() => navigation.navigate("BookingFormScreen")}
                disabled={selectedDates.length === 0}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={selectedDates.length > 0 ? ["#6366F1", "#8B5CF6"] : ["#9CA3AF", "#6B7280"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>
                      {selectedDates.length > 0 ? "Proceed to Booking" : "Select Dates First"}
                    </Text>
                    <Icon 
                      name="arrow-forward" 
                      size={20} 
                      color="#FFFFFF" 
                      style={styles.buttonIcon} 
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animatable.View>
          </Animatable.View>

          {/* Booking Details Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={detailsModalVisible}
            onRequestClose={() => setDetailsModalVisible(false)}
            statusBarTranslucent={true}
          >
            <View style={styles.modalOverlay}>
              <Animatable.View animation="slideInUp" duration={500} style={styles.formModalContainer}>
                <LinearGradient
                  colors={["#FFFFFF", "#FEFEFF"]}
                  style={styles.modalGradient}
                >
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Booking Details</Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setDetailsModalVisible(false)}
                    >
                      <Icon name="close" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView 
                    contentContainerStyle={styles.modalScrollContent}
                    showsVerticalScrollIndicator={false}
                  >
                    {selectedBooking && (
                      <View style={styles.detailsContainer}>
                        {/* Customer Info Section */}
                        <View style={styles.infoSection}>
                          <Text style={styles.sectionTitle}>Customer Information</Text>
                          <View style={styles.infoCard}>
                            <DetailRow icon="person" label="Name" value={selectedBooking.name} />
                            <DetailRow icon="phone" label="Contact" value={selectedBooking.contact} />
                            <DetailRow icon="email" label="Email" value={selectedBooking.email} />
                            <DetailRow icon="home" label="Address" value={selectedBooking.address} />
                          </View>
                        </View>

                        {/* Event Details Section */}
                        <View style={styles.infoSection}>
                          <Text style={styles.sectionTitle}>Event Details</Text>
                          <View style={styles.infoCard}>
                            <DetailRow icon="event" label="Event Type" value={selectedBooking.eventType} />
                            <DetailRow icon="group" label="Guests" value={selectedBooking.numberOfGuests} />
                            <DetailRow icon="build" label="Setup Assistance" value={selectedBooking.requiresSetupAssistance ? "Yes" : "No"} />
                            <DetailRow icon="calendar-today" label="Dates" value={selectedBooking.dates.join(", ")} />
                          </View>
                        </View>

                        {/* Payment Details Section */}
                        <View style={styles.infoSection}>
                          <Text style={styles.sectionTitle}>Payment Information</Text>
                          <View style={styles.infoCard}>
                            <DetailRow icon="receipt" label="Bill ID" value={selectedBooking.id} />
                            <DetailRow icon="currency-rupee" label="Total Amount" value={`₹${selectedBooking.totalAmount}`} />
                            <DetailRow icon="payment" label="Advance Paid" value={`₹${selectedBooking.AdvBookAmount}`} />
                            <DetailRow icon="account-balance" label="Remaining" value={`₹${selectedBooking.remainingAmount}`} />
                            <DetailRow icon="check-circle" label="Payment Status" value={selectedBooking.paymentStatus} />
                          </View>
                        </View>

                        {/* Additional Info */}
                        {(selectedBooking.additionalServices || selectedBooking.specialRequests) && (
                          <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Additional Information</Text>
                            <View style={styles.infoCard}>
                              {selectedBooking.additionalServices && (
                                <DetailRow icon="room-service" label="Services" value={selectedBooking.additionalServices} />
                              )}
                              {selectedBooking.specialRequests && (
                                <DetailRow icon="notes" label="Special Requests" value={selectedBooking.specialRequests} />
                              )}
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </ScrollView>
                </LinearGradient>
              </Animatable.View>
            </View>
          </Modal>

          {/* Success Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showSuccessMessage}
            onRequestClose={() => setShowSuccessMessage(false)}
            statusBarTranslucent={true}
          >
            <View style={styles.successOverlay}>
              <Animatable.View animation="zoomIn" duration={600} style={styles.successContainer}>
                <LinearGradient 
                  colors={["#FFFFFF", "#F0FDF4"]} 
                  style={styles.successGradient}
                >
                  <Animatable.View animation="bounceIn" duration={1000} delay={200}>
                    <View style={styles.successIconContainer}>
                      <Icon name="check-circle" size={80} color="#10B981" />
                    </View>
                  </Animatable.View>
                  
                  <Text style={styles.successTitle}>Booking Confirmed!</Text>
                  <Text style={styles.successMessage}>{successMessage}</Text>
                  
                  <TouchableOpacity
                    style={styles.successButton}
                    onPress={() => setShowSuccessMessage(false)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#10B981", "#059669"]}
                      style={styles.successButtonGradient}
                    >
                      <Text style={styles.successButtonText}>Perfect!</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </LinearGradient>
              </Animatable.View>
            </View>
          </Modal>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

// Helper component for detail rows
const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailLabelContainer}>
      <Icon name={icon} size={18} color="#8B5CF6" style={styles.detailIcon} />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue} numberOfLines={2}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  selectedCounter: {
    marginTop: 16,
  },
  counterBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  counterText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
  },
  calendarWrapper: {
    marginBottom: 20,
  },
  calendarContainer: {
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  calendar: {
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  proceedButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  formModalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    overflow: "hidden",
  },
  modalGradient: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  modalScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  detailsContainer: {
    paddingTop: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FAFBFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
    flex: 1.2,
    textAlign: "right",
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  successContainer: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  successGradient: {
    padding: 32,
    alignItems: "center",
  },
  successIconContainer: {
    marginBottom: 20,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 50,
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: -0.5,
    marginBottom: 12,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 28,
  },
  successButton: {
    borderRadius: 16,
    overflow: "hidden",
    minWidth: 120,
  },
  successButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: "center",
  },
  successButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default BookingScreen
