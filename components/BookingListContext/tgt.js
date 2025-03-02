import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { ActivityIndicator, Appbar, useTheme, Dialog, Portal, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BookingContext } from "./BookingContext";
import { useAuth } from "../Authprovider.js/AuthProvider";
import Icon from "react-native-vector-icons/MaterialIcons";

const LawnOwnerDashboard = () => {
  const {
    markedDates,
    selectedDates,
    setSelectedDates,
    newBooking,
    setNewBooking,
    loading,
    modalVisible,
    setModalVisible,
    handleBookingSubmit,
    remark,
    setRemark,
    setMarkedDates,
  } = useContext(BookingContext);

  const { user, signOut } = useAuth();
  const navigation = useNavigation();
  const theme = useTheme(); // Get the theme

  const [visibleDialog, setVisibleDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const handleDayPress = (day) => {
    const bookedDates = Object.keys(markedDates).filter(
      (key) => markedDates[key]?.customStyles?.container?.backgroundColor === "lightpink"
    );

    const isOriginallyBooked = bookedDates.includes(day.dateString);

    if (isOriginallyBooked) {
      setDialogMessage(`Selected date is already booked.`);
      setVisibleDialog(true); // Show dialog instead of Alert
      return;
    }

    setMarkedDates((prevMarkedDates) => {
      const updatedMarkedDates = { ...prevMarkedDates };

      if (selectedDates.includes(day.dateString)) {
        setSelectedDates(selectedDates.filter((date) => date !== day.dateString));
        delete updatedMarkedDates[day.dateString];
        setRemark("");
      } else {
        setSelectedDates([...selectedDates, day.dateString]);
        setRemark("");
        updatedMarkedDates[day.dateString] = {
          customStyles: {
            container: {
              backgroundColor: "lightblue",
            },
            text: {
              color: "#000",
            },
          },
        };
      }

      return updatedMarkedDates;
    });
  };

  return (
    <LinearGradient colors={["#E5F1FB", "#FFFFFF"]} style={[styles.gradientContainer, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Appbar.Header style={[styles.header, { backgroundColor: theme.colors.primary }]}>
               <Appbar.Action
                 icon="arrow-left"
                 onPress={() => navigation.goBack()}
                 color={theme.colors.surface}
               />
               <Text style={[styles.headerTitle, { color: theme.colors.surface }]}>Bookings Calendar</Text>
               {/* Added space to balance the header */}
               <View style={{ width: 56 }} />
             </Appbar.Header>
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
          <Calendar
            minDate={moment().format("YYYY-MM-DD")}
            onDayPress={handleDayPress}
            markingType={"custom"}
            markedDates={markedDates}
            theme={{
              selectedDayBackgroundColor: theme.colors.primary, // Use primary color for selected day
              todayTextColor: theme.colors.accent, // Accent color for today's text
              arrowColor: theme.colors.accent, // Accent color for arrows
              textDayFontWeight: "bold",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "bold",
            }}
          />

          {loading && <ActivityIndicator style={styles.loadingIndicator} animating={loading} color={theme.colors.primary} />}

          <View style={styles.remarkContainer}>
            {selectedDates.length > 0 ? (
              <Text style={[styles.remarkText, { color: theme.colors.text }]}>Selected Dates: {selectedDates.join(", ")}</Text>
            ) : (
              <Text style={[styles.remarkText, { color: theme.colors.text }]}>Select a date to view details</Text>
            )}
            {remark && <Text style={[styles.remarkText, { color: theme.colors.text }]}>Remark: {remark}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              if (selectedDates.length === 0) {
                setDialogMessage("Please select an event date");
                setVisibleDialog(true); // Show dialog instead of alert
              } else {
                setModalVisible(true);
              }
            }}
          >
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>

          {/* Booking Modal */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={25} color={theme.colors.text} />
                </TouchableOpacity>

                <Text style={[styles.formTitle, { color: theme.colors.text }]}>Confirm Booking</Text>

                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.background }]}
                  placeholder="Full Name"
                  value={newBooking.name}
                  onChangeText={(text) => setNewBooking({ ...newBooking, name: text })}
                />
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.background }]}
                  placeholder="Contact No."
                  value={newBooking.contact}
                  onChangeText={(text) => setNewBooking({ ...newBooking, contact: text })}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.background }]}
                  placeholder="Address"
                  value={newBooking.address}
                  onChangeText={(text) => setNewBooking({ ...newBooking, address: text })}
                />

                <View style={styles.pickerContainer}>
                  <Text style={[styles.pickerLabel, { color: theme.colors.text }]}>Payment Type</Text>
                  <Picker
                    selectedValue={newBooking.paymentStatus}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      setNewBooking({ ...newBooking, paymentStatus: itemValue })
                    }
                  >
                    <Picker.Item label="Cash" value="Cash" />
                    <Picker.Item label="Online Payment" value="OnlinePayment" />
                  </Picker>
                </View>

                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.background }]}
                  placeholder="Total Amount"
                  value={newBooking.totalAmount}
                  onChangeText={(text) => setNewBooking({ ...newBooking, totalAmount: text })}
                  keyboardType="numeric"
                />

                <TextInput
                  style={[styles.input, { backgroundColor: theme.colors.background }]}
                  placeholder="Advance / Booking Payment"
                  value={newBooking.AdvBookAmount}
                  onChangeText={(text) => setNewBooking({ ...newBooking, AdvBookAmount: text })}
                  keyboardType="numeric"
                />

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.colors.primary }]}
                  onPress={handleBookingSubmit}
                >
                  <Text style={styles.buttonText}>
                    {loading ? (
                      <ActivityIndicator size="small" color={theme.colors.background} />
                    ) : (
                      "Confirm"
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Dialog for alerts */}
          <Portal>
            <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
              <Dialog.Title>Notification</Dialog.Title>
              <Dialog.Content>
                <Text>{dialogMessage}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setVisibleDialog(false)}>OK</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 0,
  },
  appbar: {
    elevation: 4,
  },
  backAction: {
    color: "#fff",
  },
  appbarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    flex: 1,
    padding: 15,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22, // Increased font size for better readability
    fontWeight: "600",
    marginLeft: 10,
    fontFamily: "Roboto", // Standard font family
    flex: 1,
    textAlign: 'center', // Center-align title
  },
  remarkContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  remarkText: {
    fontSize: 16,
    fontWeight: "400",
  },
 
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  closeIcon: {
    alignSelf: "flex-end",
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
  },
  pickerLabel: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default LawnOwnerDashboard;
