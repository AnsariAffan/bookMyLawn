import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, Dimensions } from 'react-native';
import { version } from '../package.json'; // Import version from package.json
import { Appbar, useTheme } from 'react-native-paper'; // Import useTheme
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons

// Get device dimensions
const { width, height } = Dimensions.get('window');

const AboutContactUs = () => {
  const theme = useTheme(); // Use the theme
  const navigation = useNavigation();

  // Function to open dialer when contact number is clicked
  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction
          color={theme.colors.surface} // Use theme color for back icon
          onPress={() => navigation.goBack()}
        />
        <Text style={{ fontSize: 20, fontWeight: "normal", color: theme.colors.surface }}>
          About & Contact Us
        </Text>
      </Appbar.Header>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* About Us Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Image source={require('../assets/icon.webp')} style={styles.logo} />
          <Text style={[styles.heading, { color: theme.colors.primary }]}>About Us</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Welcome to "Book My Lawn"!
            At Book My Lawn, we are committed to delivering the best user experience. Our goal is to simplify your lawn care bookings and streamline your business operations, helping you save time and focus on what matters most. Whether you’re a homeowner looking to maintain your lawn or a business aiming to manage your services efficiently, we’ve got you covered.
            Thank you for choosing Book My Lawn – where quality service meets convenience!
          </Text>
        </View>

        {/* Contact Us Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.heading, { color: theme.colors.primary }]}>Contact Us</Text>
          <Text style={[styles.paragraph, { color: theme.colors.text }]}>
            Have questions or need assistance? We're here to help! You can contact us directly using the details below:
          </Text>

          {/* Name */}
          <View style={styles.infoContainer}>
            <Icon name="person" size={20} color={theme.colors.primary} style={styles.icon} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>Affan Ansari</Text>
          </View>

          {/* Contact Number */}
          <TouchableOpacity onPress={() => handleCall('9579564688')} style={styles.infoContainer}>
            <Icon name="phone" size={20} color={theme.colors.primary} style={styles.icon} />
            <Text style={[styles.infoText, styles.contactText, { color: theme.colors.primary }]}>
              +919579564688
            </Text>
          </TouchableOpacity>

          {/* Email */}
          <View style={styles.infoContainer}>
            <Icon name="email" size={20} color={theme.colors.primary} style={styles.icon} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              mohammadaffan777@gmail.com
            </Text>
          </View>

          {/* Display App Version at the bottom */}
          <View style={styles.versionContainer}>
            <Text style={[styles.versionText, { color: theme.colors.placeholder }]}>
              Version: {version}
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    fontSize: width * 0.06, // Dynamic font size based on screen width
    fontWeight: 'bold',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: width * 0.04, // Dynamic font size based on screen width
    marginBottom: 15,
    lineHeight: 22,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: width * 0.04, // Dynamic font size based on screen width
    marginLeft: 10,
  },
  contactText: {
    textDecorationLine: 'underline', // Underline to indicate it's clickable
  },
  logo: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  versionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: width * 0.04, // Dynamic font size based on screen width
  },
});

export default AboutContactUs;