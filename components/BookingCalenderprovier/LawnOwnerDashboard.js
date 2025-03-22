import React, { useContext, useState } from "react";
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
    modalVisible,
    setModalVisible,
    handleBookingSubmit,
    markedDates,
    isDateBooked,
    successMessage,
    showSuccessMessage,
    setShowSuccessMessage,
  } = useContext(BookingContext);

  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().split("T")[0]);
  const [formModalVisible, setFormModalVisible] = useState(false);

  const handleDayPress = (day) => {
    const dateString = day.dateString;
    if (isDateBooked(dateString)) {
      alert("This date is already booked.");
      return;
    }

    const updatedDates = selectedDates.includes(dateString)
      ? selectedDates.filter((date) => date !== dateString)
      : [...selectedDates, dateString];
    setSelectedDates(updatedDates);
  };

  const getMarkedDates = () => {
    const marked = { ...markedDates };
    selectedDates.forEach((date) => {
      marked[date] = {
        customStyles: {
          container: {
            backgroundColor: "#3B82F6",
          },
          text: {
            color: "#FFFFFF",
          },
        },
      };
    });
    return marked;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#F5F7FA", "#E3F2FD"]}
        style={styles.gradient}
      >
        <Animatable.View animation="fadeInUp" duration={500} style={styles.content}>
          {/* Header */}
          <Text style={styles.title}>Book Your Lawn</Text>
          <Text style={styles.subtitle}>Select your dates to proceed</Text>

          {/* Calendar */}
          <Animatable.View animation="fadeIn" duration={500} delay={200}>
            <LinearGradient
              colors={["#FFFFFF", "#E3F2FD"]}
              style={styles.calendarContainer}
            >
              <Calendar
                current={currentMonth}
                onMonthChange={(month) => setCurrentMonth(month.dateString)}
                onDayPress={handleDayPress}
                markedDates={getMarkedDates()}
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

          {/* Proceed to Booking Button */}
          <Animatable.View animation="fadeIn" duration={500} delay={400}>
            <TouchableOpacity
              style={[
                styles.proceedButton,
                { opacity: selectedDates.length > 0 ? 1 : 0.5 },
              ]}
              onPress={() => setFormModalVisible(true)}
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
          visible={formModalVisible}
          onRequestClose={() => setFormModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Animatable.View animation="zoomIn" duration={500} style={styles.formModalContainer}>
              <ScrollView contentContainerStyle={styles.formModalContent}>
                <Text style={styles.modalTitle}>Enter Booking Details</Text>

                {/* Input Fields */}
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Icon name="person" size={20} color="#666666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Name"
                      placeholderTextColor="#666666"
                      value={newBooking.name}
                      onChangeText={(text) => setNewBooking({ ...newBooking, name: text })}
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Icon name="phone" size={20} color="#666666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Contact"
                      placeholderTextColor="#666666"
                      value={newBooking.contact}
                      onChangeText={(text) => setNewBooking({ ...newBooking, contact: text })}
                      keyboardType="phone-pad"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Icon name="location-on" size={20} color="#666666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Address"
                      placeholderTextColor="#666666"
                      value={newBooking.address}
                      onChangeText={(text) => setNewBooking({ ...newBooking, address: text })}
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Icon name="attach-money" size={20} color="#666666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Total Amount"
                      placeholderTextColor="#666666"
                      value={newBooking.totalAmount}
                      onChangeText={(text) =>
                        setNewBooking({ ...newBooking, totalAmount: parseFloat(text) || 0 })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={styles.inputWrapper}>
                    <Icon name="payment" size={20} color="#666666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Advance Booking Amount"
                      placeholderTextColor="#666666"
                      value={newBooking.AdvBookAmount}
                      onChangeText={(text) =>
                        setNewBooking({ ...newBooking, AdvBookAmount: parseFloat(text) || 0 })
                      }
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Confirm and Cancel Buttons */}
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setFormModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleBookingSubmit}
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
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 15,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Roboto",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Roboto",
  },
  calendarContainer: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  proceedButton: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  buttonGradient: {
    backgroundColor: "#3B82F6",
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  formModalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    width: width * 0.9,
    maxHeight: height * 0.7,
    padding: 20,
  },
  formModalContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 20,
    fontFamily: "Roboto",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333333",
    fontSize: 16,
    fontFamily: "Roboto",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#EF5350",
  },
  confirmButton: {
    backgroundColor: "#3B82F6",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto",
  },
});

export default BookingScreen;