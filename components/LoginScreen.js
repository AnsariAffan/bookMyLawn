import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { Checkbox } from "react-native-paper"; // Import the Checkbox component from react-native-paper
import { useAuth } from "./Authprovider.js/AuthProvider"; // Your custom AuthProvider
import AsyncStorage from "@react-native-async-storage/async-storage";
import { version } from '../package.json'; // Import version from package.json

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn, signUp, user, loading } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to manage loader visibility
  const [rememberMe, setRememberMe] = useState(true); // State to track if "Remember Me" is checked

  const handleLogin = async () => {
    setIsLoading(true); // Set loading state to true before login attempt
    try {
      await signIn(id, password);
      if (user) {
        const isLawnOwner = true; // Replace with actual logic
        navigation.navigate("MainApp", { isLawnOwner, userId: user.email });
      }
      // Save credentials to AsyncStorage if "Remember Me" is checked
      if (rememberMe) {
        await AsyncStorage.setItem("id", id); // Store id in AsyncStorage
        await AsyncStorage.setItem("password", password); // Store password in AsyncStorage
      } else {
        await AsyncStorage.removeItem("id"); // Remove stored id if "Remember Me" is unchecked
        await AsyncStorage.removeItem("password"); // Remove stored password if "Remember Me" is unchecked
      }
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false); // Set loading state to false after login attempt
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true); // Set loading state to true before sign up attempt
    try {
      await signUp(id, password);
      if (user) {
        const isLawnOwner = true; // Replace with actual logic
        navigation.navigate("MainApp", { isLawnOwner, userId: user.email });
      } else {
        alert("Sign up failed. Please try again.");
      }
    } catch (error) {
      alert(`Sign up failed: ${error.message}`);
    } finally {
      setIsLoading(false); // Set loading state to false after sign up attempt
    }
  };

  useEffect(() => {
    // Check if user has stored credentials on app launch
    const loadStoredCredentials = async () => {
      const storedId = await AsyncStorage.getItem("id");
      const storedPassword = await AsyncStorage.getItem("password");
      if (storedId && storedPassword) {
        setId(storedId);
        setPassword(storedPassword);
        setRememberMe(true); // If credentials are stored, set "Remember Me" to true
      }
    };

    loadStoredCredentials();

    // Automatically navigate if user is already logged in
    if (user) {
      const isLawnOwner = true; // Replace with actual logic
      navigation.navigate("MainApp", { isLawnOwner, userId: user.email });
    }
  }, [user, navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.webp')} style={styles.icon} />
      <View style={{ width: width - 50, marginTop: 20 }}>
        <TextInput
          style={styles.input}
          placeholder="Enter ID"
          placeholderTextColor="#666"
          value={id}
          onChangeText={setId}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.rememberMeContainer}>
      <Checkbox
    
        status={rememberMe ? "checked" : "unchecked"}
        onPress={() => setRememberMe(!rememberMe)} // Toggle "Remember Me" state
      />
      <Text style={styles.rememberMeText}>Remember Me</Text>
    </View>

      {isSigningUp ? (
        <TouchableOpacity style={styles.loginButton} onPress={handleSignUp} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />  // Show loader while signing up
          ) : (
            <Text style={styles.loginButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />  // Show loader while logging in
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      )}

        {/* Display App Version at the bottom */}
      <View style={styles.versionContainer}>
      <Text style={styles.versionText}>Version: {version}</Text>
    </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  icon: {
  width: "100%",
  height: 75, 
  maxWidth: "100px", // Set the maximum width (adjust as per your requirement)
  maxHeight: "10px", // Set the maximum height (adjust as per your requirement)
  marginBottom: 50,
  borderRadius: 30,
  objectFit: "contain", // Ensures the image is scaled to fit within its container
},

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "black",
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
  },
  rememberMeText: {
    fontSize: 14,
    color: "#666",
  },
  loginButton: {
    backgroundColor: "#00509E",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 20,
    color: "#007bff",
  }, versionContainer: {
    position: 'absolute', // Position it at the bottom
    bottom: height *0.01,  // 10% from the bottom of the screen
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  versionText: {
 
    fontSize: width * 0.04, // Dynamic font size based on screen width
    color: '#333',
    fontWeight: 'bold',
  },
});
