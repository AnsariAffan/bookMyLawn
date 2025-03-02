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
import DateFilter from "./utility/DataFilterOnDashboard/DateFilter";
import { useBillingData } from "./utility/DataFilterOnDashboard/BillingDataContext";

// Get device dimensions
const { width, height } = Dimensions.get("window");

const Dashboard = () => {
  const { billingDataState } = useBillingData(); // Access the billing data from context

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
    totalReceivedAmounts,
  } = useBookings();

  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const theme = useTheme(); // Use the theme

  useEffect(() => {
    // Ensure auth is defined and onAuthStateChanged exists
    const unsubscribe = auth?.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setImage(currentUser.photoURL);
      } else {
        setUser(null);
      }
    });

    // Return the unsubscribe function to clean up
    // return () => {
    //   if (unsubscribe) {
    //     unsubscribe // Make sure unsubscribe is called properly
    //   }
    // };
  }, []); // Empty dependency array to run the effect only once (on mount/unmount)

  useEffect(() => {
    if (user && user.photoURL) {
      setImage(user.photoURL);
    }
  }, [user]);

  const renderUpcomingEvents = () => {
    return billingDataState.filteredData.map((event, index) => {
      return (
        <TouchableOpacity
          key={index}
          onPress={() =>
            navigation.navigate("BookingDetails", { booking: event })
          }
        >
          <View
            style={[
              styles.eventCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              style={[
                styles.eventTitle,
                { color: theme.colors.text },
              ]}
            >
              {event.dates}
            </Text>
            <Text
              style={[
                styles.eventDate,
                { color: theme.colors.placeholder },
              ]}
            >
              {event.paymentStatus}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.headerContainer}>
        {/* Profile Picture on the Left */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={styles.profileContainer}
        >
          {image ? (
            <Avatar.Image size={40} source={{ uri: image }} />
          ) : (
            <Avatar.Image
              size={40}
              source={require("../assets/icons/icon.png")}
            />
          )}
        </TouchableOpacity>

        {/* User Name in the Middle */}
        <Text style={[styles.header, { color: theme.colors.text }]}>
          {user?.displayName}
        </Text>

        {/* Calendar Button on the Right */}
        <DateFilter />
      </View>

      <View style={styles.container}>
        <View style={styles.sideBySideContainer}>
          {/* Total Revenue */}
          <TouchableOpacity style={styles.boxContainer}>
            <LinearGradient
              colors={["#6C63FF", "#8E85FF"]}
              style={[styles.dataBox, { backgroundColor: theme.colors.primary }]}
            >
              <View style={styles.revenueContainer}>
                <Text style={styles.currencyText}>₹</Text>
                <Text style={styles.dataText}>
                  {billingDataState.totalReceivedAmount}
                </Text>
              </View>
              <Text style={styles.dataLabel}>Total Revenue</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Unpaid */}
          <TouchableOpacity style={styles.boxContainer}>
            <LinearGradient
              colors={["#FF6584", "#FF7E9A"]}
              style={[styles.dataBox, { backgroundColor: "#FF6584" }]}
            >
              <View style={styles.revenueContainer}>
                <Text style={styles.currencyText}>₹</Text>
                <Text style={styles.dataText}>
                  {billingDataState.totalRemainingAmount}
                </Text>
              </View>
              <Text style={styles.dataLabel}>Unpaid</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.sideBySideContainer}>
          {/* Total Bookings */}
          <TouchableOpacity style={styles.boxContainer}>
            <LinearGradient
              colors={["#32DCA1", "#4AE8B8"]}
              style={[styles.dataBox, { backgroundColor: "#32DCA1" }]}
            >
              <Text style={styles.dataText}>
                {billingDataState.totalBookings}
              </Text>
              <Text style={styles.dataLabel}>Total Bookings</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Upcoming Events */}
          <TouchableOpacity style={styles.boxContainer}>
            <LinearGradient
              colors={["#FFA726", "#FFBA4D"]}
              style={[styles.dataBox, { backgroundColor: "#FFA726" }]}
            >
              <Text style={styles.dataText}>
                {billingDataState?.totalUpcomingDates}
              </Text>
              <Text style={styles.dataLabel}>Upcoming Events</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Upcoming Events
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderUpcomingEvents()}
          </ScrollView>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Revenue vs Time (Monthly)
        </Text>
        {totalReceivedAmounts.length > 0 ? (
          <TouchableOpacity>
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
                datasets: [{ data: totalReceivedAmounts, strokeWidth: 1 }],
              }}
              width={width - 12}
              height={220}
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
          </TouchableOpacity>
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingInline: width * 0.01,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  profileContainer: {
    marginTop: 5, // Optional: gives space from the top
    marginLeft: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.01,
    marginBottom: height * 0.001,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    paddingLeft: 5,
    marginTop: 5,
  },
  sideBySideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  boxContainer: {
    flex: 1,
    marginHorizontal: width * 0.01, // Space between the boxes
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
    marginVertical: 4, // Margin to create space between rows
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
    color: "#FFF",
    fontSize: width * 0.04,
  },
  section: {
    marginTop: height * 0.01,
    padding: 3,
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: height * 0,
  },
  eventCard: {
    padding: width * 0.02,
    margin: width * 0.02,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  eventTitle: {
    fontSize: width * 0.04,
    fontWeight: "normal",
  },
  eventDate: {
    fontSize: width * 0.03,
  },
  noDataText: {
    fontSize: width * 0.04,
    fontWeight: "normal",
    textAlign: "center",
    marginTop: height * 0.02,
  },
});

export default Dashboard;