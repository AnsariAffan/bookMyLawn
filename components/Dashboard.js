import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform
} from "react-native";
import { Feather } from '@expo/vector-icons';
import Svg, {
  Path,
  Circle,
  Line,
  Text as SvgText,
} from 'react-native-svg';
import { useBookings } from "./utility/useBookings";
import { Avatar, useTheme } from "react-native-paper";
import { auth } from "../firebaseConfiguration/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import DateFilter from "./utility/DataFilterOnDashboard/DateFilter";
import { useBillingData } from "./utility/DataFilterOnDashboard/BillingDataContext";

// Get device dimensions
const { width, height } = Dimensions.get("window");

// Custom Chart Component
const RevenueTrendChart = ({ data, selectedMonth, onMonthSelect }) => {
  // Chart dimensions - adjusted for card layout
  const chartWidth = width - 80;
  const chartHeight = 180;
  const paddingX = 30;
  const paddingY = 20;

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <View style={customChartStyles.noDataContainer}>
        <Text style={customChartStyles.noDataText}>No data available</Text>
      </View>
    );
  }

  // Calculate positions
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const valueRange = maxValue - minValue || 1;

  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getX = (index) => paddingX + (index * (chartWidth - 2 * paddingX)) / (data.length - 1);
  const getY = (value) => paddingY + ((maxValue - value) / valueRange) * (chartHeight - 2 * paddingY);

  // Generate smooth curve path
  const generatePath = () => {
    if (data.length < 2) return '';

    let path = `M ${getX(0)} ${getY(data[0])}`;
    
    for (let i = 1; i < data.length; i++) {
      const prevX = getX(i - 1);
      const prevY = getY(data[i - 1]);
      const currX = getX(i);
      const currY = getY(data[i]);
      
      const cp1x = prevX + (currX - prevX) / 3;
      const cp1y = prevY;
      const cp2x = currX - (currX - prevX) / 3;
      const cp2y = currY;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currX} ${currY}`;
    }
    
    return path;
  };

  return (
    <View style={customChartStyles.container}>
      <View style={{ position: 'relative' }}>
        <Svg width={chartWidth} height={chartHeight + 30}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = paddingY + (i * (chartHeight - 2 * paddingY)) / 4;
            return (
              <Line
                key={i}
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
            );
          })}

          {/* Chart line */}
          <Path
            d={generatePath()}
            stroke="#ffffff"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((value, index) => (
            <React.Fragment key={index}>
              <Circle
                cx={getX(index)}
                cy={getY(value)}
                r={selectedMonth === index ? "6" : "4"}
                fill={selectedMonth === index ? "#ffffff" : "rgba(255,255,255,0.8)"}
                stroke="#ffffff"
                strokeWidth="2"
                onPress={() => onMonthSelect(index)}
              />
              
              {/* Month labels */}
              <SvgText
                x={getX(index)}
                y={chartHeight + 20}
                textAnchor="middle"
                fontSize="11"
                fill="rgba(255,255,255,0.8)"
              >
                {monthLabels[index] || `M${index + 1}`}
              </SvgText>
            </React.Fragment>
          ))}

          {/* Selected point indicator */}
          {selectedMonth !== null && selectedMonth < data.length && (
            <>
              <Line
                x1={getX(selectedMonth)}
                y1={paddingY}
                x2={getX(selectedMonth)}
                y2={chartHeight - paddingY}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              
              <Circle
                cx={getX(selectedMonth)}
                cy={getY(data[selectedMonth])}
                r="10"
                fill="rgba(255,255,255,0.1)"
                stroke="none"
              />
            </>
          )}
        </Svg>

        {/* Invisible touchable areas for better touch handling */}
        {data.map((value, index) => (
          <TouchableOpacity
            key={`touch-${index}`}
            style={{
              position: 'absolute',
              left: getX(index) - 20,
              top: getY(value) - 20,
              width: 40,
              height: 40,
              zIndex: 10,
            }}
            onPress={() => onMonthSelect(index)}
          />
        ))}

        {/* Selected point info - positioned relative to selected point */}
        {selectedMonth !== null && selectedMonth < data.length && (
          <View style={[
            customChartStyles.selectedInfo,
            {
              left: Math.max(15, Math.min(getX(selectedMonth) - 50, chartWidth - 100)),
              top: getY(data[selectedMonth]) - 70,
            }
          ]}>
            <Text style={customChartStyles.selectedMonth}>
              {monthLabels[selectedMonth] || `Month ${selectedMonth + 1}`}
            </Text>
            <Text style={customChartStyles.selectedRevenue}>
              ₹{data[selectedMonth]}K
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const Dashboard = () => {
  const { billingDataState } = useBillingData();
const currentMonthIndex = new Date().getMonth(); // 0-based index (0 = January)
const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);

  const {
    loading,
    totalReceivedAmounts,
    currentMonthBookings,
    openAmountSum,
    revenueByMonth,
    totalRevenueForSelectedRange,
    currentWeekBookings
  } = useBookings();
  console.log(totalRevenueForSelectedRange)
console.log("Start currentWeekBookings---------------")
console.log(currentWeekBookings)
console.log("End currentWeekBookings--------------")

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
  }, []);

  // Header
  const headerContent = useMemo(() => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            style={styles.profileContainer}
          >
            {image ? (
              <Avatar.Image size={42} source={{ uri: image }} />
            ) : (
              <Avatar.Image
                size={42}
                source={require("../assets/icons/icon.png")}
              />
            )}
          </TouchableOpacity>
          
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>Good Morning</Text>
            <Text style={styles.userName}>
              {user?.displayName || "Anam"}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Feather name="bell" size={20} color="#333333" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
          
                 <DateFilter 
        onDateChange={(selectedDate, filteredData) => {
          // Handle the date change here
          console.log('Selected month/year:', selectedDate);
          console.log('Filtered data:', filteredData);
          // The component automatically updates billingDataState via context
        }}
        iconColor="#333333"
        iconSize={20}
        showLabel={false} // Set to true if you want to show "Filter" text
        containerStyle={styles.calendarButton}
      />

        </View>
      </View>
    );
  }, [image, navigation, user]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#F8F9FA", "#F8F9FA"]}
      style={styles.gradient}
    >
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header Section */}
        {headerContent}

        {/* Data Boxes */}
        <View style={styles.row}>
          {/* BLUE CARD */}
          <LinearGradient
            colors={['#2F6BFF', '#46B2FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, styles.shadow]}
          >
            <View style={styles.cardInner}>
              <Text style={styles.title}>Total Bookings</Text>
              <Text style={styles.value}>{billingDataState.totalBookings}</Text>

              <View style={styles.bottomRow}>
                <Feather name="trending-up" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.deltaText}>+2 this month</Text>
              </View>

              {/* Faded right icon */}
              <View style={styles.fadedIconWrap}>
                <Feather name="calendar" size={40} color="rgba(255,255,255,0.35)" />
              </View>
            </View>
          </LinearGradient>

          {/* GREEN CARD */}
          <LinearGradient
            colors={['#18B566', '#41D19E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, styles.shadow]}
          >
            <View style={styles.cardInner}>
              <Text style={styles.title}>Revenue</Text>
              <Text style={styles.value}>₹{totalRevenueForSelectedRange}K</Text>

              <View style={styles.bottomRow}>
                <Feather name="trending-up" size={16} color="rgba(255,255,255,0.9)" />
                <Text style={styles.deltaText}>+25% growth</Text>
              </View>

              {/* Faded right icon */}
              <View style={styles.fadedIconWrap}>
                <Feather name="dollar-sign" size={40} color="rgba(255,255,255,0.35)" />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Revenue Chart Card - Now in gradient card format */}
        <View style={styles.row}>
          <LinearGradient
            colors={['#9898a0ff', '#a04343ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.chartCard, styles.shadow]}
          >
            <View style={styles.chartCardInner}>
              {/* Chart Header inside the card */}
              <View style={styles.chartHeaderInside}>
                <View>
                  <Text style={styles.chartTitleInside}>Revenue Trend</Text>
                  <Text style={styles.chartSubtitleInside}>Monthly performance</Text>
                </View>
                <View style={styles.chartIconInside}>
                  <Feather name="bar-chart-2" size={20} color="rgba(255,255,255,0.8)" />
                </View>
              </View>
              
              {/* Chart */}
              <View style={styles.chartWrapper}>
                <RevenueTrendChart
                  data={totalReceivedAmounts}
                  selectedMonth={selectedMonth}
                  onMonthSelect={setSelectedMonth}
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Pending Amount Card */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#FF6B35', '#FF8E53']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.pendingCard, styles.shadow]}
          >
            <View style={styles.pendingCardContent}>
              <View style={styles.pendingLeft}>
                <Text style={styles.pendingTitle}>Pending Amount</Text>
                <Text style={styles.pendingAmount}>₹{openAmountSum}</Text>
                <Text style={styles.pendingSubtitle}>From 1 pending bookings</Text>
                
                <TouchableOpacity style={styles.followUpButton}>
                  <Text style={styles.followUpText}>Follow Up Payments</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.pendingIconWrap}>
                <Feather name="users" size={32} color="rgba(255,255,255,0.9)" />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Upcoming Events Section */}

{/* Dynamic Events from your data (Current Week Only) */}
{currentWeekBookings.map((event, index) => (
  <TouchableOpacity
    key={`week-${index}`}
    onPress={() => navigation.navigate("Billingdetails", { ddd: event})}
    style={styles.eventItem}
  >
    <View style={styles.eventContent}>
      <Text style={styles.eventNames}>
        {event?.name || event?.name || `Event ${index + 1}`}
      </Text>
      <Text style={styles.eventDateTime}>
        {event?.dates?.[0] ? new Date(event.dates[0]).toLocaleDateString() : "Date TBD"} at {event?.time || "Time TBD"}
      </Text>
      <Text style={styles.eventDetails}>
        {event?.numberOfGuests || "0"} guests • ₹{event?.totalAmount || "0"}
      </Text>
    </View>
    <View
      style={[
        styles.statusBadge,
        event?.paymentStatus === "confirmed" ? styles.confirmedBadge : styles.pendingBadge,
      ]}
    >
      <Text
        style={[
          styles.statusText,
          event?.paymentStatus === "confirmed" ? styles.confirmedText : styles.pendingText,
        ]}
      >
        {event?.paymentStatus || "pending"}
      </Text>
    </View>
  </TouchableOpacity>
))}



      </ScrollView>
    </LinearGradient>
  );
};

const CARD_RADIUS = 22;
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  card: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    height: 110,
    overflow: 'hidden',
    marginRight: 5,
  },
  // New chart card styles
  chartCard: {
    flex: 1,
    borderRadius: CARD_RADIUS,
    height: 280,
    overflow: 'hidden',
    marginRight: 0, // Full width
  },
  chartCardInner: {
    flex: 1,
    padding: 20,
  },
  chartHeaderInside: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  chartTitleInside: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: "Roboto",
  },
  chartSubtitleInside: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: "Roboto",
  },
  chartIconInside: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  chartWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
    }),
  },
  cardInner: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  title: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  value: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  deltaText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  fadedIconWrap: {
    position: 'absolute',
    right: 16,
    top: '55%',
    transform: [{ translateY: -12 }],
  },
  gradient: { 
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: width * 0.02,
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width*0.01,
    paddingVertical: height*0.01,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    marginRight: 12,
  },
  greetingContainer: {
    justifyContent: "center",
  },
  greetingText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "400",
    fontFamily: "Roboto",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    fontFamily: "Roboto",
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF3B30",
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginTop: 0,
    padding: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 5,
    fontFamily: "Roboto",
  },
  // Pending card styles
  pendingCard: {
    borderRadius: CARD_RADIUS,
    marginHorizontal: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  pendingCardContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingLeft: {
    flex: 1,
  },
  pendingTitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: "Roboto",
  },
  pendingAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 4,
    fontFamily: "Roboto",
  },
  pendingSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 16,
    fontFamily: "Roboto",
  },
  followUpButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  followUpText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: "Roboto",
  },
  pendingIconWrap: {
    marginLeft: 16,
  },
  
  // Events styles
  eventsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: height * 0.4,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  eventContent: {
    flex: 1,
  },
  eventNames: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
    fontFamily: "Roboto",
  },
  eventDateTime: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    fontFamily: "Roboto",
  },
  eventDetails: {
    fontSize: 14,
    color: '#888888',
    fontFamily: "Roboto",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  confirmedBadge: {
    backgroundColor: '#E8F5E8',
  },
  pendingBadge: {
    backgroundColor: '#FFF4E6',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'lowercase',
    fontFamily: "Roboto",
  },
  confirmedText: {
    color: '#4CAF50',
  },
  pendingText: {
    color: '#FF9800',
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

// Custom chart styles
const customChartStyles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  noDataContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: "Roboto",
  },
  selectedInfo: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 100,
    zIndex: 100,
  },
  selectedMonth: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
    fontFamily: "Roboto",
  },
  selectedRevenue: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '700',
    fontFamily: "Roboto",
  },
});

export default Dashboard;