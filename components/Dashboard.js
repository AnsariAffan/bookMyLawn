import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { Avatar, useTheme } from "react-native-paper";
import { auth } from "../firebaseConfiguration/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import DateFilter from "./utility/DataFilterOnDashboard/DateFilter";
import { useBillingData } from "./utility/DataFilterOnDashboard/BillingDataContext";

// Get device dimensions
const { width, height } = Dimensions.get("window");

const Dashboard = () => {
  const { billingDataState } = useBillingData();

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
  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setImage(currentUser.photoURL);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []); // Removed unnecessary dependencies for better performance

  const renderUpcomingEvents = useMemo(
    () =>
      billingDataState?.filteredData.map((event, index) => (
        <TouchableOpacity
          key={index}
          onPress={() =>
            navigation.navigate("Billingdetails", { booking: event })
          }
        >
          <LinearGradient
            colors={["#FFFFFF", "#E3F2FD"]}
            style={styles.eventCard}
          >
            <Text style={styles.eventTitle}>{event.dates}</Text>
            <Text style={styles.eventDate}>{event.paymentStatus}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )),
    [billingDataState?.filteredData, navigation]
  ); // Memoized to avoid unnecessary re-renders

  const headerContent = useMemo(() => {
    return (
      <LinearGradient
        colors={["#FFFFFF", "#E3F2FD"]}
        style={styles.headerContainer}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Settings")}
          style={styles.profileContainer}
        >
          {image ? (
            <Avatar.Image size={36} source={{ uri: image }} />
          ) : (
            <Avatar.Image
              size={36}
              source={require("../assets/icons/icon.png")}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.header}>
          {user?.displayName || "Welcome"}
        </Text>

        <View style={styles.calendarButton}>
          <DateFilter />
        </View>
      </LinearGradient>
    );
  }, [image, navigation, user]); // Memoized to avoid unnecessary re-renders

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#F5F7FA", "#E3F2FD"]}
      style={styles.gradient}
    >
      <ScrollView style={styles.container}>
        {/* Header Section */}
        {headerContent}

        {/* Data Boxes */}
        <View style={styles.dataContainer}>
          <View style={styles.sideBySideContainer}>
            {/* Total Revenue */}
            <TouchableOpacity style={styles.boxContainer}>
              <View style={[styles.dataBox, { backgroundColor: "#3B82F6" }]}>
                <View style={styles.revenueContainer}>
                  <Text style={styles.currencyText}>₹</Text>
                  <Text style={styles.dataText}>
                    {billingDataState.totalReceivedAmount}
                  </Text>
                </View>
                <Text style={styles.dataLabel}>Total Revenue</Text>
              </View>
            </TouchableOpacity>

            {/* Unpaid */}
            <TouchableOpacity style={styles.boxContainer}>
              <View style={[styles.dataBox, { backgroundColor: "#EF5350" }]}>
                <View style={styles.revenueContainer}>
                  <Text style={styles.currencyText}>₹</Text>
                  <Text style={styles.dataText}>
                    {billingDataState.totalRemainingAmount}
                  </Text>
                </View>
                <Text style={styles.dataLabel}>Unpaid</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.sideBySideContainer}>
            {/* Total Bookings */}
            <TouchableOpacity style={styles.boxContainer}>
              <View style={[styles.dataBox, { backgroundColor: "#4DB6AC" }]}>
                <Text style={styles.dataText}>
                  {billingDataState.totalBookings}
                </Text>
                <Text style={styles.dataLabel}>Total Bookings</Text>
              </View>
            </TouchableOpacity>

            {/* Upcoming Events */}
            <TouchableOpacity style={styles.boxContainer}>
              <View style={[styles.dataBox, { backgroundColor: "#FF9900" }]}>
                <Text style={styles.dataText}>
                  {billingDataState?.totalUpcomingDates}
                </Text>
                <Text style={styles.dataLabel}>Upcoming Events</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

       

        {/* Revenue Chart Section */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue vs Time (Monthly)</Text>
        {totalReceivedAmounts.length > 0 ? (
          <LinearGradient
            colors={["#FFFFFF", "#E3F2FD"]}
            style={styles.chartContainer}
          >
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
                datasets: [{ data: totalReceivedAmounts, strokeWidth: 2 }],
              }}
              width={width * 0.9} // Set width to 90% of screen width
              height={height * 0.25} // Set height to 25% of screen height
              chartConfig={{
                backgroundColor: "#FFFFFF", // Changed to white
                backgroundGradientFrom: "#FFFFFF", // Changed to white
                backgroundGradientTo: "#FFFFFF", // Changed to white
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
                style: { borderRadius: 10 },
                propsForDots: {
                  r: "5",
                  strokeWidth: "2",
                  stroke: "#3B82F6",
                },
              }}
              style={{ borderRadius: 10 }}
            />
          </LinearGradient>
        ) : (
          <Text style={styles.noDataText}>No data available</Text>
        )}
      </View>
       {/* Upcoming Events Section */}
       <View style={styles.section}>
       <Text style={styles.sectionTitle}>Upcoming Events</Text>
       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
         {renderUpcomingEvents}
       </ScrollView>
     </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.02,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  profileContainer: {
    marginLeft: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    fontFamily: "Roboto",
  },
  calendarButton: {
    marginRight: 5,
  },
  dataContainer: {
    marginBottom: 5,
  },
  sideBySideContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  boxContainer: {
    flex: 1,
    marginHorizontal: width * 0.01,
  },
  dataBox: {
    padding: width * 0.04,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  revenueContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  currencyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 5,
    fontFamily: "Roboto",
  },
  dataText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  dataLabel: {
    textAlign: "left",
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Roboto",
    marginTop: 5,
  },
  section: {
    marginTop: height * 0,
    padding: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 5,
    fontFamily: "Roboto",
  },
  eventCard: {
    padding: width * 0.03,
    margin: width * 0.01,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: width * 0.35,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    fontFamily: "Roboto",
  },
  eventDate: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Roboto",
    marginTop: 2,
  },
  chartContainer: {
    borderRadius: 10,
    padding: 0,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  noDataText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Roboto",
  },
});

export default Dashboard;