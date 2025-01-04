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
      <Text style={
        {fontSize: 28,
    fontWeight: "bold",
    color: "black"}
      }>Book My Lawn</Text>
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
  
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 30,

}
  
})

export default SplashScreen;
