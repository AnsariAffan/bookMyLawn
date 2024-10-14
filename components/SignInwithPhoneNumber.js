// LoginScreen.js

import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

export default function SignInWithPhoneNumber() {
  const navigation = useNavigation(); // Use navigation
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLogin = () => {
    // Replace with your actual login logic
    const isContactNumber = true; // Assume we have this logic somewhere
    if (phoneNumber ) { // Replace with your phone number validation logic
      navigation.navigate("MainApp", { isContactNumber, userId: phoneNumber }); // Navigate with phone number
    } else {
      alert(`Incorrect Credential`);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.webp')} style={styles.icon} />

      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        placeholderTextColor="#666"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad" // Use phone number keyboard
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  icon: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#007bff", // Blue color for the login button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
