import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking } from 'react-native';

const AboutContactUs = () => {
  // Function to open dialer when contact number is clicked
  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
    textAlign:"auto",
    
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  contactText: {
    color: '#007bff', // Blue color for clickable text
    textDecorationLine: 'underline', // Underline to indicate it's clickable
  },
  logo: {
    marginTop: 10,
    width: 360,
    height: 210,
    marginBottom: 5,
    borderRadius: 30,
  },
});

export default AboutContactUs;
