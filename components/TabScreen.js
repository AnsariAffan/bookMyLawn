import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { LinearGradient } from 'expo-linear-gradient'; // Add this dependency if not already present
import Billingdetail from './BillingDetails/Billingdetail';
import BookingFormScreen from './BookingCalenderprovier/BookingFormScreen';
import EditForm from './editform/EditForm';

// Main Tab Screen
const TabScreen = ({ route ,navigation}) => {
  const booking = route?.params?.booking;
  
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'booking', title: 'Booking', icon: '📅' },
    { key: 'billing', title: 'Billing', icon: '💳' },
  ]);

  const handleGoBack = () => {
    if (navigation) {
      navigation?.goBack();
    }
  };
  // Custom renderScene to pass props to components
  const renderScene = ({ route }) => {
    switch (route?.key) {
      case 'booking':
        return (
          <View style={styles.sceneContainer}>
            <BookingFormScreen dataDefaulting={booking} />
          </View>
        );
      case 'billing':
        return (
          <View style={styles.sceneContainer}>
            <Billingdetail dataDefaulting={booking} />
          </View>
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <View style={styles.tabBarContainer}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      >
        <TabBar
          {...props}
          style={styles.tabBar}
          labelStyle={styles.tabLabel}
          indicatorStyle={styles.indicator}
          activeColor="#ffffff"
          inactiveColor="rgba(255, 255, 255, 0.7)"
          renderLabel={({ route, focused, color }) => (
            <View style={styles.tabItem}>
              <Text style={[styles.tabIcon, { opacity: focused ? 1 : 0.7 }]}>
                {route.icon}
              </Text>
              <Text style={[styles.tabLabel, { color, opacity: focused ? 1 : 0.7 }]}>
                {route.title}
              </Text>
            </View>
          )}
        />
      </LinearGradient>

    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
            <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Management</Text>
        <View style={styles.headerAccent} />
      </LinearGradient>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
        style={styles.tabView}
        sceneContainerStyle={styles.sceneContainerStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    display:"flex",
    flexDirection:"row"
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    
  },
  headerAccent: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
    marginTop: 8,
  },
  tabView: {
    flex: 1,
  },
  tabBarContainer: {
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  gradientBackground: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    paddingVertical: 8,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    minHeight: 60,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  indicator: {
    backgroundColor: '#ffffff',
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  sceneContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    marginTop: 16,
    marginHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  sceneContainerStyle: {
    backgroundColor: 'transparent',
  },
  

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backArrow: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default TabScreen;