// LoginChoice.js

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginChoice() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
 
   
    <Image source={require('../assets/icon.webp')} style={styles.icon} />
      <Text style={
        {fontSize: 28,
    fontWeight: "bold",
  marginTop:20,
    color: "#007bff"}
      }>Book My Lawn</Text>
    
      
      

      {/* "Book" button */}
    
      <View style={{width:"100%",height:100,display:"flex",flexDirection:"column",marginTop:50,
      
      }}>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SignInwithPhoneNumber")}>
      <Text style={styles.buttonText}>Sign in with Phone Numer</Text>
    </TouchableOpacity>

    {/* "Login as a Lawn Owner" button */}
    <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("LoginScreen")}>
      <Text style={styles.buttonText}>Login as Lawn Owner</Text>
    </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal:20,
    justifyContent: "center",
    alignItems: "center",
    
    
    
  },
  iconOne:{
    



  },
  icon: {
    width: 150,
    height: 150,
    borderRadius:30,
    
    
  },
  button: {
    backgroundColor: "#28a745", // Green color for the booking button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
    marginTop:25
    
  },
  loginButton: {
   backgroundColor: "#00509E", // Blue color for the login button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
