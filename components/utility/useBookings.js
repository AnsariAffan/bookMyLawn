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

  // Add state for month range
  const [startMonth, setStartMonth] = useState(0); // January
  const [endMonth, setEndMonth] = useState(11); // December

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

  }, [startMonth, endMonth]); // Dependencies now include month range

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

  // Function to calculate revenue by month based on the range
  const calculateRevenueByMonth = (data) => {
    return data.reduce((result, booking) => {
      const eventDate = booking.dates && booking.dates[0]; // Extract the first date of the booking
      const receivedAmount = parseFloat(booking.totalReceivedAmount) || 0; // Parse the revenue amount safely
  
      if (eventDate && receivedAmount) {
        const month = new Date(eventDate).getMonth(); // Get the 0-based month
        if (month >= startMonth && month <= endMonth) { // Only include months within the range
          if (!result[month + 1]) { // Adjust month to 1-based
            result[month + 1] = 0;
          }
          result[month + 1] += receivedAmount; // Add the received amount for that month
        }
      }
      return result; // Return the accumulated result
    }, {});
  };

  const calculateBookingsByMonth = (data) => {
    return data.reduce((result, booking) => {
      const eventDate = booking.dates && booking.dates[0];
      if (eventDate) {
        const month = new Date(eventDate).getMonth();
        if (month >= startMonth && month <= endMonth) {
          if (!result[month + 1]) {
            result[month + 1] = 0;
          }
          result[month + 1]++;
        }
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
    const currentDate = new Date(); // Get the current date
    const currentMonth = currentDate.getMonth(); // Get the current month
    const currentYear = currentDate.getFullYear(); // Get the current year
  
    return data.reduce((total, booking) => {
      const eventDate = booking.dates && booking.dates[0];
      if (eventDate) {
        const bookingDate = new Date(eventDate);
        const bookingMonth = bookingDate.getMonth();
        const bookingYear = bookingDate.getFullYear();
  
        // Check if the booking is in the current month or in the future
        if (
          (bookingYear === currentYear && bookingMonth === currentMonth) || // Current month
          bookingDate > currentDate // Future dates
        ) {
          return total + 1;
        }
      }
      return total;
    }, 0);
  };
  

  const getUpcomingDatesInCurrentMonth = (data) => {
    const currentDate = new Date();
    // Set the current date to midnight to ignore the time portion
    currentDate.setHours(0, 0, 0, 0); // This will set the time to 00:00:00
    
    const currentMonth = currentDate.getMonth(); // Get the current month (0-based)
    const currentYear = currentDate.getFullYear(); // Get the current year
  
    // Filter bookings that are in the current month and occur after the current date (ignoring time)
    const upcomingDates = data.filter(booking => {
      const eventDate = new Date(booking.dates[0]); // Get the event date from the booking
      const eventMonth = eventDate.getMonth(); // Get the month of the booking (0-based)
      const eventYear = eventDate.getFullYear(); // Get the year of the booking
      
      // Ensure that we're in the correct month and year, and that the event date is in the future
      return (
        eventYear === currentYear && // Same year
        eventMonth === currentMonth && // Same month
        eventDate > currentDate // Future date (ignoring the time part of the date)
      );
    });
    
    return upcomingDates.length+1; // Return the count of upcoming dates
  };
  
  

  // Function to set a new range of months
  const setMonthRange = (start, end) => {
    setStartMonth(start);
    setEndMonth(end);
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
    error,
    setMonthRange // Expose this function to allow setting a custom month range
  };
}
