import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { useAuth } from "./Authprovider.js/AuthProvider";
const { width, height } = Dimensions.get("window");
export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn, signUp, user, loading } = useAuth(); // loading added
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // State to manage loader visibility

  const handleLogin = async () => {
    setIsLoading(true);  // Set loading state to true before login attempt
    try {
      await signIn(id, password);
      // Wait until user state is updated (add this condition)
      if (user) {
        const isLawnOwner = true; // Replace with actual logic
        navigation.navigate("MainApp", { isLawnOwner, userId: user.email });
      }
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false); // Set loading state to false after login attempt
    }
  };

  const 
  handleSignUp = async () => {
    setIsLoading(true);  // Set loading state to true before sign up attempt
    try {
      await signUp(id, password);
      // Wait until user state is updated (add this condition)
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
    // Automatically navigate if user is already logged in
    if (user) {
      const isLawnOwner = true; // Replace with actual logic
      navigation.navigate("MainApp", { isLawnOwner, userId: user.email });
    }
  }, [user, navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.webp')} style={styles.icon} />
      <Text style={styles.title}>Book My Lawn</Text>
<View style={{width:width-50,marginTop:20}}>
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

      <TouchableOpacity onPress={() => setIsSigningUp(!isSigningUp)}>
        <Text style={styles.switchText}>
          {isSigningUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </Text>
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
    paddingHorizontal: 30,
  },
  icon: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 30,
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
  loginButton: {
    backgroundColor: "#00509E",
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
  switchText: {
    marginTop: 20,
    color: "#007bff",
  },
});
