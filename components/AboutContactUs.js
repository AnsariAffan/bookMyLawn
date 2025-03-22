import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Linking, Dimensions } from 'react-native';
import { version } from '../package.json';
import { Appbar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

// Get device dimensions
const { width, height } = Dimensions.get('window');

const AboutContactUs = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <LinearGradient
      colors={["#F5F7FA", "#E3F2FD"]}
      style={styles.gradient}
    >
      {/* Header */}
      <Appbar.Header>
        <LinearGradient
          colors={["#3B82F6", "#1E3A8A"]}
          style={StyleSheet.absoluteFill}
        />
        <Appbar.BackAction
          color="#FFFFFF"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>
          About & Contact Us
        </Text>
      </Appbar.Header>

      <ScrollView style={styles.container}>
        {/* About Us Section */}
        <Animatable.View animation="fadeInUp" duration={500} style={styles.section}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/icon.webp')} style={styles.logo} />
          </View>
          <Text style={styles.heading}>About Us</Text>
          <Text style={styles.paragraph}>
            Welcome to "Book My Lawn"! At Book My Lawn, we are committed to delivering the best user experience. Our goal is to simplify your lawn care bookings and streamline your business operations, helping you save time and focus on what matters most. Whether you’re a homeowner looking to maintain your lawn or a business aiming to manage your services efficiently, we’ve got you covered. Thank you for choosing Book My Lawn – where quality service meets convenience!
          </Text>
        </Animatable.View>

        {/* Contact Us Section */}
        <Animatable.View animation="fadeInUp" duration={500} delay={200} style={styles.section}>
          <Text style={styles.heading}>Contact Us</Text>
          <Text style={styles.paragraph}>
            Have questions or need assistance? We're here to help! You can contact us directly using the details below:
          </Text>

          {/* Name */}
          <View style={styles.infoContainer}>
            <Icon name="person" size={20} color="#3B82F6" style={styles.icon} />
            <Text style={styles.infoText}>Affan Ansari</Text>
          </View>

          {/* Contact Number */}
          <TouchableOpacity onPress={() => handleCall('9579564688')} style={styles.infoContainer}>
            <Icon name="phone" size={20} color="#3B82F6" style={styles.icon} />
            <Text style={[styles.infoText, styles.contactText]}>
              +919579564688
            </Text>
          </TouchableOpacity>

          {/* Email */}
          <View style={styles.infoContainer}>
            <Icon name="email" size={20} color="#3B82F6" style={styles.icon} />
            <Text style={styles.infoText}>
              mohammadaffan777@gmail.com
            </Text>
          </View>

          {/* Version */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>
              Version: {version}
            </Text>
          </View>
        </Animatable.View>
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
    padding: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Roboto",
  },
  section: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
    fontFamily: "Roboto",
  },
  paragraph: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    fontFamily: "Roboto",
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "Roboto",
  },
  contactText: {
    color: "#3B82F6",
    textDecorationLine: 'underline',
  },
  icon: {
    marginRight: 10,
  },
  versionContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Roboto",
  },
});

export default AboutContactUs;