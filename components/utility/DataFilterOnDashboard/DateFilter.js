import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../Authprovider.js/AuthProvider';
import { useBillingData } from './BillingDataContext'; // Import the custom hook
import { onBillingDataChange } from '../../../firebaseConfiguration/FirebaseCrud'; // Import the real-time listener

const DateFilter = () => {
  const { user } = useAuth();
  const { setBillingData } = useBillingData(); // Use context to set billing data

  // Initialize selectedDate with current month and year
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1, // Current month (1-12)
    year: new Date().getFullYear(), // Current year
  });

  const [showPicker, setShowPicker] = useState(false);
  const [totalUpcomingDates, setTotalUpcomingDates] = useState(0); // Store the number of upcoming dates

  // Fetch data for the current month on component mount
  useEffect(() => {
    if (user?.displayName) {
      onBillingDataChange(user?.displayName, handleBillingDataUpdate);
    }
  }, [user]);

  const handleBillingDataUpdate = (billingData) => {
    if (billingData) {
      const { filteredData, totalRemainingAmount, totalReceivedAmount, totalBookings, upcomingDatesCount } = filterBillingDataByMonthYear(billingData, selectedDate?.month, selectedDate?.year);

      setBillingData({
        filteredData,
        totalRemainingAmount,
        totalReceivedAmount,
        totalBookings,
        totalUpcomingDates: upcomingDatesCount, // Update with the count of upcoming dates
      });
      setTotalUpcomingDates(upcomingDatesCount); // Update the state with the count of upcoming dates
    } else {

      console.log('No billing data available.');
    }
  };

  const handlePicker = () => {
    setShowPicker(true);
  };

  const onPickerChange = (event, date) => {
    if (date) {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      setSelectedDate({ month, year });
      fetchDataFromFirebase(month, year);
    }
    setShowPicker(false);
  };

  const fetchDataFromFirebase = async (month, year) => {
    try {
      if (user?.displayName) {
        onBillingDataChange(user.displayName, (billingData) => {
          if (billingData) {
            const { filteredData, totalRemainingAmount, totalReceivedAmount, totalBookings, upcomingDatesCount } = filterBillingDataByMonthYear(billingData, month, year);
            setTotalUpcomingDates(upcomingDatesCount); // Update the state with the count of upcoming dates

            setBillingData({
              filteredData,
              totalRemainingAmount,
              totalReceivedAmount,
              totalBookings,
              totalUpcomingDates: upcomingDatesCount, // Update with the count of upcoming dates
            });
          }
        });
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const filterBillingDataByMonthYear = (billingData, selectedMonth, selectedYear) => {
    const filteredData = [];
    let totalRemainingAmount = 0;
    let totalReceivedAmount = 0;
    let totalBookings = 0; // Initialize totalBookings counter
    let upcomingDatesCount = 0; // Initialize count of upcoming dates

    Object.values(billingData).forEach(item => {
      const date = new Date(item.dates[0]);
      const itemMonth = date.getMonth() + 1;
      const itemYear = date.getFullYear();

      // Check if the date matches the selected month and year
      if (itemMonth === selectedMonth && itemYear === selectedYear) {
        filteredData.push(item);
        totalRemainingAmount += parseFloat(item.remainingAmount);
        totalReceivedAmount += parseFloat(item.totalReceivedAmount);

        // Count bookings based on selected month and future bookings
        totalBookings += calculateCurrentMonthBookings([item], selectedMonth, selectedYear);
      }

      // Check for upcoming events, no matter the month/year
      if (isUpcomingEvent(date)) {
        upcomingDatesCount += 1;
      }
    });

    return {
      filteredData,
      totalRemainingAmount,
      totalReceivedAmount,
      totalBookings,
      upcomingDatesCount, // Return the count of upcoming events
    };
  };

  // Function to calculate bookings that are in the future or in the selected month
  const calculateCurrentMonthBookings = (data, selectedMonth, selectedYear) => {
    const currentDate = new Date();
    const currentMonth = selectedMonth - 1; // 0-indexed month
    const currentYear = selectedYear;

    return data.reduce((total, booking) => {
      const eventDate = new Date(booking.dates[0]);
      const bookingMonth = eventDate.getMonth();
      const bookingYear = eventDate.getFullYear();

      // Check if the booking is in the selected month or in the future
      if (
        (bookingYear === currentYear && bookingMonth === currentMonth) || // Selected month
        eventDate > currentDate // Future dates
      ) {
        return total + 1;
      }
      return total;
    }, 0);
  };

  // Function to check if the event is upcoming
  const isUpcomingEvent = (eventDate) => {
    const currentDate = new Date();
    eventDate.setHours(0, 0, 0, 0); // Set event date to midnight (ignoring time part)
    currentDate.setHours(0, 0, 0, 0); // Set current date to midnight (ignoring time part)

    return eventDate > currentDate; // Event is after today's date
  };

  // Function to get the name of the month based on the month number
  const getMonthName = (monthNumber) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNumber - 1]; // Adjust because monthNumber is 1-based
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePicker} style={styles.calendarButton}>
        <Icon name="calendar-today" size={30} color="#000" />
        <Text style={styles.buttonText}>
          {getMonthName(selectedDate.month).slice(0,3)} {selectedDate.year}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={new Date(selectedDate.year, selectedDate.month - 1)} // Use selected month and year
          mode="date"
          display="default"
          onChange={onPickerChange}
        />
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop:12,
    paddingLeft:60
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 8,
    marginBottom: 20,
    marginTop:20
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  selectedMonthContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  selectedMonthText: {
    fontSize: 16,
    marginBottom: 10,
  },
  upcomingDatesContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  upcomingDatesText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default DateFilter;
