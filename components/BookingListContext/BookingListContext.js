import React, { createContext, useEffect, useState, useCallback } from 'react';
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

  const handleCardPress = useCallback((item, navigation) => {

    try{
   setSelectedBooking(item);
    // console.log(item)
    // navigation.navigate("Billingdetails", { booking: item });
     navigation?.navigate("TabScreen", { booking: item })
    } catch (error) {
    console.error("Error navigating:", error);
    Alert.alert("Error", "Something went wrong opening this booking.");
  }
  }, []);

  const renderItem = useCallback(
    ({ item, navigation }) => (
      <HotelCard
        hotel={item}
        onPress={() => handleCardPress(item, navigation)}
      />
    ),
    [handleCardPress]
  );

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
        renderItem, // Expose renderItem for FlatList usage
      }}
    >
      {children}
    </BookingListContext.Provider>
  );
};

// Memoized HotelCard component
const HotelCard = React.memo(({ hotel, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{hotel.name}</Text>
      <Text>{hotel.paymentStatus}</Text>
    </TouchableOpacity>
  );
});
