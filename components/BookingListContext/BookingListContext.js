import React, { createContext, useEffect, useState, useContext } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore'; // Firebase imports
import { db } from '../../firebaseConfiguration/firebaseConfig';
import { useAuth } from '../Authprovider.js/AuthProvider';
import { onBillingDataChange } from '../../firebaseConfiguration/FirebaseCrud';

export const BookingListContext = createContext();

export const BookingListProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [billData, setBillData] = useState([]);
  const [filter, setFilter] = useState("all"); // Default filter is 'all'
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const  {user}  = useAuth(); // Get current logged-in user

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
  
    // Real-time listener for billings data specific to the logged-in user
    const handleBillingDataChange = (billingData) => {
   
      // Process the billing data and set it to both billData and hotels
      if (billingData) {
        const updatedBillData = Object?.values(billingData).map((billingItem) => ({
          id: billingItem.bookingId, // Assuming bookingId is present
          ...billingItem,
        }));
        setBillData(updatedBillData);
        setHotels(updatedBillData); // Update both hotels and billData
      } else {
        setBillData([]);
        setHotels([]);
      }
      setLoading(false); // Stop loading once data is fetched
    };
  
    // Start listening for changes in the client's billing data in real-time
    onBillingDataChange(user?.displayName, handleBillingDataChange);
  
    // Cleanup listener when the component unmounts or the user changes
    return () => {
      // Remove the listener if needed (cleanup)
    };
  }, [user]);
  
  // Filter hotels based on search and filter criteria
  useEffect(() => {
    let filtered = billData?.filter((hotel) =>
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
    console.log(status);
    setFilter(status);
   
  };

  // Handle card press for navigation
  const handleCardPress = (item, navigation) => {
    setSelectedBooking(item);
    console.log("item.key");
    console.log(item.key);
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
        filter
      }}
    >
      {children}
    </BookingListContext.Provider>
  );
};
