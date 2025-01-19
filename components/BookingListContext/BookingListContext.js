import React, { createContext, useEffect, useState, useContext } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore'; // Firebase imports
import { db } from '../../firebaseConfiguration/firebaseConfig';
import { useAuth } from '../Authprovider.js/AuthProvider';

export const BookingListContext = createContext();

export const BookingListProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [billData, setBillData] = useState([]);
  const [filter, setFilter] = useState("all"); // Default filter is 'all'
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { user } = useAuth(); // Get current logged-in user

  // Fetch data based on user
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribeBookings = onSnapshot(
      query(collection(db, "billings"), where("userId", "==", user.uid)),
      (snapshot) => {
        const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBillData(bookings);
        setHotels(bookings); // Update both hotels and billData
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching bookings: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribeBookings();
  }, [user]);

  // Filter hotels based on search and filter criteria
  useEffect(() => {
    let filtered = billData.filter((hotel) =>
      hotel.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filter !== "all") {
      filtered = filtered.filter((hotel) =>
        hotel.paymentStatus.toLowerCase() === filter.toLowerCase()
      );
    }

    setFilteredHotels(filtered);
  }, [search, filter, billData]);

  // Handle search text change
  const handleSearch = (text) => {
    setSearch(text);
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilter(status);
  };

  // Handle card press for navigation
  const handleCardPress = (item, navigation) => {
    setSelectedBooking(item);
    navigation.navigate("BookingDetails", { booking: item });
  };

  return (
    <BookingListContext.Provider
      value={{
        search,
        filteredHotels,
        loading,
        handleSearch,
        handleFilterChange,
        handleCardPress,
      }}
    >
      {children}
    </BookingListContext.Provider>
  );
};
