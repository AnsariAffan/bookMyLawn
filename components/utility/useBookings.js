import { getAuth } from "firebase/auth";
import { useEffect, useState, useMemo, useRef } from "react";
import { onBillingDataChange } from "../../firebaseConfiguration/FirebaseCrud";

export function useBookings() {
  const [userBookings, setUserBookings] = useState([]);
  const [totalReceivedAmounts, setTotalReceivedAmounts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [bookingsByMonth, setBookingsByMonth] = useState({});
  const [revenueByMonth, setRevenueByMonth] = useState(new Array(12).fill(0));
  const [upcomingEventDates, setUpcomingEventDates] = useState([]);
  const [currentMonthBookings, setCurrentMonthBookings] = useState(0);
  const [upcomingDatesInCurrentMonth, setUpcomingDatesInCurrentMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startMonth, setStartMonth] = useState(0); // January
  const [endMonth, setEndMonth] = useState(11); // December
  const [openAmountSum, setOpenAmountSum] = useState(0);

  // Store unsubscribe function
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const loggedInUserId = auth.currentUser?.uid || null;

    if (!loggedInUserId) {
      setError("No user is logged in.");
      setLoading(false);
      return;
    }

    setLoading(true);

    // Unsubscribe previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    // Set up new listener
    unsubscribeRef.current = onBillingDataChange(auth.currentUser.displayName, (data) => {
      if (data) {
        const bookings = Object.values(data);
      

        setUserBookings(bookings);

        const monthlyRevenue = calculateRevenueByMonth(bookings);
        setTotalReceivedAmounts(monthlyRevenue);

        setTotalRevenue(calculateTotalRevenue(bookings, loggedInUserId));
        setBookingsByMonth(calculateBookingsByMonth(bookings));
        setRevenueByMonth(monthlyRevenue);
        setUpcomingEventDates(getUpcomingEventDates(bookings));
        setCurrentMonthBookings(calculateCurrentMonthBookings(bookings));
        setUpcomingDatesInCurrentMonth(getUpcomingDatesInCurrentMonth(bookings));
        setOpenAmountSum(calculateOpenAmountSum(bookings));

        // Calculate current week bookings
        const weekBookings = getCurrentWeekBookings(bookings);
        setCurrentWeekBookings(weekBookings);
        console.log("Current week bookings:", weekBookings);
      } else {
        setUserBookings([]);
        setTotalReceivedAmounts([]);
        setTotalRevenue(0);
        setBookingsByMonth({});
        setRevenueByMonth(new Array(12).fill(0));
        setUpcomingEventDates([]);
        setCurrentMonthBookings(0);
        setUpcomingDatesInCurrentMonth(0);
        setOpenAmountSum(0);
        setCurrentWeekBookings([]);
      }
      setLoading(false);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [startMonth, endMonth]);

  const totalRevenueForSelectedRange = useMemo(() => {
    return revenueByMonth.slice(startMonth, endMonth + 1).reduce((acc, rev) => acc + rev, 0);
  }, [revenueByMonth, startMonth, endMonth]);

  const calculateTotalRevenue = (data, loggedInUserId) => {
    return data.reduce((total, booking) => {
      if (booking.userId === loggedInUserId) {
        return total + (parseFloat(booking.totalReceivedAmount) || 0);
      }
      return total;
    }, 0);
  };

  const calculateRevenueByMonth = (data) => {
    const monthlyRevenue = new Array(12).fill(0);
    data.forEach((booking) => {
      const eventDate = booking.dates?.[0];
      const receivedAmount = parseFloat(booking.totalReceivedAmount) || 0;
      if (eventDate && receivedAmount) {
        const month = new Date(eventDate).getMonth();
        monthlyRevenue[month] += receivedAmount;
      }
    });
    return monthlyRevenue;
  };

  const calculateBookingsByMonth = (data) => {
    return data.reduce((result, booking) => {
      const eventDate = booking.dates?.[0];
      if (eventDate) {
        const month = new Date(eventDate).getMonth();
        if (month >= startMonth && month <= endMonth) {
          result[month + 1] = (result[month + 1] || 0) + 1;
        }
      }
      return result;
    }, {});
  };

  const getUpcomingEventDates = (data) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return data
      .filter(b => b.dates?.[0] && new Date(b.dates[0]).setHours(0,0,0,0) > now)
      .map(b => b.dates[0]);
  };

  const calculateCurrentMonthBookings = (data) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return data.reduce((total, booking) => {
      const bookingDate = booking.dates?.[0] ? new Date(booking.dates[0]) : null;
      if (!bookingDate) return total;
      const bookingMonth = bookingDate.getMonth();
      const bookingYear = bookingDate.getFullYear();
      if ((bookingYear === currentYear && bookingMonth === currentMonth) || bookingDate > now) {
        return total + 1;
      }
      return total;
    }, 0);
  };

  const getUpcomingDatesInCurrentMonth = (data) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return data.filter(b => {
      const bookingDate = b.dates?.[0] ? new Date(b.dates[0]) : null;
      if (!bookingDate) return false;
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate > now && bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
    }).length;
  };

  const formatDates = (dates) => {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    return dates?.map(d => {
      const date = new Date(d);
      return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    }).join(", ");
  };

  const setMonthRange = (start, end) => {
    setStartMonth(start);
    setEndMonth(end);
  };

  const calculateOpenAmountSum = (data) => {
    return data.reduce((total, booking) => total + (parseFloat(booking.remainingAmount) || 0), 0);
  };

  // Current week bookings
  const [currentWeekBookings, setCurrentWeekBookings] = useState([]);

  const getCurrentWeekBookings = (bookings) => {
    if (!Array.isArray(bookings)) return [];

    const now = new Date();

    const firstDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6); // Saturday
    lastDayOfWeek.setHours(23, 59, 59, 999);

    return bookings.filter((booking) => {
      const bookingDate = booking.dates?.[0] ? new Date(booking.dates[0]) : null;
      if (!bookingDate) return false;
      return bookingDate >= firstDayOfWeek && bookingDate <= lastDayOfWeek;
    });
  };

  return { 
    userBookings, 
    totalReceivedAmounts,
    totalRevenue, 
    bookingsByMonth, 
    revenueByMonth,
    upcomingEventDates, 
    currentMonthBookings, 
    upcomingDatesInCurrentMonth, 
    loading, 
    error,
    setMonthRange,
    formatDates,
    openAmountSum,
    totalRevenueForSelectedRange,
    currentWeekBookings // <-- now available
  };
}
