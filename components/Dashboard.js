import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useAuth } from './Authprovider.js/AuthProvider';
import { useBookings } from './utility/useBookings';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {


  const { userBookings, 
    totalRevenue, 
    bookingsByMonth, 
    upcomingEventDates, 
    currentMonthBookings, 
    upcomingDatesInCurrentMonth, 
    loading, 
    revenueByMonth,
    error  } = useBookings();
  
    useEffect(() => {
      console.log("User Bookings:", userBookings);
      console.log("Revenue By Month:", revenueByMonth);
      console.log("Total Revenue:", totalRevenue);
      console.log("Bookings By Month:", bookingsByMonth);
      console.log("Upcoming Event Dates:", upcomingEventDates);
      console.log("Current Month Bookings:", currentMonthBookings);
      console.log("Upcoming Dates In Current Month:", upcomingDatesInCurrentMonth);
      console.log("Loading State:", loading);
      console.log("Error State:", error);
    }, [
      userBookings,
      totalRevenue,
      bookingsByMonth,
      upcomingEventDates,
      currentMonthBookings,
      upcomingDatesInCurrentMonth,
      revenueByMonth,
      loading,
      error
    ]);
    

  // Static data for now, replace with real data from backend
  const [bookingsData, setBookingsData] = useState([10, 15, 20, 18, 30, 25, 40, 35, 28, 24, 22, 30]); // Bookings per month
  const [revenueData, setRevenueData] = useState([5000, 2000, 8000, 7500, 10000, 9000, 12000, 11000, 9500, 8000, 6500, 7000]); // Revenue per month
  const [filteredBookings, setFilteredBookings] = useState(bookingsData);
  const [filteredRevenue, setFilteredRevenue] = useState(revenueData);
  const [selectedFilter, setSelectedFilter] = useState('currentMonth'); // Possible values: 'currentMonth', 'monthRange', 'year'
  const [isModalVisible, setModalVisible] = useState(false); // Modal for filter options
  const [startDate, setStartDate] = useState(null); // To store start date for range
  const [endDate, setEndDate] = useState(null); // To store end date for range

  const currentMonth = new Date().getMonth(); // Get current month (0-11)
  const currentYear = new Date().getFullYear(); // Get current year
  const { user, signOut } = useAuth();
  // console.log(user?.email);
  // Static events data
  const [events, setEvents] = useState([
    { title: 'Wedding Anniversary', date: '2024-11-15' },
    { title: 'Corporate Event', date: '2024-11-20' },
    { title: 'Birthday Party', date: '2024-12-05' },
  ]);

  // Function to render upcoming events
  const renderUpcomingEvents = () => {
    return events.map((event, index) => (
      <View key={index} style={styles.eventCard}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDate}>{event.date}</Text>
      </View>
    ));
  };

  // Filter data for the current month
  const filterCurrentMonth = () => {
    setSelectedFilter('currentMonth');
    setFilteredBookings([bookingsData[currentMonth]]);
    setFilteredRevenue([revenueData[currentMonth]]);
    setModalVisible(false);
  };

  // Filter data for a specific month range (example: January to March)
  const filterMonthRange = () => {
    if (startDate && endDate) {
      const startMonth = new Date(startDate).getMonth();
      const endMonth = new Date(endDate).getMonth();
      const filteredBookingsData = bookingsData.slice(startMonth, endMonth + 1);
      const filteredRevenueData = revenueData.slice(startMonth, endMonth + 1);
      setFilteredBookings(filteredBookingsData);
      setFilteredRevenue(filteredRevenueData);
      setModalVisible(false);
    }
  };

  // Filter data for a specific year (example: 2024)
  const filterByYear = (year) => {
    setSelectedFilter('year');
    // Example: You can have data for different years' worth of data, filter the data accordingly
    setModalVisible(false);
  };

  // Function to reset filters
  const resetFilters = () => {
    setSelectedFilter('currentMonth');
    setFilteredBookings(bookingsData);
    setFilteredRevenue(revenueData);
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Hi,{user?.email.slice(0,-10)}</Text>
        
        {/* Three Dots for Filter */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dotsButton}>
          <Text style={styles.dotsText}>•••</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.dataLabe2}>@Danish Lawn</Text>
      {/* Filter Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Filter</Text>
            <Button title="Current Month" onPress={filterCurrentMonth} />
            <Button title="Year-wise" onPress={() => filterByYear(currentYear)} />
            <Button title="Month Range" onPress={() => setStartDate(new Date())} />
            {startDate && (
              <Calendar
                markedDates={{
                  [startDate]: { selected: true, selectedColor: 'blue' },
                  [endDate]: { selected: true, selectedColor: 'green' },
                }}
                onDayPress={(day) => {
                  if (!startDate) {
                    setStartDate(day.dateString);
                  } else {
                    setEndDate(day.dateString);
                    filterMonthRange();
                  }
                }}
              />
            )}
            <Button title="Reset Filters" onPress={resetFilters} />
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Bookings & Revenue Section side by side */}
      <View style={styles.sideBySideContainer}>
        {/* Total Revenue */}
        <View style={[styles.dataBox, { backgroundColor: 'rgba(100, 150, 255, 0.2)' }]}>
          <View style={styles.revenueContainer}>
            <Text style={styles.currencyText}>₹</Text>
            <Text style={styles.dataText}>{totalRevenue}</Text>
          </View>
          <Text style={styles.dataLabel}>Total Revenue</Text>
        </View>
      </View>

      {/* Total Bookings Card */}
      <View style={{display:"flex",flexDirection:"row",justifyContent:"space-around",marginTop:-15,width:screenWidth/1.1}}>
      
      <View style={styles.dataBox2}>
        <Text style={styles.dataText}>{currentMonthBookings}</Text>
        <Text style={styles.dataLabel}>Total Bookings</Text>
      </View>

      {/* Upcoming Events Card */}
      <View style={styles.dataBox3}>
        <Text style={styles.dataText}>{upcomingDatesInCurrentMonth}</Text>
        <Text style={styles.dataLabel}>Upcoming Events</Text>
      </View>

      </View>

      {/* Revenue vs Time Graph */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue vs Time (Monthly)</Text>
        <LineChart
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{ data: filteredRevenue, strokeWidth: 1 }],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#eff3ff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </View>

      {/* Upcoming Events Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {renderUpcomingEvents()}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 0, marginTop: 20 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dotsButton: { padding: 10 },
  dotsText: { fontSize: 20 },
  sideBySideContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  dataBox: {
  backgroundColor: "lightgray", // Ensure this is being applied
  borderRadius: 15,
  padding: 20,
  borderRadius: 10,
  alignItems: 'left',
  width: screenWidth / 1.1,
  marginTop:10
 
},

  currencyText: { fontSize: 25, fontWeight: '700', color: '#333', paddingRight: 4,paddingTop:15 },
  dataText: { fontSize: 40, fontWeight: '700', color: '#333' },
  dataLabel: { fontSize: 16, color: '#777' },
  dataLabe2: { fontSize: 14, color: '#777' },
  dataBox2: {
    backgroundColor: '#FFB6C1', 
    borderRadius: 15, 
    padding: 20, 
    alignItems: 'center',
    //  width:"99%"
  },
  dataBox3: {
    backgroundColor: '#87CEFA', 
    borderRadius: 15, 
    padding: 20, 
    alignItems: 'center',
    // width:"99%"
  },

  revenueContainer: { flexDirection: 'row', alignItems: 'center' },
  section: { marginBottom: 20,marginTop:10 },
  sectionTitle: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
  eventCard: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8 },
  eventTitle: { fontSize: 18, fontWeight: '600' },
  eventDate: { fontSize: 16, color: '#555' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, width: screenWidth - 40, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
});

export default Dashboard;
