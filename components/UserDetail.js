import React, { useEffect, useState } from "react";
import { View, StyleSheet, Linking, TouchableOpacity, Dimensions } from "react-native";
import { Card, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 
import { readDocuments } from "../firebaseConfiguration/crudForBooking";

const { width, height } = Dimensions.get("window");

const UserDetail = ({ dataDefaulting }) => {
  const [details, setDetails] = useState({ filteredHotels: [], hotels: [], loading: true });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const fetchedHotels = await readDocuments("bookings");
        setDetails({
          filteredHotels: fetchedHotels,
          hotels: fetchedHotels,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching bookings: ", error);
        window.alert("Error fetching bookings: ", error);
        setDetails((prevState) => ({ ...prevState, loading: false }));
      }
    };

    fetchBookings();
  }, []);

  const handlePress = () => {
    Linking.openURL(`tel:${dataDefaulting.contact}`);
  };

  return (
    <>
      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity>
            <View style={styles.row}>
              <Icon name="calendar" size={25} color="#ffff" style={styles.icon} />
              <Text style={styles.itemText}>Booking Date</Text>
              <Text style={styles.priceText}>{dataDefaulting.dates[0]}</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity>
            <View style={styles.row}>
              <Icon name="account-circle" size={25} color="#ffff" style={styles.icon} />
              <Text style={styles.itemText}>Name</Text>
              <Text style={styles.priceText}>{dataDefaulting.name}</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity>
            <View style={styles.row}>
              <Icon name="map-marker" size={25} color="#ffff" style={styles.icon} />
              <Text style={styles.itemText}>Address</Text>
              <Text style={styles.priceText}>{dataDefaulting.address}</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity onPress={handlePress}>
            <View style={styles.row}>
              <Icon name="phone" size={25} color="#ffff" style={styles.icon} />
              <Text style={styles.itemText}>Contact</Text>
              <Text style={styles.priceText}>{dataDefaulting.contact}</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: height * 0.02, // 2% of the screen height
    marginHorizontal: width * 0.01, // 5% of the screen width
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: width * 0.04, // 4% of the screen width
    color: "#ffffff",
    flex: 1,
  },
  priceText: {
    fontSize: width * 0.035, // 3.5% of the screen width
    color: "lightblue",
    textAlign: "right",
  },
  icon: {
    marginRight: width * 0.02, // 2% of the screen width
  },
});

export default UserDetail;
