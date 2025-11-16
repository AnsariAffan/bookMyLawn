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

  /* --------------------------------------------------
      🔥 REALTIME LISTENER — FIXED (uses Firebase keys)
  ---------------------------------------------------- */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const handleBillingDataChange = (billingData) => {
      const updated = billingData
        ? Object.entries(billingData).map(([key, item]) => ({
            id: key,           // ✅ FIXED (use firebase key)
            ...item,
          }))
        : [];

      setBillData(updated);     // always updates list
      setLoading(false);
    };

    const unsubscribe = onBillingDataChange(
      user?.displayName,
      handleBillingDataChange
    );

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user]);

  /* --------------------------------------------------
      🔍 SEARCH + FILTER
  ---------------------------------------------------- */
  useEffect(() => {
    const filtered = billData.filter((hotel) => {
      const matchSearch = hotel.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchFilter =
        filter === "all" ||
        hotel.paymentStatus?.toLowerCase() === filter.toLowerCase();

      return matchSearch && matchFilter;
    });

    setFilteredHotels(filtered);
  }, [search, filter, billData]);

  /* --------------------------------------------------
      HANDLERS
  ---------------------------------------------------- */
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

  /* --------------------------------------------------
      DUMMY CARD (you modify UI here if needed)
  ---------------------------------------------------- */
  const renderItem = useCallback(
    ({ item }) => (
      <HotelCard
        hotel={item}
        onPress={() => handleCardPress(item)}
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
        renderItem,
        selectedBooking,
      }}
    >
      {children}
    </BookingListContext.Provider>
  );
};

/* --------------------------------------------------
    🔥 FIXED — Memoized card (always re-renders on update)
---------------------------------------------------- */
const HotelCard = React.memo(
  ({ hotel, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text>{hotel.name}</Text>
      <Text>{hotel.paymentStatus}</Text>
    </TouchableOpacity>
  ),
  (prev, next) => prev.hotel.id === next.hotel.id
);
