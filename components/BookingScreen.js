import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { Calendar } from 'react-native-calendars';

const BookingScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [contactNo, setContactNo] = useState('');

  // Function to handle date selection
  const onDayPress = (day) => {
    let newDates = { ...selectedDates };
    if (newDates[day.dateString]) {
      delete newDates[day.dateString];
    } else {
      newDates[day.dateString] = {
        selected: true,
        marked: true,
        selectedColor: 'blue',
      };
    }
    setSelectedDates(newDates);
  };

  // Helper function to group selected dates by year and month
  const groupDatesByYearMonth = () => {
    const groupedDates = {};

    Object.keys(selectedDates).forEach((date) => {
      const dateObj = new Date(date);
      const year = dateObj.getFullYear();
      const month = dateObj.toLocaleString('default', { month: 'long' });

      if (!groupedDates[year]) {
        groupedDates[year] = {};
      }

      if (!groupedDates[year][month]) {
        groupedDates[year][month] = [];
      }

      groupedDates[year][month].push(dateObj.getDate());
    });

    return groupedDates;
  };

  const groupedDates = groupDatesByYearMonth();

  // Function to handle booking confirmation
  const handleBooking = () => {
    if (Object.keys(selectedDates).length > 0) {
      Alert.alert('Booking Confirmed', 'Your selected dates have been booked.');
    } else {
      Alert.alert('No Dates Selected', 'Please select dates before booking.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
    style={styles.keyboardAvoidingView}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Book Celebration Lawn</Text>
          </View>

          {/* Calendar Component */}
          <Calendar
            onDayPress={onDayPress}
            markedDates={selectedDates}
            markingType={'multi-dot'}
            theme={{
              backgroundColor: '#121212',
              calendarBackground: '#121212',
              textSectionTitleColor: '#ffffff',
              selectedDayBackgroundColor: '#00adf5',
              selectedDayTextColor: '#ffffff',
              dayTextColor: '#ffffff',
              monthTextColor: '#ffffff',
              arrowColor: '#ffffff',
              textDisabledColor: '#444444',
              todayTextColor: '#00adf5',
            }}
          />

          {/* Section to display selected dates grouped by year and month */}
          <View style={styles.footer}>
            {Object.keys(groupedDates).length > 0 ? (
              Object.keys(groupedDates).map((year) => (
                <View key={year} style={styles.yearContainer}>
                  {Object.keys(groupedDates[year]).map((month) => (
                    <View key={month} style={styles.monthContainer}>
                      <Text style={styles.footerText}>Selected Dates:</Text>
                      <Text style={styles.monthText}>
                        {month} {year}
                      </Text>

                      <View style={styles.datesContainer}>
                        {groupedDates[year][month].map((date, index) => (
                          <View key={index} style={styles.dateCircle}>
                            <Text style={styles.dateText}>{date}</Text>
                          </View>
                        ))}
                      </View>
                      <Text style={styles.bookingInfoText}>
                        These dates are booked for your event.
                      </Text>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <Text style={styles.noDatesText}>No dates selected.</Text>
            )}
          </View>

          {/* Additional Fields for Name, Address, Aadhaar, and Contact No */}
          <View style={styles.additionalFields}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#ffffff"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="#ffffff"
              value={address}
              onChangeText={setAddress}
            />
            <TextInput
              style={styles.input}
              placeholder="Aadhaar Card Number"
              placeholderTextColor="#ffffff"
              value={aadhaar}
              onChangeText={setAadhaar}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              placeholderTextColor="#ffffff"
              value={contactNo}
              onChangeText={setContactNo}
              keyboardType="phone-pad"
            />
          </View>

          {/* Booking Button at the bottom */}
          <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  keyboardAvoidingView: {
    flex: 1,
 
  },
  scrollView: {
    paddingBottom: 100, // To ensure there's space for the button
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'left',
  },
  footerText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  yearContainer: {
    marginBottom: 20,
  },
  monthContainer: {
    marginBottom: 15,
  },
  monthText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  dateCircle: {
    backgroundColor: '#00adf5',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  dateText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingInfoText: {
    color: '#00FF00',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'left',
  },
  noDatesText: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#00adf5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20, // Added margin to create space above and below the button
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  additionalFields: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
    color: 'white', // Change text color for input
  },
});

export default BookingScreen;
