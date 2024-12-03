import { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export function useBookings() {
  const [userBookings, setUserBookings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [bookingsByMonth, setBookingsByMonth] = useState({});
  const [revenueByMonth, setRevenueByMonth] = useState({});
  const [upcomingEventDates, setUpcomingEventDates] = useState([]);
  const [currentMonthBookings, setCurrentMonthBookings] = useState(0);
  const [upcomingDatesInCurrentMonth, setUpcomingDatesInCurrentMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();
    const loggedInUserId = auth.currentUser ? auth.currentUser.uid : null;

    // If no user is logged in, set error and stop loading
    if (!loggedInUserId) {
      setError("No user is logged in.");
      setLoading(false);
      return;
    }

    const bookingsCollection = collection(db, "billings");
    const userBookingsQuery = query(bookingsCollection, where("userId", "==", loggedInUserId));

    setLoading(true); // Start loading

    const unsubscribe = onSnapshot(userBookingsQuery, (querySnapshot) => {
      const bookings = querySnapshot.docs.map(doc => doc.data());
      setUserBookings(bookings);

      // Calculate necessary data
      setTotalRevenue(calculateTotalRevenue(bookings, loggedInUserId));
      setBookingsByMonth(calculateBookingsByMonth(bookings));
      setRevenueByMonth(calculateRevenueByMonth(bookings));
      setUpcomingEventDates(getUpcomingEventDates(bookings));
      setCurrentMonthBookings(calculateCurrentMonthBookings(bookings));
      setUpcomingDatesInCurrentMonth(getUpcomingDatesInCurrentMonth(bookings));

      setLoading(false); // Set loading to false once data is fetched

    }, (err) => {
      console.error("Error listening to Firestore updates:", err);
      setError("Failed to fetch booking data.");
      setLoading(false); // Stop loading even if there's an error
    });

    return () => unsubscribe();

  }, []); // Empty dependency array

  // Function to calculate total revenue
  const calculateTotalRevenue = (data, loggedInUserId) => {
    return data.reduce((total, booking) => {
      if (booking.userId === loggedInUserId) {
        const receivedAmount = parseFloat(booking.totalReceivedAmount) || 0;
        return total + receivedAmount;
      }
      return total;
    }, 0);
  };

  // Function to calculate revenue by month
  const calculateRevenueByMonth = (data) => {
    return data.reduce((result, booking) => {
      const eventDate = booking.dates && booking.dates[0]; // Extract the first date of the booking
      const receivedAmount = parseFloat(booking.totalReceivedAmount) || 0; // Parse the revenue amount safely
  
      if (eventDate && receivedAmount) {
        const month = new Date(eventDate).getMonth() + 1; // Convert date to a 1-based month
        if (!result[month]) {
          result[month] = 0; // Initialize month key if not already present
        }
        result[month] += receivedAmount; // Add the received amount for that month
      }
      return result; // Return the accumulated result
    }, {});
  };

  const calculateBookingsByMonth = (data) => {
    return data.reduce((result, booking) => {
      const eventDate = booking.dates && booking.dates[0];
      if (eventDate) {
        const month = new Date(eventDate).getMonth() + 1;
        if (!result[month]) {
          result[month] = 0;
        }
        result[month]++;
      }
      return result;
    }, {});
  };

  const getUpcomingEventDates = (data) => {
    const currentDate = new Date();
    return data.filter(booking => {
      const eventDate = new Date(booking.dates[0]);
      return eventDate > currentDate; 
    }).map(booking => booking.dates[0]);
  };

  const calculateCurrentMonthBookings = (data) => {
    const currentMonth = new Date().getMonth(); 
    return data.reduce((total, booking) => {
      const eventDate = booking.dates && booking.dates[0];
      if (eventDate) {
        const bookingMonth = new Date(eventDate).getMonth(); 
        if (bookingMonth === currentMonth) {
          return total + 1;
        }
      }
      return total;
    }, 0);
  };

  const getUpcomingDatesInCurrentMonth = (data) => {
    const currentMonth = new Date().getMonth();
    const currentDate = new Date();
    const upcomingDates = data.filter(booking => {
      const eventDate = new Date(booking.dates[0]);
      const bookingMonth = eventDate.getMonth();
      return bookingMonth === currentMonth && eventDate > currentDate;
    });
    return upcomingDates.length;
  };

  return { 
    userBookings, 
    totalRevenue, 
    bookingsByMonth, 
    revenueByMonth, 
    upcomingEventDates, 
    currentMonthBookings, 
    upcomingDatesInCurrentMonth, 
    loading, 
    error 
  };
}
