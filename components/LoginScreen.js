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
  StatusBar,
  Alert,
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
  const [showPassword, setShowPassword] = useState(false);
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateInputs = () => {
    let valid = true;
    setIdError("");
    setPasswordError("");

    if (!id.trim()) {
      setIdError("Email is required");
      valid = false;
    } else if (!id.includes("@")) {
      setIdError("Please enter a valid email address");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

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
      Alert.alert("Login Failed", error.message || "Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      await signUp(id, password);
      if (user) {
        const isLawnOwner = true;
        navigation.navigate("MainApp", { isLawnOwner, userId: user.email });
      } else {
        Alert.alert("Sign Up Failed", "Please try again with different credentials.");
      }
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message || "Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "A password reset link will be sent to your email address.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send Reset Link", onPress: () => console.log("Reset link sent") }
      ]
    );
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
    <>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <LinearGradient
          colors={["#667EEA", "#764BA2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Background Pattern */}
          <View style={styles.backgroundPattern}>
            <View style={[styles.circle, styles.circle1]} />
            <View style={[styles.circle, styles.circle2]} />
            <View style={[styles.circle, styles.circle3]} />
          </View>

          <Animatable.View animation="fadeInUp" duration={1200} style={styles.content}>
            {/* Header Section */}
            <Animatable.View animation="bounceIn" delay={300} style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <Image source={require("../assets/icons/icon.png")} style={styles.logo} />
              </View>
              <Text style={styles.welcomeTitle}>
                {isSigningUp ? "Create Account" : "Welcome Back"}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {isSigningUp 
                  ? "Join Book My Lawn today" 
                  : "Sign in to your account"
                }
              </Text>
            </Animatable.View>

            {/* Form Section */}
            <Animatable.View animation="fadeInUp" delay={500} style={styles.formSection}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, idError ? styles.inputError : null]}>
                  <Icon name="email" size={22} color={idError ? "#EF4444" : "#667EEA"} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={id}
                    onChangeText={(text) => {
                      setId(text);
                      if (idError) setIdError("");
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                  />
                </View>
                {idError ? <Text style={styles.errorText}>{idError}</Text> : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
                  <Icon name="lock" size={22} color={passwordError ? "#EF4444" : "#667EEA"} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError("");
                    }}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Icon
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={22}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              {/* Remember Me & Forgot Password */}
              {!isSigningUp && (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity 
                    style={styles.rememberMeContainer}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    <Checkbox
                      status={rememberMe ? "checked" : "unchecked"}
                      onPress={() => setRememberMe(!rememberMe)}
                      color="#667EEA"
                      uncheckedColor="#9CA3AF"
                    />
                    <Text style={styles.rememberMeText}>Remember me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Main Action Button */}
              <Animatable.View animation="pulse" iterationCount="infinite" duration={3000}>
                <TouchableOpacity
                  style={[styles.mainButton, isLoading && styles.disabledButton]}
                  onPress={isSigningUp ? handleSignUp : handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={isLoading ? ["#9CA3AF", "#9CA3AF"] : ["#10B981", "#059669"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#FFFFFF" />
                        <Text style={styles.loadingText}>Please wait...</Text>
                      </View>
                    ) : (
                      <Text style={styles.buttonText}>
                        {isSigningUp ? "Create Account" : "Sign In"}
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animatable.View>

              {/* Social Login Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              
            </Animatable.View>

            {/* Footer Section */}
            <Animatable.View animation="fadeIn" delay={800} style={styles.footerSection}>
              <TouchableOpacity 
                onPress={() => setIsSigningUp(!isSigningUp)}
                style={styles.switchContainer}
              >
                <Text style={styles.switchText}>
                  {isSigningUp ? "Already have an account? " : "Don't have an account? "}
                </Text>
                <Text style={styles.switchActionText}>
                  {isSigningUp ? "Sign In" : "Sign Up"}
                </Text>
              </TouchableOpacity>

              {/* Version Info */}
              <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Book My Lawn v{version}</Text>
                <View style={styles.securityBadge}>
                  <Icon name="security" size={12} color="#10B981" />
                  <Text style={styles.securityText}>Secure</Text>
                </View>
              </View>
            </Animatable.View>
          </Animatable.View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 999,
  },
  circle1: {
    width: width * 0.4,
    height: width * 0.4,
    top: -width * 0.1,
    right: -width * 0.1,
  },
  circle2: {
    width: width * 0.3,
    height: width * 0.3,
    bottom: height * 0.1,
    left: -width * 0.1,
  },
  circle3: {
    width: width * 0.2,
    height: width * 0.2,
    top: height * 0.2,
    left: width * 0.1,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: height * 0.04,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 15,
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Roboto',
    textAlign: 'center',
  },
  formSection: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Roboto',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
    fontFamily: 'Roboto',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontFamily: 'Roboto',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#667EEA',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
  mainButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledButton: {
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'Roboto',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    color: '#9CA3AF',
    fontSize: 14,
    paddingHorizontal: 16,
    fontFamily: 'Roboto',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  footerSection: {
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  switchText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Roboto',
  },
  switchActionText: {
    color: '#667EEA',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Roboto',
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Roboto',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  securityText: {
    fontSize: 10,
    color: '#10B981',
    fontFamily: 'Roboto',
    fontWeight: '500',
  },
});