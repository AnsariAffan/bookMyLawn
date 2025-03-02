import React, { useState } from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { View, StyleSheet, Linking } from "react-native";
import { Appbar, Text, Card, Title, Icon } from "react-native-paper";
import UserDetail from "./UserDetail";
import BillingDetail from "./BillingDetails/Billingdetail";
import { createPDF } from "./utility/createPDF";
const { width, height } = Dimensions.get("window"); // Get device width

const BookingDetails = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState("billingDetails"); // State to manage active tab

  const bdata = route?.params?.booking;

  const handlePrint = async () => {
    try {
      await createPDF(); // Make sure it's awaited
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: "#ffff" }}>
        <Appbar.BackAction
          style={{ color: "black", backgroundColor: "#ffff" }}
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          style={{ paddingLeft: 10, fontWeight: "700" }}
          color="black"
          title="Details"
          subtitle="Step 2 of 3"
        />
        <Appbar.Action icon="printer" onPress={handlePrint} color="#4DB6AC" />
      </Appbar.Header>
      <View style={styles.itemsContainer}>
        <BillingDetail dataDefaulting={bdata} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  itemsContainer: {
    marginTop:15,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffff",
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#00509E", // Color for the active tab
  },
  tabText: {
    color: "black",
    fontWeight: "normal",
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
    fontSize: width * 0.06,
    color: "black",
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
    backgroundColor: "#ffff",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  totalText: {
    fontSize: 18,
    color: "black",
    paddingRight: 20,
    paddingLeft: 15,
    paddingTop: 5,
  },
  total: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 25,
    marginTop: 25,
  },
});

export default BookingDetails;
