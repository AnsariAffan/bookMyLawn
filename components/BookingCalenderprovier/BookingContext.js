import React, { createContext, useState, useEffect } from "react";
import moment from "moment";
import { useAuth } from "../Authprovider.js/AuthProvider";
import { onBillingDataChange, saveBillingData } from "../../firebaseConfiguration/FirebaseCrud";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState({}); // New: asset selections
  const [newBooking, setNewBooking] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    eventType: "",
    numberOfGuests: 0,
    additionalServices: "",
    specialRequests: "",
    requiresSetupAssistance: "", // "Yes" or "No"
    totalAmount: 0,
    paymentStatus: "",
    AdvBookAmount: 0,
    paidAmount: 0,
    billingId: "",
    totalReceivedAmount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user?.uid) {
      setBookings([]);
      setMarkedDates({});
      return;
    }

    const handleBillingDataChange = (billingData) => {
      if (!billingData) {
        setBookings([]);
        setMarkedDates({});
      } else {
        const bookingArray = Object.entries(billingData).map(([id, data]) => ({
          id,
          ...data,
        }));
        setBookings(bookingArray);

        const updatedMarkedDates = {};
        bookingArray.forEach((booking) => {
          if (booking.dates) {
            booking.dates.forEach((date) => {
              updatedMarkedDates[date] = {
                customStyles: {
                  container: { backgroundColor: "#4DB6AC" },
                  text: { color: "#000" },
                },
              };
            });
          }
        });
        setMarkedDates(updatedMarkedDates);
      }
    };

    onBillingDataChange(user.displayName, handleBillingDataChange);
  }, [user?.uid]);

  const isDateBooked = (date) => markedDates[date] !== undefined;

  const getBookingForDate = (date) => {
    return bookings.find((booking) => booking.dates?.includes(date)) || null;
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
      .map(([month, days]) => `${month}: ${days.join(", ")}`)
      .join(" | ");
  };

  const handleBookingSubmit = async () => {
    try {
      setLoading(true);

      let paymentStatus = "Not Paid";
      if (newBooking.AdvBookAmount > 0) {
        paymentStatus = newBooking.AdvBookAmount >= newBooking.totalAmount
          ? "Fully Paid"
          : "Partially Paid";
      }

      const bookingData = {
        ...newBooking,
        dates: selectedDates,
        status: "Approved",
        remainingAmount: newBooking.totalAmount - newBooking.AdvBookAmount,
        paymentStatus,
        userId: user?.uid,
        totalReceivedAmount: newBooking.AdvBookAmount,
        selectedAssets, // New: include selected assets
      };

      await saveBillingData(user.displayName, bookingData);

      setSuccessMessage("Booking confirmed for " + formatSelectedDates());
      setShowSuccessMessage(true);

      setNewBooking({
        name: "",
        contact: "",
        email: "",
        address: "",
        eventType: "",
        numberOfGuests: 0,
        additionalServices: "",
        specialRequests: "",
        requiresSetupAssistance: "",
        totalAmount: 0,
        paymentStatus: "",
        AdvBookAmount: 0,
        paidAmount: 0,
        billingId: "",
        totalReceivedAmount: 0,
      });
      setSelectedDates([]);
      setSelectedAssets({}); // Reset asset selections

      return true;
    } catch (error) {
      console.error("Error creating booking:", error);
      return false;
    } finally {
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
        selectedAssets,
        setSelectedAssets,
        loading,
        handleBookingSubmit,
        successMessage,
        showSuccessMessage,
        setShowSuccessMessage,
        setMarkedDates,
        isDateBooked,
        getBookingForDate,
        selectedBooking,
        setSelectedBooking,
        detailsModalVisible,
        setDetailsModalVisible,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
