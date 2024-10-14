import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper'; // Use IconButton for an icon

const SuccessMessage = ({ navigation,route }) => {

const bookingDate = route.params?.date

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <IconButton
          icon="check-circle"
          color="#4CAF50"
          size={100}
        />
      </View>
      <Text style={styles.successText}>Booking Successful!</Text>
      <Text style={styles.messageText}>
        Your booking has been processed successfully for the date {bookingDate}.
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BookingList')}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#00509E',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuccessMessage;
