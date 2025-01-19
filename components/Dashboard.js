import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Calendar } from "react-native-calendars";
import { useAuth } from "./Authprovider.js/AuthProvider";
import { useBookings } from "./utility/useBookings";
import { Avatar } from "react-native-paper";
import { auth } from "../firebaseConfiguration/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
// Get device dimensions
const { width, height } = Dimensions.get("window");

const Dashboard = () => {

  
  const {
    userBookings,
    totalRevenue,
    bookingsByMonth,
    upcomingEventDates,
    currentMonthBookings,
    upcomingDatesInCurrentMonth,
    loading,
    revenueByMonth,
    error,
  } = useBookings();

  useEffect(() => {
    console.log("User Bookings:", userBookings);
    console.log("Revenue By Month:", revenueByMonth);
    console.log("Total Revenue:", totalRevenue);
    console.log("Bookings By Month:", bookingsByMonth);
    console.log("Upcoming Event Dates:", upcomingEventDates);
    console.log("Current Month Bookings:", currentMonthBookings);
    console.log(
      "Upcoming Dates In Current Month:",
      upcomingDatesInCurrentMonth
    );
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
    error,
  ]);

  // const [bookingsData, setBookingsData] = useState([
  //   10, 15, 20, 18, 30, 25, 40, 35, 28, 24, 22, 30,
  // ]);
  const [revenueData, setRevenueData] = useState([
    5000, 2000, 8000, 7500, 10000, 9000, 12000, 11000, 9500, 8000, 6500, 7000,
  ]);
  // const [filteredBookings, setFilteredBookings] = useState(bookingsData);
  const [filteredRevenue, setFilteredRevenue] = useState(revenueData);
  // const [selectedFilter, setSelectedFilter] = useState("currentMonth");
  // const [isModalVisible, setModalVisible] = useState(false);
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);

  // const currentMonth = new Date().getMonth();
  // const currentYear = new Date().getFullYear();

  // const [events, setEvents] = useState([
  //   { title: "Wedding Anniversary", date: "2024-11-15" },
  //   { title: "Corporate Event", date: "2024-11-20" },
  //   { title: "Birthday Party", date: "2024-12-05" },
  // ]);

  const renderUpcomingEvents = () => {
    // Log upcomingEventDates to ensure data is in the expected format
    console.log("Upcoming Event Dates:", upcomingEventDates);

    return upcomingEventDates?.map((event, index) => {
      // Check if event is a valid string (date string) before proceeding
      if (typeof event !== "string" || !event) {
        console.log(`Invalid event data at index ${index}:`, event);
        return null; // Skip invalid events
      }

      // Convert the event string to a Date object
      const eventDate = new Date(event);

      // Check if the eventDate is valid
      if (isNaN(eventDate)) {
        console.log(`Invalid date at index ${index}:`, event);
        return null; // Skip invalid dates
      }

      const dayOfWeek = eventDate?.getDay(); // Get the day of the week (0=Sunday, 1=Monday, etc.)

      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = daysOfWeek[dayOfWeek]; // Get the corresponding day name

      return (
        <View key={index} style={styles.eventCard}>
          {/* Ensure all text is wrapped inside a <Text> component */}
          <Text style={styles.eventTitle}>{dayName}</Text>
          <Text style={styles.eventDate}>{eventDate.toLocaleDateString()}</Text>
        </View>
      );
    });
  };


  const navigation = useNavigation();
  const [user, setUser] = useState(null);  // State to hold user data
  const [image, setImage] = useState(null);  // State to hold user image
  
  useEffect(() => {
    // Listen for changes to authentication state
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // Update user state when user data changes
        setImage(currentUser.photoURL);  // Update image if changed
      } else {
        setUser(null);  // Reset if user is logged out
      }
    });

    return unsubscribe;  // Cleanup the listener on unmount
  }, []);  // Empty dependency array ensures this effect runs once when component mounts


  useEffect(() => {
    // Fetch user data when the component mounts
    if (user && user.photoURL) {
      setImage(user?.photoURL); // Set the user's photo URL if available
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Hi,{user?.displayName}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={styles.dotsButton}
        >
          <Avatar.Image size={35} source={{ uri: image }} />
        </TouchableOpacity>
      </View>

      {/* <Text style={{  }}>@Danish Lawn</Text> */}

      {/* Filter Modal */}
      {/*
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
*/}
      {/* Show loader when data is loading */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {/* Bookings & Revenue Section */}
          <View style={styles.sideBySideContainer}>
            <View style={[styles.dataBox, { backgroundColor: "#ffff" }]}>
              <View style={styles.revenueContainer}>
                <Text style={styles.currencyText}>₹</Text>
                <Text style={styles.dataText}>{totalRevenue}</Text>
              </View>
              <Text style={styles.dataLabel}>Total Revenue</Text>
            </View>
          </View>

          {/* Total Bookings and Upcoming Events */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: -15,
              width: width / 1.1,
            }}
          >
            <View style={[styles.dataBox2, { marginRight: 3 }]}>
              <Text style={styles.dataText}>{currentMonthBookings}</Text>
              <Text style={styles.dataLabel}>Total Bookings</Text>
            </View>

            <View style={[styles.dataBox3, { marginLeft: 5 }]}>
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
                labels: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                datasets: [{ data: filteredRevenue, strokeWidth: 1 }],
              }}
              width={width - 30}
              height={200}
              chartConfig={{
                backgroundColor: "#1cc910",
                backgroundGradientFrom: "#eff3ff",
                backgroundGradientTo: "#eff3ff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
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
  container: {
    flex: 1,
    padding: width * 0.03, // Dynamic padding based on screen width
    backgroundColor: "#F5F5F5",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.02, // Dynamic margin based on screen height
  },
  header: {
    marginTop:height*0.02,
    fontSize: width * 0.07, // Adjust font size based on screen width
    fontWeight: "bold",
  },
  dotsButton: {
  
    marginTop:height*0.02, // Dynamic margin
    marginBottom:10
  },
 
  dataLabel2: {
    fontSize: width * 0.04, // Adjust font size based on screen width
    color: "gray",
    marginBottom: height * 0.02, // Dynamic margin bottom based on height
    fontStyle: "normal",
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: width * 0.05, // Dynamic padding based on width
    borderRadius: 20,
  },
  modalTitle: {
    fontSize: width * 0.05, // Dynamic font size
    fontWeight: "bold",
    marginBottom: height * 0.02, // Dynamic margin based on height
  },
  sideBySideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.03, // Dynamic margin bottom
  },
  icon: {
    width: width * 0.12, // Dynamic width based on screen size
    height: width * 0.12, // Dynamic height based on screen size
    borderRadius: (width * 0.12) / 2, // Ensuring circular shape
    marginTop: height * 0.01, // Dynamic margin top based on height
  },
  dataBox: {
    flex: 1,
    padding: width * 0.05, // Dynamic padding based on width
    backgroundColor: "#ffffff", // White background for the card
    borderRadius: 20, // Rounded corners
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (slightly below)
    shadowOpacity: 0.1, // Light shadow opacity
    shadowRadius: 6, // Soft shadow
    elevation: 3, // For Android (elevation gives a 3D effect)
  },
  revenueContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  currencyText: {
    fontSize: width * 0.08, // Dynamic font size
    fontWeight: "bold",
    marginRight: 5,
  },
  dataText: {
    fontSize: width * 0.07, // Dynamic font size
    fontWeight: "bold",
  },
  dataLabel: {
    textAlign: "left",
    marginTop: height * 0.01, // Dynamic margin top
    color: "#00509E",
    fontSize: width * 0.04, // Dynamic font size
  },
  dataBox2: {
    flex: 1,
    padding: width * 0.05, // Dynamic padding based on width
    backgroundColor: "#ffffff", // White background for the card
    borderRadius: 20, // Rounded corners
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (slightly below)
    shadowOpacity: 0.1, // Light shadow opacity
    shadowRadius: 6, // Soft shadow
    elevation: 3, // For Android (elevation gives a 3D effect)
  },
  dataBox3: {
    flex: 1,
    padding: width * 0.05, // Dynamic padding based on width
    backgroundColor: "#ffffff", // White background for the card
    borderRadius: 20, // Rounded corners
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (slightly below)
    shadowOpacity: 0.1, // Light shadow opacity
    shadowRadius: 6, // Soft shadow
    elevation: 3, // For Android (elevation gives a 3D effect)
  },
  section: {
    marginTop: height * 0.02, // Dynamic margin top
  },
  sectionTitle: {
    fontSize: width * 0.05, // Dynamic font size based on screen width
    fontWeight: "bold",
    marginBottom: height * 0.01, // Dynamic margin bottom
    fontStyle: "normal",
  },
  eventCard: {
    backgroundColor: "#ffff",
    padding: width * 0.04, // Dynamic padding based on screen width
    margin: width * 0.02, // Dynamic margin
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  eventTitle: {
    fontSize: width * 0.05, // Dynamic font size based on screen width
    fontWeight: "bold",
  },
  eventDate: {
    fontSize: width * 0.04, // Dynamic font size based on screen width
    color: "gray",
  },
});

export default Dashboard;
