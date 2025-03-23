import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // For navigation prop

const SuccessMessage = ({ route }) => {
  const navigation = useNavigation();
  const bookingDate = route?.params?.date;

  // Animation setup
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <IconButton
          icon="check-circle-outline" // Outline looks sleeker
          color="#34C759" // Modern green shade
          size={120}
          style={styles.icon}
        />
      </Animated.View>

      <Animated.Text style={[styles.successText, { opacity: fadeAnim }]}>
        Booking Confirmed!
      </Animated.Text>
      <Text style={styles.messageText}>
        Your booking for {bookingDate} is all set. We’ve got you covered!
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('List')}
        activeOpacity={0.8} // Subtle press feedback
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#F7F9FC', // Light, modern background
  },
  iconContainer: {
    marginBottom: 30,
  },
  icon: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)', // Subtle background circle
    borderRadius: 60,
  },
  successText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#34C759',
    letterSpacing: 0.5, // Adds sophistication
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    lineHeight: 24, // Better readability
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#00509E',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30, // Softer, modern curve
    marginTop: 40,
    elevation: 5, // Shadow for depth (Android)
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default SuccessMessage;