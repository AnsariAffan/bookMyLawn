import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import SuccessMessage from "../components/SuccessMessage"; // Adjust the path if necessary
import { Picker } from "@react-native-picker/picker";
import { ActivityIndicator, Appbar, Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createBooking } from "../firebaseConfiguration/crudForBooking";

const LawnOwnerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [remark, setRemark] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  // Add a state variable for loading
const [loading, setLoading] = useState(false);
  const [newBooking, setNewBooking] = useState({
    name: "",
    contact: "",
    address: "",
  });
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state

  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    cancelledPast: 0,
    total: 0,
  });
  const [currentMonth, setCurrentMonth] = useState(moment().format("YYYY-MM"));

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateBookingsForMonth(currentMonth);
  }, [bookings, currentMonth]);

  const fetchData = () => {
    const dummyBookings = [
      {
        id: 1,
        date: "2024-10-15",
        status: "pending",
        remark: "Pending Approval",
      },
      {
        id: 2,
        date: "2024-10-20",
        status: "approved",
        remark: "Booking Confirmed",
      },
      {
        id: 3,
        date: "2024-09-28",
        status: "cancelled",
        remark: "Booking Cancelled",
      },
      {
        id: 4,
        date: "2024-09-30",
        status: "approved",
        remark: "Booking Confirmed",
      },
      {
        id: 5,
        date: "2024-11-05",
        status: "pending",
        remark: "Pending Approval",
      },
      {
        id: 6,
        date: "2024-12-15",
        status: "approved",
        remark: "Confirmed for Dec",
      },
    ];
    setBookings(dummyBookings);
  };

  const handleDayPress = (day) => {
    const selectedBooking = bookings.find(
      (booking) => booking.date === day.dateString
    );
    const updatedMarkedDates = { ...markedDates };

    if (selectedBooking && selectedBooking.status === "Approved") {
      return; // Do nothing if the date is already approved
    }

    if (selectedDates.includes(day.dateString)) {
      setSelectedDates(selectedDates.filter((date) => date !== day.dateString));
      delete updatedMarkedDates[day.dateString];

      if (selectedDates.length === 1) {
        setRemark("");
        setShowBookingForm(false);
      } else {
        setShowBookingForm(true);
      }
    } else {
      setSelectedDates([...selectedDates, day.dateString]);

      if (selectedBooking) {
        setRemark(selectedBooking.remark);
      } else {
        setRemark("");
      }

      updatedMarkedDates[day.dateString] = {
        customStyles: {
          container: {
            backgroundColor: "#32CD32",
            borderWidth: 2,
            borderColor: "#32CD32",
            borderRadius: 50,
          },
          text: {
            color: "white",
          },
        },
      };

      setShowBookingForm(true);
    }

    setMarkedDates(updatedMarkedDates);
  };

  const handleMonthChange = (month) => {
    const newMonth = month.dateString.slice(0, 7);
    setCurrentMonth(newMonth);
    setSelectedDates([]);
    setRemark("");
    setShowBookingForm(false);
  };

  const handleBookingSubmit = async () => {
    try {
        // Validate inputs
        if (!newBooking.name || !newBooking.contact || !newBooking.address) {
            alert("Please fill in all fields.");
            return;
        }

        // Set loading to true before making the API call
        setLoading(true);

        // Prepare the booking data
        const bookingData = {
            ...newBooking,
            dates: selectedDates,
            status: "Approved", // Default status
        };

        // Save the booking data to Firestore
        await createBooking('bookings', bookingData);

        // Show success message
        setSuccessMessage("Booking confirmed for " + formatSelectedDates());
        setShowSuccessMessage(true);
        setModalVisible(false); // Close the modal

        // Navigate to SuccessMessage screen
        const date = formatSelectedDates(); // Adjust this if needed to match your date format
        navigation.navigate("SuccessMessage", { date });

        // Reset the newBooking state
        setNewBooking({ name: "", contact: "", address: "", status: "", paymentStatus: "" });
        setSelectedDates([]);
    } catch (error) {
        console.error("Error creating booking:", error);
    } finally {
        // Set loading to false once the request is complete
        setLoading(false);
    }
};


  const handleDismissSuccessMessage = () => {
    setShowSuccessMessage(false);
  };

  const updateBookingsForMonth = (month) => {
    const marked = {};
    const today = moment().format("YYYY-MM-DD");
    let pendingCount = 0;
    let approvedCount = 0;
    let cancelledPastCount = 0;

    bookings.forEach((booking) => {
      const bookingMonth = moment(booking.date).format("YYYY-MM");
      if (bookingMonth === month) {
        const bookingDate = booking.date;
        let color = "";

        if (booking.status === "Pending") {
          color = "#FFD700"; // Gold for pending
          pendingCount++;
        } else if (
          booking.status === "Cancelled" ||
          moment(bookingDate).isBefore(today)
        ) {
          marked[bookingDate] = { disabled: true, disableTouchEvent: true };
          cancelledPastCount++;
        } else if (booking.status === "Approved") {
          color = "#4682B4"; // SteelBlue for approved
          approvedCount++;
        }

        if (color) {
          marked[bookingDate] = {
            customStyles: {
              container: {
                backgroundColor: color,
                borderWidth: 2,
                borderColor: color,
                borderRadius: 8,
              },
              text: {
                color: "white",
              },
            },
          };
        }
      }
    });

    setMarkedDates(marked);
    setCounts({
      pending: pendingCount,
      approved: approvedCount,
      cancelledPast: cancelledPastCount,
      total: approvedCount + cancelledPastCount,
    });
  };

  const formatSelectedDates = () => {
    const groupedByMonth = selectedDates.reduce((acc, date) => {
      const monthYear = moment(date).format("MMM YYYY");
      const day = moment(date).format("D");
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(day);
      return acc;
    }, {});

    return Object.entries(groupedByMonth)
      .map(([month, days]) => `${month} - ${days.join(", ")}`)
      .join(", ");
  };

  const navigation = useNavigation();

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
        {/*
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={{ marginTop: -25, padding: 15 }}>
            <Text style={{ fontSize: 35, fontWeight: 'bold', marginTop: 15, color: '#000', textAlign: "center" }}>
              {counts.total}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000' }}>Total Bookings</Text>
          </View>
          
     
          <View style={styles.legendContainer}>
     
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#FFD700' }]} />
              <Text style={styles.legendText}>Pending Approval ({counts.pending})</Text>
            </View>
              <View style={styles.legendContainer}>
         
          
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#4682B4' }]} />
              <Text style={styles.legendText}>approved ({counts.approved})</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: '#D3D3D3' }]} />
              <Text style={styles.legendText}>Cancelled/Past ({counts.cancelledPast})</Text>
            </View>
          </View>
     
        </View>
     
      */}
     
        <Calendar
          minDate={moment().format("YYYY-MM-DD")}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          pastScrollRange={12}
          futureScrollRange={12}
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
        
   
        <View style={styles.remarkContainer}>
          {selectedDates.length > 0 ? (
            <Text style={styles.remarkText}>
              Selected Dates: {formatSelectedDates()}
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
                setModalVisible(true); // Open the modal if dates are selected
              }
            }} // Always shows the button
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
          {loading && <ActivityIndicator size="large" color="black" style={{position:"absolute",zindex:2,laft:50,top:50}} />} 

            <TouchableOpacity
              style={styles.closeIcon}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" size={30} color="#000" />
            </TouchableOpacity>
            <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
            <Text style={styles.formTitle}>Confirm Booking</Text>
            <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ fontWeight: 'bold',marginRight:10,fontSize:20 }}>X</Text>
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
{/*
  
   <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Booking Status:</Text>
              <Picker
                selectedValue={newBooking.status}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setNewBooking({ ...newBooking, status: itemValue })
                }
              >
                <Picker.Item label="Pending" value="Pending" />
                <Picker.Item label="Approved" value="Approved" />
                <Picker.Item label="Rejected" value="Cancelled" />
              </Picker>
            </View>
  */}
           

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
            value={newBooking.additionalAmount}
            onChangeText={(text) =>
              setNewBooking({ ...newBooking, additionalAmount: text })
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
              <Text style={styles.buttonText}>Confirm</Text>
            
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
  button: {
    backgroundColor: "#00509E",
    padding: 15,
    borderRadius: 50,
    marginTop: 20,
  },

 


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
    top:-20
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
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    overflow: 'hidden', // Ensure the corners are rounded
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
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    
  },
 
});

export default LawnOwnerDashboard;
