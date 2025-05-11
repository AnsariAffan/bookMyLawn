import React, { useContext, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
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
      if (isDateBooked(dateString)) {
        const booking = getBookingForDate(dateString);
        if (booking) {
          setSelectedBooking(booking);
          setDetailsModalVisible(true);
        } else {
          alert("No booking details found for this date.");
        }
        return;
      }
      setSelectedDates((prevDates) =>
        prevDates.includes(dateString)
          ? prevDates.filter((date) => date !== dateString)
          : [...prevDates, dateString]
      );
    },
    [isDateBooked, getBookingForDate, setSelectedDates, setSelectedBooking, setDetailsModalVisible]
  );

  const getMarkedDates = useMemo(() => {
    const marked = { ...markedDates };
    selectedDates.forEach((date) => {
      marked[date] = {
        customStyles: {
          container: { backgroundColor: "#3B82F6" },
          text: { color: "#FFFFFF" },
        },
      };
    });
    return marked;
  }, [markedDates, selectedDates]);

  return (
    <LinearGradient colors={["#F3F4F6", "#F3F4F6"]} style={styles.gradient}>
      <Animatable.View animation="fadeInUp" duration={500} style={styles.content}>
        <Text style={styles.title}>Book Your Lawn</Text>
        <Text style={styles.subtitle}>Select your dates to proceed</Text>

        <Animatable.View animation="fadeIn" duration={500} delay={200}>
          <LinearGradient colors={["#FFFFFF", "#F3F4F6"]} style={styles.calendarContainer}>
            <Calendar
              current={currentMonth}
              onMonthChange={(month) => setCurrentMonth(month.dateString)}
              onDayPress={handleDayPress}
              markedDates={getMarkedDates}
              markingType="custom"
              theme={{
                backgroundColor: "transparent",
                calendarBackground: "transparent",
                textSectionTitleColor: "#666666",
                dayTextColor: "#333333",
                todayTextColor: "#3B82F6",
                arrowColor: "#3B82F6",
                monthTextColor: "#333333",
                textDayFontFamily: "Roboto",
                textMonthFontFamily: "Roboto",
                textDayHeaderFontFamily: "Roboto",
              }}
            />
          </LinearGradient>
        </Animatable.View>

        <Animatable.View animation="fadeIn" duration={500} delay={400}>
          <TouchableOpacity
            style={[styles.proceedButton, { opacity: selectedDates.length > 0 ? 1 : 0.5 }]}
            onPress={() => navigation.navigate("BookingFormScreen")} // Navigate to form screen
            disabled={selectedDates.length === 0}
            activeOpacity={0.7}
          >
            <View style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Proceed to Booking</Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>

      {/* Booking Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animatable.View animation="zoomIn" duration={500} style={styles.formModalContainer}>
            <ScrollView contentContainerStyle={styles.formModalContent}>
              <Text style={styles.modalTitle}>Booking Details</Text>
              {selectedBooking && (
                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Bill ID:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.id}</Text>
                  </View>
                  <View style={styles.detailLabel}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Contact:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.contact}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Address:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Event Type:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.eventType}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Number of Guests:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.numberOfGuests}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Setup Assistance:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.requiresSetupAssistance ? "Yes" : "No"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Additional Services:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.additionalServices || "None"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Special Requests:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.specialRequests || "None"}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Dates:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.dates.join(", ")}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Amount:</Text>
                    <Text style={styles.detailValue}>₹{selectedBooking.totalAmount}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Advance Amount:</Text>
                    <Text style={styles.detailValue}>₹{selectedBooking.AdvBookAmount}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Remaining Amount:</Text>
                    <Text style={styles.detailValue}>₹{selectedBooking.remainingAmount}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment Status:</Text>
                    <Text style={styles.detailValue}>{selectedBooking.paymentStatus}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Received:</Text>
                    <Text style={styles.detailValue}>₹{selectedBooking.totalReceivedAmount}</Text>
                  </View>
                </View>
              )}
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDetailsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </Animatable.View>
        </View>
      </Modal>

      {/* Success Popup */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessMessage}
        onRequestClose={() => setShowSuccessMessage(false)}
      >
        <View style={styles.successOverlay}>
          <Animatable.View animation="zoomIn" duration={500} style={styles.successContainer}>
            <LinearGradient colors={["#F7F9FC", "#E3F2FD"]} style={styles.successGradient}>
              <Animatable.View animation="bounceIn" duration={800} style={styles.successIconContainer}>
                <Icon name="check-circle-outline" size={80} color="#34C759" />
              </Animatable.View>
              <Text style={styles.successTitle}>Booking Successful!</Text>
              <Text style={styles.successMessage}>{successMessage}</Text>
              <TouchableOpacity
                style={styles.successButton}
                onPress={() => setShowSuccessMessage(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.successButtonText}>Got It</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animatable.View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1, paddingHorizontal: 15 },
  content: { flex: 1, paddingVertical: 20 },
  title: { fontSize: 24, fontWeight: "600", color: "#333333", textAlign: "center", marginBottom: 10, fontFamily: "Roboto" },
  subtitle: { fontSize: 16, color: "#666666", textAlign: "center", marginBottom: 20, fontFamily: "Roboto" },
  calendarContainer: { borderRadius: 10, padding: 10, marginBottom: 20, borderWidth: 1, borderColor: "#E0E0E0" },
  proceedButton: { width: "100%", borderRadius: 10, overflow: "hidden", marginBottom: 20 },
  buttonGradient: { backgroundColor: "#3B82F6", paddingVertical: 15, alignItems: "center" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600", fontFamily: "Roboto" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" },
  formModalContainer: { backgroundColor: "#FFFFFF", borderRadius: 15, width: width * 0.9, maxHeight: height * 0.7, padding: 20 },
  formModalContent: { flexGrow: 1, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "600", color: "#333333", marginBottom: 20, fontFamily: "Roboto" },
  detailsContainer: { width: "100%", marginBottom: 20 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  detailLabel: { fontSize: 16, fontWeight: "600", color: "#333333", flex: 1 },
  detailValue: { fontSize: 16, color: "#333333", flex: 1, textAlign: "right" },
  modalButton: { paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10, alignItems: "center", flex: 1, marginHorizontal: 5 },
  cancelButton: { backgroundColor: "#EF5350" },
  modalButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600", fontFamily: "Roboto" },
  successOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "center", alignItems: "center" },
  successContainer: { width: width * 0.85, borderRadius: 20, overflow: "hidden", elevation: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10 },
  successGradient: { padding: 30, alignItems: "center" },
  successIconContainer: { marginBottom: 20, backgroundColor: "rgba(52, 199, 89, 0.1)", borderRadius: 50, padding: 15 },
  successTitle: { fontSize: 28, fontWeight: "700", color: "#34C759", letterSpacing: 0.5, marginBottom: 10 },
  successMessage: { fontSize: 16, color: "#555", textAlign: "center", lineHeight: 24, paddingHorizontal: 10 },
  successButton: { backgroundColor: "#3B82F6", paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25, marginTop: 30 },
  successButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "600", letterSpacing: 0.3 },
});

export default BookingScreen;