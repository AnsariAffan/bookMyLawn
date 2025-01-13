// SplashScreen.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulating an API call or loading task
    setTimeout(() => {
      // navigation.replace("LoginChoice");
      navigation.replace("LoginScreen")
    }, 3000); // Navigate after 3 seconds
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Splash Screen Content */}
      <Image source={require('../assets/icon.webp')} style={styles.logo} />
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // You can change the background color here
  },
  logo: {
    width: "100%",
    height: 75, // Maintain aspect ratio
    maxWidth: "100px", // Set the maximum width (adjust as per your requirement)
    maxHeight: "10px", // Set the maximum height (adjust as per your requirement)
    marginBottom: 50,
    marginTop:80,
    borderRadius: 30,
    objectFit: "contain", // Ensures the image is scaled to fit within its container
  },
})

export default SplashScreen;
