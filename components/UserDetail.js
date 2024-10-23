import React, { useState } from "react";
import { View, StyleSheet, Linking ,TouchableOpacity} from "react-native";
import {
  Appbar,
  Text,
  Card,
  Title,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // or any other icon set

//test git



const UserDetail = () => {

const contactNumber = 34543543
    const handlePress = () => {
        Linking.openURL(`tel:${contactNumber}`);
      };


  return (

    <>
   

    <Card style={styles.card}>
    <Card.Content>
    <TouchableOpacity >
      <View style={styles.row}>
      <Icon name="calendar" size={25} color="#ffff"  style={{ marginRight:-90}} />
        <Text style={styles.itemText}>Booking Date</Text>
        <Text style={styles.priceText}>30-10-2024</Text>
      </View>
      </TouchableOpacity>
    </Card.Content>
  </Card>

  <Card style={styles.card}>
  <Card.Content>
  <TouchableOpacity >
    <View style={styles.row}>
    <Icon name="account-circle" size={25} color="#ffff"  style={{ marginRight:-130}} />
      <Text style={styles.itemText}>Name</Text>
      <Text style={styles.priceText}>Anam Firdaus</Text>
    </View>
    </TouchableOpacity>
  </Card.Content>
</Card>

  
  <Card style={styles.card}>
    <Card.Content>
    <TouchableOpacity>
      <View style={styles.row}>
      <Icon name="map-marker" size={25} color="#ffff"  style={{ marginRight:-160}} />
        <Text style={styles.itemText}>Address</Text>
        <Text style={styles.priceText}>Nagpur Kamptee</Text>
      </View>
      </TouchableOpacity>
    </Card.Content>
  </Card>

    
  <Card style={styles.card}>
    <Card.Content>
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.row}>
      <Icon name="phone" size={25} color="#ffff"  style={{ marginRight:-140}} />
        <Text style={styles.itemText}>Contact</Text>
        <Text style={styles.priceText}>{contactNumber}</Text>
      </View>
      </TouchableOpacity>
    </Card.Content>
  </Card>

  </>
  )
}

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

export default UserDetail