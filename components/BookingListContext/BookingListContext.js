import React, { createContext, useEffect, useState, useContext } from 'react';
import { collection, onSnapshot } from 'firebase/firestore'; // Import necessary functions
import { db } from '../../firebaseConfiguration/firebaseConfig';
import { useAuth } from '../Authprovider.js/AuthProvider';

export const BookingListContext = createContext();

export const BookingListProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [billingDetails, setBillingDetails] = useState([]);
  const [filteredBillings, setFilteredBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Get the current logged-in user from AuthContext
  const { user } = useAuth(); // Assuming you have a useAuth hook to access user data

  // Fetch bookings data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return; // If no user is logged in, don't fetch the bookings
    }

    const unsubscribeHotels = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const fetchedHotels = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter hotels by current user
      const userBookings = fetchedHotels.filter((hotel) => hotel.userId === user.uid);
      setHotels(userBookings); // Set the filtered user-specific hotels
      setFilteredHotels(userBookings); // Also update the filtered hotels state
      setLoading(false); // Set loading to false after fetching data
    }, (error) => {
      console.error("Error fetching bookings: ", error);
      window.alert("Error fetching bookings: " + error.message);
      setLoading(false); // Ensure loading is set to false on error
    });

    // Cleanup listener for hotels on unmount
    return () => unsubscribeHotels();
  }, [user]); // Re-run when `user` changes

  // Fetch billing data and update hotel payment status
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return; // If no user is logged in, don't fetch the billings
    }

    const unsubscribeBillings = onSnapshot(collection(db, "billings"), (snapshot) => {
      const fetchedBillings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBillingDetails(fetchedBillings);

      // Update hotels with billing info
      setHotels((prevHotels) => {
        const updatedHotels = prevHotels.map((hotel) => {
          const billingInfo = fetchedBillings.find(billing => billing.bookingId === hotel.id);
          return {
            ...hotel,
            paymentStatus: billingInfo ? billingInfo.paymentStatus : "",
            totalAmount: billingInfo ? billingInfo.totalAmount : 0,
          };
        });

        setFilteredHotels(updatedHotels); // Update filtered hotels
        return updatedHotels;
      });

      setFilteredBillings(fetchedBillings);
      setLoading(false); // Set loading to false after fetching billings
    }, (error) => {
      console.error("Error fetching billings: ", error);
      window.alert("Error fetching billings: " + error.message);
      setLoading(false); // Ensure loading is set to false on error
    });

    // Cleanup listener for billings on unmount
    return () => unsubscribeBillings();
  }, [user]); // Re-run when `user` changes

  // Search filter handler
  const handleSearch = (text) => {
    setSearch(text);
    const filtered = hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredHotels(filtered);
  };

  // Filter billings based on payment status
  const filterBillings = (criteria) => {
    const filtered = billingDetails.filter((billing) =>
      billing.paymentStatus.toLowerCase().includes(criteria.toLowerCase())
    );
    setFilteredBillings(filtered);
  };

  // Handle navigation to booking details page
  const handleCardPress = (item, navigation) => {
    setSelectedBooking(item);
    navigation.navigate("BookingDetails", { booking: item });
  };

  return (
    <BookingListContext.Provider
      value={{
        search,
        setSearch,
        filteredHotels,
        setFilteredHotels,
        hotels,
        setHotels,
        billingDetails,
        filteredBillings,
        filterBillings,
        loading,
        setLoading,
        selectedBooking,
        setSelectedBooking,
        handleSearch,
        handleCardPress,
      }}
    >
      {children}
    </BookingListContext.Provider>
  );
};
