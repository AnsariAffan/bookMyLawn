import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Button, ActivityIndicator } from 'react-native';
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

  const [bookingsData, setBookingsData] = useState([10, 15, 20, 18, 30, 25, 40, 35, 28, 24, 22, 30]);
  const [revenueData, setRevenueData] = useState([5000, 2000, 8000, 7500, 10000, 9000, 12000, 11000, 9500, 8000, 6500, 7000]);
  const [filteredBookings, setFilteredBookings] = useState(bookingsData);
  const [filteredRevenue, setFilteredRevenue] = useState(revenueData);
  const [selectedFilter, setSelectedFilter] = useState('currentMonth');
  const [isModalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const { user, signOut } = useAuth();

  const [events, setEvents] = useState([
    { title: 'Wedding Anniversary', date: '2024-11-15' },
    { title: 'Corporate Event', date: '2024-11-20' },
    { title: 'Birthday Party', date: '2024-12-05' },
  ]);

  const renderUpcomingEvents = () => {
    return events.map((event, index) => (
      <View key={index} style={styles.eventCard}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventDate}>{event.date}</Text>
      </View>
    ));
  };

  const filterCurrentMonth = () => {
    setSelectedFilter('currentMonth');
    setFilteredBookings([bookingsData[currentMonth]]);
    setFilteredRevenue([revenueData[currentMonth]]);
    setModalVisible(false);
  };

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

  const filterByYear = (year) => {
    setSelectedFilter('year');
    setModalVisible(false);
  };

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

      {/* Show loader when data is loading */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {/* Bookings & Revenue Section */}
          <View style={styles.sideBySideContainer}>
            <View style={[styles.dataBox, { backgroundColor: 'rgba(100, 150, 255, 0.2)' }]}>
              <View style={styles.revenueContainer}>
                <Text style={styles.currencyText}>₹</Text>
                <Text style={styles.dataText}>{totalRevenue}</Text>
              </View>
              <Text style={styles.dataLabel}>Total Revenue</Text>
            </View>
          </View>

          {/* Total Bookings and Upcoming Events */}
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: -15, width: screenWidth / 1.1 }}>
          <View style={[styles.dataBox2, { marginRight: 2 }]}>
            <Text style={styles.dataText}>{currentMonthBookings}</Text>
            <Text style={styles.dataLabel}>Total Bookings</Text>
          </View>
        
          <View style={[styles.dataBox3, { marginLeft: 2 }]}>
            <Text style={styles.dataText}>{upcomingDatesInCurrentMonth}</Text>
            <Text style={styles.dataLabel}>Upcoming Events</Text>
          </View>
        </View>
        
 {/* Upcoming Events Section */}
 <View style={styles.section}>
 <Text style={styles.sectionTitle}>Upcoming Events</Text>
 <ScrollView horizontal showsHorizontalScrollIndicator={false}>
   {renderUpcomingEvents()}
 </ScrollView>
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

         
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between',marginTop:20},
  header: { fontSize: 24, fontWeight: 'bold' },
  dotsButton: { padding: 5 },
  dotsText: { fontSize: 20 },
  dataLabe2: { fontSize: 16, color: 'gray',marginBottom:5 },
  loaderContainer: { justifyContent: 'center', alignItems: 'center', flex: 1 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 8 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  sideBySideContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  dataBox: { flex: 1, padding: 16, backgroundColor: 'lightgray', borderRadius: 8 },
  revenueContainer: { flexDirection: 'row', justifyContent: 'left', alignItems: 'center', },
  currencyText: { fontSize: 35, fontWeight: 'bold', marginRight: 5 },
  dataText: { fontSize: 30, fontWeight: 'bold' },
  dataLabel: { textAlign: 'left', marginTop: 8 },
  dataBox2: { flex: 1, padding: 16, backgroundColor: '#dde8ff', borderRadius: 8 },
  dataBox3: { flex: 1, padding: 16, backgroundColor: '#c9f8d7', borderRadius: 8 },
  section: { marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  eventCard: { backgroundColor: '#f5f5f5', padding: 10, margin: 5, borderRadius: 8 },
  eventTitle: { fontSize: 16, fontWeight: 'bold' },
  eventDate: { fontSize: 14, color: 'gray' },
});

export default Dashboard;
