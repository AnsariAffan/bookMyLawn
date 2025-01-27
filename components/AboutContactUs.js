import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, Dimensions } from 'react-native';
import { version } from '../package.json'; // Import version from package.json
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Get device dimensions
const { width, height } = Dimensions.get('window');

const AboutContactUs = () => {
  // Function to open dialer when contact number is clicked
  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const navigation = useNavigation();
  return (
   <>
    <Appbar.Header style={{ backgroundColor: "#00509E" }}>
    <Appbar.BackAction
      style={{ color: "#F5F5F5" }}
      onPress={() => navigation.goBack()}
    />
    <Text style={{ fontSize: 20, fontWeight: "normal", color: "#ffff" }}>
      About & Contact Us
    </Text>
  </Appbar.Header>
  <ScrollView style={styles.container}>
      {/* About Us Section */}
      <View style={styles.section}>
        <Image source={require('../assets/icon.webp')} style={styles.logo} />
        <Text style={styles.heading}>About Us</Text>
        <Text style={styles.paragraph}>
          Welcome to "Book My Lawn"!

          At Book My Lawn, we are committed to delivering the best user experience. Our goal is to simplify your lawn care bookings and streamline your business operations, helping you save time and focus on what matters most. Whether you’re a homeowner looking to maintain your lawn or a business aiming to manage your services efficiently, we’ve got you covered.
          
          Thank you for choosing Book My Lawn – where quality service meets convenience!
        </Text>
      </View>

      {/* Contact Us Section */}
      <View style={styles.section}>
        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.paragraph}>
          Have questions or need assistance? We're here to help! You can contact us directly using the details below:
        </Text>

        {/* Name */}
        <Text style={styles.infoText}>Name: Affan Ansari</Text>

        {/* Contact Number */}
        <TouchableOpacity onPress={() => handleCall('9579564688')}>
          <Text style={[styles.infoText, styles.contactText]}>Contact Number: +919579564688</Text>
        </TouchableOpacity>

        {/* Email */}
        <Text style={styles.infoText}>Email: mohammadaffan777@gmail.com</Text>
      </View>

      {/* Display App Version at the bottom */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version: {version}</Text>
      </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: width * 0.06, // Dynamic font size based on screen width
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  paragraph: {
    fontSize: width * 0.04, // Dynamic font size based on screen width
    marginBottom: 10,
    color: '#555',
    textAlign: 'auto',
  },
  infoText: {
    fontSize: width * 0.04, // Dynamic font size based on screen width
    marginBottom: 10,
    color: '#333',
  },
  contactText: {
    color: '#007bff', // Blue color for clickable text
    textDecorationLine: 'underline', // Underline to indicate it's clickable
  },
  logo: {
    width: "100%",
    height: 75, // Maintain aspect ratio
    maxWidth: "100px", // Set the maximum width (adjust as per your requirement)
    maxHeight: "10px", // Set the maximum height (adjust as per your requirement)
    marginBottom: 30,
    marginTop:18,
    borderRadius: 30,
    objectFit: "contain", // Ensures the image is scaled to fit within its container
  },
  versionContainer: {
    position: 'absolute', // Position it at the bottom
    bottom: height *-0.03,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  versionText: {
 
    fontSize: width * 0.04, // Dynamic font size based on screen width
    color: '#333',
    fontWeight: 'normal',
  },
});

export default AboutContactUs;
