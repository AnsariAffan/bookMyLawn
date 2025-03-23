import React, { createContext, useEffect, useState } from 'react';
import { useAuth } from '../Authprovider.js/AuthProvider';
import { onBillingDataChange } from '../../firebaseConfiguration/FirebaseCrud';

export const BookingListContext = createContext();

export const BookingListProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [billData, setBillData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const handleBillingDataChange = (billingData) => {
      const updatedBillData = billingData
        ? Object.values(billingData).map((billingItem) => ({
            id: billingItem.bookingId,
            ...billingItem,
          }))
        : [];
      setBillData(updatedBillData);
      setHotels(updatedBillData);
      setLoading(false);
    };

    onBillingDataChange(user?.displayName, handleBillingDataChange);

    return () => {
      // Cleanup logic if needed
    };
  }, [user]);

  useEffect(() => {
    const filtered = billData.filter((hotel) => {
      const matchesSearch = hotel.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || hotel.paymentStatus.toLowerCase() === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
    setFilteredHotels(filtered);
  }, [search, filter, billData]);

  const handleSearch = (text) => setSearch(text);

  const handleFilterChange = (status) => setFilter(status);

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
        filter,
      }}
    >
      {children}
    </BookingListContext.Provider>
  );
};
