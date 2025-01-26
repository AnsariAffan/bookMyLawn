import React, { createContext, useState, useEffect, useContext } from "react";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { createBooking } from "../../firebaseConfiguration/crudForBooking";
import { db } from "../../firebaseConfiguration/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { AuthContext, useAuth } from "../Authprovider.js/AuthProvider";
import { onBillingDataChange, saveBillingData } from "../../firebaseConfiguration/FirebaseCrud";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [markedDates, setMarkedDates] = useState({});  // Stores booked dates
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
    totalReceivedAmount:0
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [remark, setRemark] = useState("");

  const navigation = useNavigation();

  // Get user data from Auth context
  const { user, signOut } = useAuth();

  // Real-time listener for billing data specific to the logged-in user
  useEffect(() => {
    if (!user || !user?.uid) {
      setBookings([]);
      setMarkedDates({});
      return;
    }

    const handleBillingDataChange = (billingData) => {
      if (!billingData) {
        setMarkedDates({});
      } else {
        const updatedMarkedDates = {};
        
        Object.values(billingData).forEach((billingItem) => {
          billingItem.dates.forEach((date) => {
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
        setMarkedDates(updatedMarkedDates);
      }
    };

    // Listen for changes in the client's billing data
    onBillingDataChange(user.displayName, handleBillingDataChange);

    return () => {
      // Cleanup logic if needed
    };
  }, [user?.uid]);

  // Function to validate if selected date is already booked
  const isDateBooked = (date) => {
    return markedDates[date] !== undefined;
  };

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
      if (!newBooking.name || !newBooking.contact || !newBooking.address) {
        alert("Please fill in all fields.");
        return;
      }

      setLoading(true);

      const bookingData = {
        ...newBooking,
        dates: selectedDates,
        status: "Approved",
        remainingAmount: newBooking.totalAmount - newBooking.AdvBookAmount,
        paymentStatus: newBooking.AdvBookAmount.length > 0 ? "Partially Paid" : "Not Paid",
        userId: user?.uid,
        totalReceivedAmount:newBooking.AdvBookAmount
      };

      //const bookingId = await createBooking("bookings", bookingData);

      const billingData = {
        ...bookingData,
       // bookingId: bookingId,
      };

      saveBillingData(user.displayName, billingData);
     // createBooking("billings", billingData);

      setSuccessMessage("Booking confirmed for " + formatSelectedDates());
      setShowSuccessMessage(true);
      setModalVisible(false);
      
      navigation.navigate("SuccessMessage", { date: formatSelectedDates() });

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
      setLoading(false);
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        markedDates,           // Expose markedDates for validation
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
        setMarkedDates,       // Allow setting marked dates externally
        isDateBooked,         // Expose the validation function
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
