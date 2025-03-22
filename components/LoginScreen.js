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
        colors={["#F5F7FA", "#E3F2FD"]}
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
              colors={["#FFFFFF", "#E3F2FD"]}
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
              colors={["#FFFFFF", "#E3F2FD"]}
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
    paddingVertical: 20,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  title: {
    fontSize: 32,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 5,
    fontFamily: "Roboto",
  },
  subtitle: {
    fontSize: 18,
    color: "#666666",
    marginBottom: 30,
    fontFamily: "Roboto",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#333333",
    fontSize: 16,
    fontFamily: "Roboto",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberMeText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 10,
    fontFamily: "Roboto",
  },
  button: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 20,
   
  },
  buttonGradient: {
    backgroundColor: "#3B82F6",
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Roboto",
    paddingInline:30
  },
  switchText: {
    color: "#3B82F6",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: "Roboto",
  },
  versionContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Roboto",
  },
});