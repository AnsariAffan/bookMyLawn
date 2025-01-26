// LawnOwnerDashboard.js
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { Picker } from "@react-native-picker/picker";
import { ActivityIndicator, Appbar, Checkbox, Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { BookingContext } from "./BookingContext"; // Import your context
import { collection, doc, Firestore, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfiguration/firebaseConfig";
import { AuthContext, useAuth } from "../Authprovider.js/AuthProvider";

const LawnOwnerDashboard = () => {
  const {
    bookings,
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
  
  } = useContext(BookingContext); // Consume context
 // Get user data from Auth context
 const { user, signOut } = useAuth();
  const navigation = useNavigation();
// console.log("----Booking----");
// console.log(bookings);
// console.log("----Booking----");

const handleDayPress = (day) => {
  console.log("Checking if date is already booked...");
  console.log(markedDates);

  // Extract all booked dates from markedDates
  const bookedDates = Object.keys(markedDates).filter(
    (key) => markedDates[key]?.customStyles?.container?.backgroundColor === "lightpink" // Assuming booked dates are marked red
  );

  const isOriginallyBooked = bookedDates.includes(day.dateString);

  if (isOriginallyBooked) {
    Alert.alert("Validation", `Selected date is already booked.`);
    return; // Don't allow selecting or unselecting a booked date
  }

  // Update markedDates without affecting booked dates
  setMarkedDates((prevMarkedDates) => {
    const updatedMarkedDates = { ...prevMarkedDates };

    // Only allow user to unselect or select non-booked dates
    if (selectedDates.includes(day.dateString)) {
      // Remove date from selectedDates and unmark the date
      setSelectedDates(selectedDates.filter((date) => date !== day.dateString));
      delete updatedMarkedDates[day.dateString]; // Remove the marking
      setRemark(""); // Optionally reset remark
    } else {
      // Add date to selectedDates and mark it (only if it's not booked)
      setSelectedDates([...selectedDates, day.dateString]);
      setRemark(""); // Reset remark for simplicity
      updatedMarkedDates[day.dateString] = {
        customStyles: {
          container: {
            backgroundColor: "lightblue", // Blue color for selected date
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



  // useEffect(() => {
  //   if (!user.id) return; // Ensure a user is logged in
  
  //   // Query Firestore for bookings specific to the logged-in user
  //   const unsubscribe = onSnapshot(
  //     query(
  //       collection(db, "bookings"),
  //       where("userId", "==", user.id) // Filter by userId
  //     ),
  //     (snapshot) => {
  //       const bookings = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  
  //       console.log("====Bookings for User=====");
  //       console.log(bookings);
  //       console.log("==========================");
  
  //       // Update markedDates based on the filtered bookings
  //       if (bookings.length === 0) {
  //         setMarkedDates({});
  //       } else {
  //         const updatedMarkedDates = {};
  //         bookings.forEach((booking) => {
  //           booking.dates.forEach((date) => {
  //             updatedMarkedDates[date] = {
  //               customStyles: {
  //                 container: {
  //                   backgroundColor: "purple", // Red for booked dates
  //                 },
  //                 text: {
  //                   color: "#000",
  //                 },
  //               },
  //             };
  //           });
  //         });
  //         setMarkedDates(updatedMarkedDates);
  //       }
  //     }
  //   );
  
  //   // Cleanup subscription on unmount
  //   return () => unsubscribe();
  // }, [user?.id]); // Re-run effect when loggedInUserId changes
  
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Appbar.Header style={{ backgroundColor: "#00509E" }}>
        <Appbar.BackAction
          style={{ color: "#fff" }}
          onPress={() => navigation.goBack()}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#ffff" }}>
          Bookings
        </Text>
      </Appbar.Header>

      <View style={styles.container}>
        <Calendar
          minDate={moment().format("YYYY-MM-DD")}
          onDayPress={handleDayPress}
          markingType={"custom"}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: "#4682B5",
            todayTextColor: "white",
            arrowColor: "#34c759",
            textDayFontWeight: "bold",
            textMonthFontWeight: "bold",
            textDayHeaderFontWeight: "bold",
          }}
        />

        <View style={styles.rememberMeContainer}>
      <Checkbox
      color="purple" // Light pink color
      
        status={true==true ? "checked" : "unchecked"}
        
      />
      <Text style={styles.rememberMeText}>Booked Dates</Text>
      
    </View>
        {loading && <ActivityIndicator style={styles.loadingIndicator} />}
        <View style={styles.remarkContainer}>
          {selectedDates.length > 0 ? (
            <Text style={styles.remarkText}>
              Selected Dates: {selectedDates.join(", ")}
            </Text>
          ) : (
            <Text style={styles.remarkText}>Select a date to view details</Text>
          )}
          {remark && <Text style={styles.remarkText}>Remark: {remark}</Text>}
        </View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (selectedDates.length === 0) {
                alert("Please select an event date");
              } else {
                setModalVisible(true);
              }
            }}
          >
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
        {/* Booking Modal */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>

            {/*  {loading || (
                <ActivityIndicator
                  size="large"
                  color="black"
                  style={{ position: "absolute", zindex: 1, right:170, top: 250 }}
                />
              )}
            */}

              <TouchableOpacity
                style={styles.closeIcon}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="close" size={30} color="#000" />
              </TouchableOpacity>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingBottom:10
                }}
              >
                <Text style={styles.formTitle}>Confirm Booking</Text>
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => setModalVisible(false)}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    X
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={newBooking.name}
                onChangeText={(text) =>
                  setNewBooking({ ...newBooking, name: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Contact No."
                value={newBooking.contact}
                onChangeText={(text) =>
                  
                  setNewBooking({ ...newBooking, contact: text })
                }
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={newBooking.address}
                onChangeText={(text) =>
                  setNewBooking({ ...newBooking, address: text })
                }
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Payment Type</Text>
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
                style={styles.input}
                placeholder="Total Amount"
                value={newBooking.totalAmount}
                onChangeText={(text) =>
                  setNewBooking({ ...newBooking, totalAmount: text })
                }
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Advance / Booking Payment"
                value={newBooking.AdvBookAmount}
                onChangeText={(text) =>
                  setNewBooking({ ...newBooking, AdvBookAmount: text })
                }
                keyboardType="numeric"
              />

              <TouchableOpacity
  style={styles.button}
  onPress={handleBookingSubmit}
>
  <Text style={styles.buttonText}>
    {loading ? (
      <ActivityIndicator
        size="small"
        color="#fff" // Set color to white to match the text color
        style={{ marginTop: 2 }} // Add slight margin to align with text
      />
    ) : (
      "Confirm"
    )}
  </Text>
</TouchableOpacity>


            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 0,
    backgroundColor: "#00509E",
  },

  container: {
    flex: 1,
    padding: 13,
    backgroundColor: "white",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  
 
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
  },
  rememberMeText: {
    fontSize: 14,
    color: "#666",
    fontSize:15
  },
  remarkContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 20, // Adding space between elements
  },
  remarkText: {
    fontSize: 16,
    color: "#333", // Dark text for readability
    fontWeight: "400",
  },

  // Calendar Styles
  calendarContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

  },

  button: {
    backgroundColor: "#00509E",
    paddingVertical: 15,
    borderRadius: 25, // Rounded buttons
    alignItems: "center",
    marginTop: 20,
    elevation: 5, // Add elevation for a floating effect
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker modal background
  },
  modalContent: {
    width: "90%", // Increased width for better readability
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  closeIcon: {
    alignSelf: "flex-end",
    marginTop: -25,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop:10,
    color: "#333", // Dark text for better contrast
  },

  // Input Fields
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },

  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    overflow: "hidden", // Ensure rounded corners
  },
  pickerLabel: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    color: "#333",
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: "100%",
  },

  // Header Style
  header: {
    backgroundColor: "#00509E",
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  // Activity Indicator
  loadingIndicator: {
    marginTop: 15,
  },
});
export default LawnOwnerDashboard;
