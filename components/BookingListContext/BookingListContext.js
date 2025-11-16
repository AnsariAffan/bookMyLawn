import React, {
  createContext,
  useEffect,
  useState,
  useCallback
} from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import { useAuth } from "../Authprovider.js/AuthProvider";
import { onBillingDataChange } from "../../firebaseConfiguration/FirebaseCrud";

export const BookingListContext = createContext();

export const BookingListProvider = ({ children }) => {
  const [search, setSearch] = useState("");
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [billData, setBillData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { user } = useAuth();

  /* -------------------------------------------
      Fetch Billing Data (Firebase Listener)
  -------------------------------------------- */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const handleBillingDataChange = (billingData) => {
      const updated = billingData
        ? Object.values(billingData).map((item) => ({
            id: item.bookingId,
            ...item,
          }))
        : [];

      setBillData(updated);
      setLoading(false);
    };

    const unsubscribe = onBillingDataChange(
      user?.displayName,
      handleBillingDataChange
    );

    return () => {
      // In case your Firebase function returns unsubscribe
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user]);

  /* -------------------------------------------
      Search + Filter Logic
  -------------------------------------------- */
  useEffect(() => {
    const filtered = billData.filter((hotel) => {
      const matchesSearch = hotel.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        hotel.paymentStatus?.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });

    setFilteredHotels(filtered);
  }, [search, filter, billData]);

  /* -------------------------------------------
      Handlers
  -------------------------------------------- */
  const handleSearch = (text) => setSearch(text);
  const handleFilterChange = (status) => setFilter(status);

  const handleCardPress = useCallback((item, navigation) => {
    try {
      setSelectedBooking(item);
      navigation?.navigate("TabScreen", { booking: item });
    } catch (error) {
      console.error("Navigation Error:", error);
      Alert.alert("Error", "Something went wrong opening this booking.");
    }
  }, []);

  /* -------------------------------------------
      FlatList Render Item
  -------------------------------------------- */
  const renderItem = useCallback(
    ({ item, navigation }) => (
      <HotelCard hotel={item} onPress={() => handleCardPress(item, navigation)} />
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
        renderItem,
        selectedBooking,
      }}
    >
      {children}
    </BookingListContext.Provider>
  );
};

/* -------------------------------------------
    Memoized HotelCard
-------------------------------------------- */
const HotelCard = React.memo(({ hotel, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{hotel.name}</Text>
    <Text>{hotel.paymentStatus}</Text>
  </TouchableOpacity>
));
