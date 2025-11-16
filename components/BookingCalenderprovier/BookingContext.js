import React, { createContext, useState, useEffect } from "react";
import moment from "moment";
import { useAuth } from "../Authprovider.js/AuthProvider";
import {
  onBillingDataChange,
  saveBillingData,
} from "../../firebaseConfiguration/FirebaseCrud";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDates, setSelectedDates] = useState([]);

  const [newBooking, setNewBooking] = useState({
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
    assets: [],
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  const { user } = useAuth();

  /* -------------------------------------------------
     Fetch Booking Data from Firebase
  -------------------------------------------------- */
  useEffect(() => {
    if (!user?.uid) {
      setBookings([]);
      setMarkedDates({});
      return;
    }

    const handleBillingData = (billingData) => {
      if (!billingData) {
        setBookings([]);
        setMarkedDates({});
        return;
      }

      const bookingArray = Object.entries(billingData).map(
        ([id, data]) => ({ id, ...data })
      );

      setBookings(bookingArray);

      const datesMap = {};
      bookingArray.forEach((booking) => {
        booking.dates?.forEach((date) => {
          datesMap[date] = {
            customStyles: {
              container: { backgroundColor: "#4DB6AC" },
              text: { color: "#000" },
            },
          };
        });
      });

      setMarkedDates(datesMap);
    };

    onBillingDataChange(user.displayName, handleBillingData);
  }, [user?.uid]);

  /* -------------------------------------------------
     Helpers
  -------------------------------------------------- */
  const isDateBooked = (date) => Boolean(markedDates[date]);

  const getBookingForDate = (date) =>
    bookings.find((b) => b.dates?.includes(date)) || null;

  const formatSelectedDates = () => {
    const grouped = selectedDates.reduce((acc, date) => {
      const monthYear = moment(date).format("MMM YYYY");
      const day = moment(date).format("D");
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(day);
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([month, days]) => `${month}: ${days.join(", ")}`)
      .join(" | ");
  };

  /* -------------------------------------------------
     Submit Booking
  -------------------------------------------------- */
  const handleBookingSubmit = async () => {
    try {
      setLoading(true);

      let paymentStatus = "Not Paid";
      if (newBooking.AdvBookAmount > 0) {
        paymentStatus =
          newBooking.AdvBookAmount >= newBooking.totalAmount
            ? "Fully Paid"
            : "Partially Paid";
      }

      const bookingData = {
        ...newBooking,
        paymentStatus,
        totalReceivedAmount:
          newBooking.totalReceivedAmount || newBooking.AdvBookAmount,
        dates: selectedDates,
        status: "Approved",
        remainingAmount: newBooking.totalAmount - newBooking.AdvBookAmount,
        userId: user?.uid,
        createdAt: new Date().toISOString(),
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
        assets: [],
      });

      setSelectedDates([]);

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
