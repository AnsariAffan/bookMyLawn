import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, StyleSheet, Linking } from "react-native";
import {
  Appbar,
  Text,
  Card,
  Title,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // or any other icon set
import UserDetail from "./UserDetail";
import BillingDetail from "./BillingDetail";

const BookingDetails = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("userDetails"); // State to manage active tab



  return (


    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#1e1e1e" }}>
        <Appbar.BackAction
          style={{ color: "#ffff", backgroundColor: "#ffff" }}
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          style={{ paddingLeft: 10 }}
          color="#ffff"
          title="Details"
          subtitle="Step 2 of 3"
        />

        
     
   
       
      </Appbar.Header>

      {/* Tabs for User Details and Billing Details */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "userDetails" && styles.activeTab]}
          onPress={() => setActiveTab("userDetails")}
        >
          <Text style={styles.tabText}>User Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "billingDetails" && styles.activeTab]}
          onPress={() => setActiveTab("billingDetails")}
        >
          <Text style={styles.tabText}>Billing Details</Text>
        </TouchableOpacity>
      </View>

     
      <View style={styles.itemsContainer}>
        {activeTab === "userDetails" && ( // Render content based on active tab
          <>
           <UserDetail/>
          </>
        )}

        {activeTab === "billingDetails" && ( // Empty for Billing Details
         <BillingDetail/>
        )}
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  itemsContainer: {
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1e1e1e",
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#00FF00", // Color for the active tab
  },
  tabText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  card: {
    marginBottom: 8,
    backgroundColor: "#1e1e1e",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 18,
    color: "#ffffff",
  },
  priceText: {
    fontSize: 16,
    color: "#00FF00",
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
  },
  summaryContainer: {
    padding: 16,
    marginTop: "auto",
    backgroundColor: "#1e1e1e",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  totalText: {
    fontSize: 18,
    color: "#00FF00",
    paddingRight: 20,
    paddingLeft: 15,
    paddingTop: 5,
  },
  total: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffff",
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 25,
    marginTop: 25,
  },
});

export default BookingDetails;
