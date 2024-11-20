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
import { ActivityIndicator, Appbar, Icon } from "react-native-paper";
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
    // Check if the date is originally booked (not a user-selected date)
    const isOriginallyBooked = bookings.some((booking) =>
      booking.dates.includes(day.dateString)
    );
  
    if (isOriginallyBooked) {
      Alert.alert("Validation", `Selcted date is already booked.`);
      return;
    }
  
    const updatedMarkedDates = { ...markedDates };
  
    if (selectedDates.includes(day.dateString)) {
      setSelectedDates(selectedDates.filter((date) => date !== day.dateString));
      delete updatedMarkedDates[day.dateString]; // Remove the marking
      setRemark("");
    } else {
      setSelectedDates([...selectedDates, day.dateString]);
      setRemark(""); // Reset remark for simplicity
      updatedMarkedDates[day.dateString] = {
        customStyles: {
          container: {
             backgroundColor: "lightblue", // blue color for selecting date
            // backgroundColor:"#FFCCCB", //  light red color
            
          },
          text: {
            color: "#000",
          },
        },
      };
    }
    setMarkedDates(updatedMarkedDates); // Use setMarkedDates from context
  };
  

  useEffect(() => {
    if (!user.id) return; // Ensure a user is logged in
  
    // Query Firestore for bookings specific to the logged-in user
    const unsubscribe = onSnapshot(
      query(
        collection(db, "bookings"),
        where("userId", "==", user.id) // Filter by userId
      ),
      (snapshot) => {
        const bookings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        console.log("====Bookings for User=====");
        console.log(bookings);
        console.log("==========================");
  
        // Update markedDates based on the filtered bookings
        if (bookings.length === 0) {
          setMarkedDates({});
        } else {
          const updatedMarkedDates = {};
          bookings.forEach((booking) => {
            booking.dates.forEach((date) => {
              updatedMarkedDates[date] = {
                customStyles: {
                  container: {
                    backgroundColor: "lightpink", // Red for booked dates
                  },
                  text: {
                    color: "#000",
                  },
                },
              };
            });
          });
          setMarkedDates(updatedMarkedDates);
        }
      }
    );
  
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user?.id]); // Re-run effect when loggedInUserId changes
  
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Appbar.Header style={{ backgroundColor: "#00509E" }}>
        <Appbar.BackAction
          style={{ color: "#ffffff" }}
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
                      marginRight: 10,
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
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  legendContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
  },
  remarkContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  remarkText: {
    fontSize: 16,
  },
  // button: {
  //   backgroundColor: "#00509E",
  //   padding: 15,
  //   borderRadius: 50,
  //   marginTop: 20,
  // },

  picker: {
    height: 50,
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  closeIcon: {
    alignSelf: "flex-end",
    top: -20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    overflow: "hidden", // Ensure the corners are rounded
  },
  pickerLabel: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#00509E",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  
});

export default LawnOwnerDashboard;
