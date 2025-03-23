import React, { useContext, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import { BookingContext } from "../BookingCalenderprovier/BookingContext";

const { width, height } = Dimensions.get("window");

const BookingScreen = () => {
  const {
    selectedDates,
    setSelectedDates,
    newBooking,
    setNewBooking,
    loading,
    handleBookingSubmit,
    markedDates,
    setMarkedDates,
    isDateBooked,
    modalVisible,
    setModalVisible,
    successMessage,
    showSuccessMessage,
    setShowSuccessMessage,
  } = useContext(BookingContext);

  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().split("T")[0]);

  const handleDayPress = useCallback(
    (day) => {
      const dateString = day.dateString;
      if (isDateBooked(dateString)) {
        alert("This date is already booked.");
        return;
      }
      setSelectedDates((prevDates) =>
        prevDates.includes(dateString)
          ? prevDates.filter((date) => date !== dateString)
          : [...prevDates, dateString]
      );
    },
    [isDateBooked, setSelectedDates]
  );

  const handleBookingSubmitWrapper = useCallback(() => {
    handleBookingSubmit().then((success) => {
      if (success) {
        setMarkedDates((prevMarkedDates) => {
          const updatedMarkedDates = { ...prevMarkedDates };
          selectedDates.forEach((date) => {
            updatedMarkedDates[date] = {
              customStyles: {
                container: { backgroundColor: "#FF0000" },
                text: { color: "#FFFFFF" },
              },
            };
          });
          return updatedMarkedDates;
        });
        setSelectedDates([]); // Clear selected dates after success
      }
    });
  }, [handleBookingSubmit, selectedDates, setMarkedDates, setSelectedDates]);

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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <LinearGradient colors={["#F5F7FA", "#E3F2FD"]} style={styles.gradient}>
        <Animatable.View animation="fadeInUp" duration={500} style={styles.content}>
          <Text style={styles.title}>Book Your Lawn</Text>
          <Text style={styles.subtitle}>Select your dates to proceed</Text>

          <Animatable.View animation="fadeIn" duration={500} delay={200}>
            <LinearGradient colors={["#FFFFFF", "#E3F2FD"]} style={styles.calendarContainer}>
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
              onPress={() => setModalVisible(true)}
              disabled={selectedDates.length === 0}
              activeOpacity={0.7}
            >
              <View style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Proceed to Booking</Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </Animatable.View>

        {/* Form Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Animatable.View animation="zoomIn" duration={500} style={styles.formModalContainer}>
              <ScrollView contentContainerStyle={styles.formModalContent}>
                <Text style={styles.modalTitle}>Enter Booking Details</Text>
                <View style={styles.inputContainer}>
                  {[
                    { placeholder: "Name", icon: "person", key: "name", keyboardType: "default" },
                    { placeholder: "Contact", icon: "phone", key: "contact", keyboardType: "phone-pad" },
                    { placeholder: "Address", icon: "location-on", key: "address", keyboardType: "default" },
                    { placeholder: "Total Amount", icon: "attach-money", key: "totalAmount", keyboardType: "numeric" },
                    { placeholder: "Advance Booking Amount", icon: "payment", key: "AdvBookAmount", keyboardType: "numeric" },
                  ].map(({ placeholder, icon, key, keyboardType }) => (
                    <View style={styles.inputWrapper} key={key}>
                      <Icon name={icon} size={20} color="#666666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        placeholderTextColor="#666666"
                        value={newBooking[key]}
                        onChangeText={(text) =>
                          setNewBooking({ ...newBooking, [key]: keyboardType === "numeric" ? parseFloat(text) || 0 : text })
                        }
                        keyboardType={keyboardType}
                      />
                    </View>
                  ))}
                </View>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleBookingSubmitWrapper}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.modalButtonText}>Confirm Booking</Text>
                    )}
                  </TouchableOpacity>
                </View>
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  inputContainer: { width: "100%", marginBottom: 20 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#F5F5F5", borderRadius: 10, marginBottom: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: "#E0E0E0" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: "#333333", fontSize: 16, fontFamily: "Roboto" },
  modalButtonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  modalButton: { paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10, alignItems: "center", flex: 1, marginHorizontal: 5 },
  cancelButton: { backgroundColor: "#EF5350" },
  confirmButton: { backgroundColor: "#3B82F6" },
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