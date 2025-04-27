import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Checkbox } from "react-native-paper";
import { useAuth } from "./Authprovider.js/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { version } from "../package.json";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";

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
        colors={["#F5F7FA", "#F3F4F6"]}
        style={styles.gradient}
      >
        <Animatable.View animation="fadeInUp" duration={1000} style={styles.content}>
          {/* App Icon */}
          <Image source={require("../assets/icons/icon.png")} style={styles.icon} />

          {/* Title and Subtitle */}
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Book My Lawn</Text>

          {/* Input Container */}
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={["#FFFFFF", "#F3F4F6"]}
              style={styles.inputWrapper}
            >
              <Icon name="person" size={20} color="#3B82F6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter ID"
                placeholderTextColor="#666666"
                value={id}
                onChangeText={setId}
                autoCapitalize="none"
              />
            </LinearGradient>
            <LinearGradient
              colors={["#FFFFFF", "#F3F4F6"]}
              style={styles.inputWrapper}
            >
              <Icon name="lock" size={20} color="#3B82F6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter Password"
                placeholderTextColor="#666666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
              />
            </LinearGradient>
          </View>

          {/* Remember Me Checkbox */}
          <View style={styles.rememberMeContainer}>
            <Checkbox
              status={rememberMe ? "checked" : "unchecked"}
              onPress={() => setRememberMe(!rememberMe)}
              color="#3B82F6"
              uncheckedColor="#666666"
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </View>

          {/* Login/Sign Up Button */}
          <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
            <TouchableOpacity
              style={styles.button}
              onPress={isSigningUp ? handleSignUp : handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <View style={styles.buttonGradient}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isSigningUp ? "Sign Up" : "Login"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </Animatable.View>

          {/* Switch between Login and Sign Up */}
          <TouchableOpacity onPress={() => setIsSigningUp(!isSigningUp)}>
            <Text style={styles.switchText}>
              {isSigningUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>

          {/* Version Text */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version: {version}</Text>
          </View>
        </Animatable.View>
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
    paddingVertical: height * 0.02,
  },
  icon: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: height * 0.02,
    borderRadius: width * 0.05,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "600",
    color: "#333333",
    marginBottom: height * 0.005,
    fontFamily: "Roboto",
  },
  subtitle: {
    fontSize: width * 0.045,
    color: "#666666",
    marginBottom: height * 0.03,
    fontFamily: "Roboto",
  },
  inputContainer: {
    width: "100%",
    marginBottom: height * 0.02,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: width * 0.04,
    marginBottom: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    marginRight: width * 0.025,
  },
  input: {
    flex: 1,
    height: height * 0.06,
    color: "#333333",
    fontSize: width * 0.04,
    fontFamily: "Roboto",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  rememberMeText: {
    fontSize: width * 0.035,
    color: "#666666",
    marginLeft: width * 0.025,
    fontFamily: "Roboto",
  },
  button: {
    width: "100%",
    borderRadius: width * 0.04,
    overflow: "hidden",
    marginBottom: height * 0.02,
  },
  buttonGradient: {
    backgroundColor: "#3B82F6",
    paddingVertical: height * 0.02, // Increased padding for better size
    paddingHorizontal: width * 0.1, // Added horizontal padding for width
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: width * 0.05, // Slightly increased font size
    fontWeight: "600",
    fontFamily: "Roboto",
  },
  switchText: {
    color: "#3B82F6",
    fontSize: width * 0.035,
    textDecorationLine: "underline",
    fontFamily: "Roboto",
  },
  versionContainer: {
    marginTop: height * 0.02,
    alignItems: "center",
  },
  versionText: {
    fontSize: width * 0.03,
    color: "#666666",
    fontFamily: "Roboto",
  },
});