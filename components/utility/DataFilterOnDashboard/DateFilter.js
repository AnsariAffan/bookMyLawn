import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../Authprovider.js/AuthProvider';
import { useBillingData } from './BillingDataContext'; // Import the custom hook
import { onBillingDataChange } from '../../../firebaseConfiguration/FirebaseCrud'; // Import the real-time listener
import { Picker } from "@react-native-picker/picker";

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
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Fetch data for the current month on component mount
  useEffect(() => {
    if (user?.displayName) {
      onBillingDataChange(user?.displayName, handleBillingDataUpdate);
    }
  }, [user]);

  useEffect(() => {
    if (user?.displayName) {
      fetchDataFromFirebase(selectedDate.month, selectedDate.year); // Fetch data when selectedDate changes
    }
  }, [user, selectedDate]);

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
      setSelectedDate({ month, year }); // Update selectedDate state
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

  const handleMonthChange = (month) => setSelectedMonth(month);
  const handleYearChange = (year) => setSelectedYear(year);

  const handleApplyFilter = () => {
    if (selectedMonth && selectedYear) {
      const month = parseInt(selectedMonth);
      const year = parseInt(selectedYear);
      setSelectedDate({ month, year });
      fetchDataFromFirebase(month, year); // Fetch data for the selected month and year
    }
    setFilterModalVisible(false);
  };

  const handleClearFilter = () => {
    setSelectedMonth("");
    setSelectedYear("");
    setSelectedDate({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    fetchDataFromFirebase(new Date().getMonth() + 1, new Date().getFullYear()); // Reset to current month and year
    setFilterModalVisible(false);
  };

  // Replace numeric month labels with month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={styles.calendarButton}>
        <Icon name="calendar-today" size={30} color="#000" />
        <Text style={styles.buttonText}>
          {getMonthName(selectedDate.month).slice(0,3)} {selectedDate.year}
        </Text>
      </TouchableOpacity>

      <Modal visible={filterModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.filterModal}>
            <Text style={styles.modalTitle}>Filter by Date</Text>

            <Text style={styles.filterLabel}>Month</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={handleMonthChange}
                style={styles.picker}
              >
                <Picker.Item label="Select Month" value="" />
                {monthNames.map((name, index) => (
                  <Picker.Item key={index} label={name} value={`${index + 1}`} />
                ))}
              </Picker>
            </View>

            <Text style={styles.filterLabel}>Year</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={handleYearChange}
                style={styles.picker}
              >
                <Picker.Item label="Select Year" value="" />
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <Picker.Item key={year} label={`${year}`} value={`${year}`} />;
                })}
              </Picker>
            </View>

            <View style={styles.filterButtons}>
            <TouchableOpacity onPress={handleClearFilter} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleApplyFilter} style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      </Modal>

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
    paddingLeft:70
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
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
    fontSize: 15,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  filterModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 10,
  },
  picker: {
    height: 40,
    backgroundColor: "#F5F5F5",
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  clearButton: {
    backgroundColor: "#EF5350",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default DateFilter;
