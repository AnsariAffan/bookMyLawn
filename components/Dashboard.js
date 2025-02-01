import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useBookings } from "./utility/useBookings";
import { Avatar, useTheme } from "react-native-paper"; // Import useTheme
import { auth } from "../firebaseConfiguration/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

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
    openAmountSum,
  } = useBookings();

  const [revenueData, setRevenueData] = useState([
    5000, 2000, 8000, 7500, 10000, 9000, 12000, 11000, 9500, 8000, 6500, 7000,
  ]);
  const [filteredRevenue, setFilteredRevenue] = useState(revenueData);

  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const theme = useTheme(); // Use the theme

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setImage(currentUser.photoURL);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user && user.photoURL) {
      setImage(user.photoURL);
    }
  }, [user]);

  const renderUpcomingEvents = () => {
     
    return upcomingEventDates?.map((event, index) => {
      if (typeof event !== "string" || !event) {
     
        return null;
      }

      const eventDate = new Date(event);
      if (isNaN(eventDate)) {
        return null;
      }

      const dayOfWeek = eventDate?.getDay();
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = daysOfWeek[dayOfWeek];

      return (
        <View key={index} style={[styles.eventCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.eventTitle, { color: theme.colors.text }]}>{dayName}</Text>
          <Text style={[styles.eventDate, { color: theme.colors.placeholder }]}>
            {eventDate.toLocaleDateString()}
          </Text>
        </View>
      );
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Hi, {user?.displayName}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={styles.dotsButton}
        >
          {image ? (
            <Avatar.Image size={40} source={{ uri: image }} />
          ) : (
            <Avatar.Image size={40} source={require('../assets/icons/icon.png')} />
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.container}>
            <View style={styles.sideBySideContainer}>
              <LinearGradient
                colors={['#6C63FF', '#8E85FF']}
                style={[styles.dataBox, { backgroundColor: theme.colors.primary }]}
              >
                <View style={styles.revenueContainer}>
                  <Text style={styles.currencyText}>₹</Text>
                  <Text style={styles.dataText}>{totalRevenue}</Text>
                </View>
                <Text style={styles.dataLabel}>Total Revenue</Text>
              </LinearGradient>

              <LinearGradient
                colors={['#FF6584', '#FF7E9A']}
                style={[styles.dataBox, { backgroundColor: "#FF6584" }]}
              >
                <View style={styles.revenueContainer}>
                  <Text style={styles.currencyText}>₹</Text>
                  <Text style={styles.dataText}>{openAmountSum}</Text>
                </View>
                <Text style={styles.dataLabel}>Open Amount</Text>
              </LinearGradient>
            </View>

            <View style={styles.sideBySideContainer}>
              <LinearGradient
                colors={['#32DCA1', '#4AE8B8']}
                style={[styles.dataBox, { backgroundColor: "#32DCA1" }]}
              >
                <Text style={styles.dataText}>{currentMonthBookings}</Text>
                <Text style={styles.dataLabel}>Total Bookings</Text>
              </LinearGradient>

              <LinearGradient
                colors={['#FFA726', '#FFBA4D']}
                style={[styles.dataBox, { backgroundColor: "#FFA726" }]}
              >
                <Text style={styles.dataText}>{upcomingDatesInCurrentMonth}</Text>
                <Text style={styles.dataLabel}>Upcoming Events</Text>
              </LinearGradient>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Upcoming Events</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {renderUpcomingEvents()}
              </ScrollView>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: theme.colors.text }]}>Revenue vs Time (Monthly)</Text>
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
              width={width - 12}
              height={200}
              chartConfig={{
                backgroundColor: theme.colors.primary,
                backgroundGradientFrom: theme.colors.primary,
                backgroundGradientTo: theme.colors.primary,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: "6", strokeWidth: "2", stroke: "#FFA726" },
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
    padding: width * 0.01,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  dotsButton: {
    marginTop: height * 0.02,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  sideBySideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  dataBox: {
    flex: 1,
    padding: width * 0.05,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: width * 0.01,
  },
  revenueContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  currencyText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#FFF",
    marginRight: 5,
  },
  dataText: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#FFF",
  },
  dataLabel: {
    textAlign: "left",
    marginTop: height *0,
    color: "#FFF",
    fontSize: width * 0.04,
  },
  section: {
    marginTop: height * 0.01,
    padding:3
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: height * 0,
  },
  eventCard: {
    padding: width * 0.04,
    margin: width * 0.02,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  eventTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },
  eventDate: {
    fontSize: width * 0.04,
  },
});

export default Dashboard;