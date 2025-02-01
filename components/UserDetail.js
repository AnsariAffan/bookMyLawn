import React, { useEffect, useState } from "react";
import { View, StyleSheet, Linking, TouchableOpacity, Dimensions } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 

const { width, height } = Dimensions.get("window");

const UserDetail = ({ dataDefaulting }) => {
  const { colors } = useTheme(); // Use the theme for styling
  const [details, setDetails] = useState({ filteredHotels: [], hotels: [], loading: true });

  const handlePress = () => {
    Linking.openURL(`tel:${dataDefaulting.contact}`);
  };

  return (
    <>
      <Card style={[styles.card, { backgroundColor: colors.background, elevation: 4 }]}>
        <Card.Content>
          <TouchableOpacity>
            <View style={styles.row}>
              <Icon name="calendar" size={25} color={colors.text} style={styles.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>Booking Date</Text>
              <Text style={[styles.priceText, { color: colors.text }]}>{dataDefaulting.dates[0]}</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.background, elevation: 4 }]}>
        <Card.Content>
          <TouchableOpacity>
            <View style={styles.row}>
              <Icon name="account-circle" size={25} color={colors.text} style={styles.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>Name</Text>
              <Text style={[styles.priceText, { color: colors.text }]}>{dataDefaulting.name}</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.background, elevation: 4 }]}>
        <Card.Content>
          <TouchableOpacity>
            <View style={styles.row}>
              <Icon name="map-marker" size={25} color={colors.text} style={styles.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>Address</Text>
              <Text style={[styles.priceText, { color: colors.text }]}>{dataDefaulting.address}</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: colors.background, elevation: 4 }]}>
        <Card.Content>
          <TouchableOpacity onPress={handlePress}>
            <View style={styles.row}>
              <Icon name="phone" size={25} color={colors.text} style={styles.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>Contact</Text>
              <Text style={[styles.priceText, { color: colors.text }]}>{dataDefaulting.contact}</Text>
            </View>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: height * 0.01, // 2% of the screen height
    marginHorizontal: width * 0.00, // 5% of the screen width
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 15, // 4% of the screen width
    flex: 1,
    fontWeight: "600",
    fontStyle: "normal",
  },
  priceText: {
    fontSize: width * 0.035, // 3.5% of the screen width
    textAlign: "right",
    fontWeight: "600",
  },
  icon: {
    marginRight: width * 0.02, // 2% of the screen width,
  },
});

export default UserDetail;
