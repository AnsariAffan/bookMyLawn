import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform } from "react-native";
import { Checkbox } from "react-native-paper";
import { useAuth } from "./Authprovider.js/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { version } from '../package.json';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient background
import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const navigation = useNavigation();
  const { signIn, signUp, user, loading } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn(id, password);
      if (user) {
        const isLawnOwner = true;
        navigation.navigate("MainApp", { isLawnOwner, userId: user.email });
      }
      if (rememberMe) {
        await AsyncStorage.setItem("id", id);
        await AsyncStorage.setItem("password", password);
      } else {
        await AsyncStorage.removeItem("id");
        await AsyncStorage.removeItem("password");
      }
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      await signUp(id, password);
      if (user) {
        const isLawnOwner = true;
        navigation.navigate("MainApp", { isLawnOwner, userId: user.email });
      } else {
        alert("Sign up failed. Please try again.");
      }
    } catch (error) {
      alert(`Sign up failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadStoredCredentials = async () => {
      const storedId = await AsyncStorage.getItem("id");
      const storedPassword = await AsyncStorage.getItem("password");
      if (storedId && storedPassword) {
        setId(storedId);
        setPassword(storedPassword);
        setRememberMe(true);
      }
    };

    loadStoredCredentials();

    if (user) {
      const isLawnOwner = true;
      navigation.navigate("MainApp", { isLawnOwner, userId: user.email });
    }
  }, [user, navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#6A11CB", "#2575FC"]} // Gradient background
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Image source={require('../assets/icons/icon.png')} style={styles.icon} />
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Book My Lawn</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter ID"
              placeholderTextColor="#999"
              value={id}
              onChangeText={setId}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.rememberMeContainer}>
            <Checkbox
              status={rememberMe ? "checked" : "unchecked"}
              onPress={() => setRememberMe(!rememberMe)}
              color="#fff"
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </View>

          {isSigningUp ? (
            <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="blue" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="blue" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          )}


          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version: {version}</Text>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: width * 0.9,
    alignItems: "center",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMeText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#6A11CB",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  versionContainer: {
    position: "absolute",
    
    bottom: -100,
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    color: "#fff",
  },
});