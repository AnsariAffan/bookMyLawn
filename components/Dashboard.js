import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';

const screenWidth = Dimensions.get('window').width;

const Dashboard = () => {
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
        <Text style={styles.header}>Dashboard</Text>
        {/* Three Dots for Filter */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.dotsButton}>
          <Text style={styles.dotsText}>•••</Text>
        </TouchableOpacity>
      </View>

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
        {/* Total Bookings */}
        <View style={styles.dataBox}>
          <Text style={styles.dataText}>{filteredBookings.reduce((a, b) => a + b, 0)}</Text>
          <Text style={styles.dataLabel}>Total Bookings</Text>
        </View>

        {/* Total Revenue */}
        <View style={styles.dataBox}>
          <Text style={styles.dataText}>₹{filteredRevenue.reduce((a, b) => a + b, 0).toFixed(2)}</Text>
          <Text style={styles.dataLabel}>Total Revenue</Text>
        </View>
      </View>

      {/* Revenue vs Time Graph */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue vs Time (Monthly)</Text>
        <LineChart
          data={{
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{ data: filteredRevenue, strokeWidth: 2 }],
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
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dotsButton: { padding: 10 },
  dotsText: { fontSize: 20 },
  sideBySideContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  dataBox: { backgroundColor: '#ffff', padding: 20, borderRadius: 10, alignItems: 'center', width: (screenWidth - 60) / 2, marginVertical: 10 },
  dataText: { fontSize: 32, fontWeight: '700', color: '#333' },
  dataLabel: { fontSize: 16, color: '#777' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 22, fontWeight: '600', marginBottom: 10 },
  eventCard: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8 },
  eventTitle: { fontSize: 18, fontWeight: '600' },
  eventDate: { fontSize: 16, color: '#555' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 20 },
});

export default Dashboard;
