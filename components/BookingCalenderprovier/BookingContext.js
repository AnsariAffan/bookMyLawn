import React, { createContext, useState, useEffect, useContext } from "react";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { createBooking } from "../../firebaseConfiguration/crudForBooking";
import { db } from "../../firebaseConfiguration/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { AuthContext, useAuth } from "../Authprovider.js/AuthProvider";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [newBooking, setNewBooking] = useState({
    name: "",
    contact: "",
    address: "",
    totalAmount: 0,
    paymentStatus: "",
    AdvBookAmount: 0,
    paidAmount: 0,
    billingId: "",
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [remark, setRemark] = useState("");

  const navigation = useNavigation();

  // Get user data from Auth context
  const { user, signOut } = useAuth();

  // Firestore listener to fetch data only when the user is logged in
  useEffect(() => {
    if (!user || !user.uid) {
      // If no user is logged in, reset bookings and marked dates
      setBookings([]);
      setMarkedDates({});
      return;  // Don't fetch any bookings if the user is not logged in
    }
  
    // Firestore query to fetch bookings for the logged-in user
    console.log(user.uid);
    const unsubscribe = onSnapshot(
     
      query(collection(db, "bookings"), where("userId", "==", user.uid)),
      (snapshot) => {
        const bookingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          userId: doc.data().userId,
          ...doc.data(),
        }));
  
        // Set the bookings data for the logged-in user
        console.log(bookingsData);
        setBookings(bookingsData);
  
        // Create an updated markedDates object for the calendar
        const updatedMarkedDates = {};
        bookingsData.forEach((booking) => {
          booking.dates.forEach((date) => {
            updatedMarkedDates[date] = {
              customStyles: {
                container: {
                  backgroundColor: "lightpink", // Color for booked dates
                },
                text: {
                  color: "#000",
                },
              },
            };
          });
        });
        
        // Set markedDates so that it updates the calendar
        setMarkedDates(updatedMarkedDates);
      }
    );
  
    // Cleanup the listener when the component unmounts or the user changes
    return () => unsubscribe();
  }, [user?.uid]); // Depend on user.uid to re-run the effect when user changes
  // Depend on user.uid to re-run the effect when user changes

  
  // Function to format selected dates
  const formatSelectedDates = () => {
    const groupedByMonth = selectedDates.reduce((acc, date) => {
      const monthYear = moment(date).format("MMM YYYY");
      const day = moment(date).format("D");
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(day);
      return acc;
    }, {});

    return Object.entries(groupedByMonth)
      .map(([month, days]) => `${month}: ${days.join(", ")}`)
      .join(" | ");
  };

  // Function to handle booking submission
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
        remainingAmount: newBooking.totalAmount - newBooking.AdvBookAmount,
        paymentStatus: newBooking.AdvBookAmount.length > 0 ? "Partially Paid" : "Not Paid",
        userId: user.uid, // Add the userId to the booking data
      };

      // Save the booking data to Firestore and get the booking ID
      const bookingId = await createBooking("bookings", bookingData);

      // Create billing data with the bookingId
      const billingData = {
        ...bookingData,
        bookingId: bookingId, // Include the booking ID in the billing data
      };

      // Save the billing data to Firestore
      createBooking("billings", billingData);

      // Show success message
      setSuccessMessage("Booking confirmed for " + formatSelectedDates());
      setShowSuccessMessage(true);
      setModalVisible(false); // Close the modal

      // Navigate to SuccessMessage screen
      const date = formatSelectedDates(); // Adjust this if needed to match your date format
      navigation.navigate("SuccessMessage", { date });

      // Reset the newBooking state
      setNewBooking({
        name: "",
        contact: "",
        address: "",
        status: "",
        paymentStatus: "",
        totalAmount: "",
      });
      setSelectedDates([]);
    } catch (error) {
      console.error("Error creating booking:", error);
    } finally {
      // Set loading to false once the request is complete
      setLoading(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{
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
        successMessage,
        showSuccessMessage,
        setMarkedDates, // Allow setting marked dates externally
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
