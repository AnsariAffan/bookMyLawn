import * as React from "react";
import { Card, Text } from "react-native-paper";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
const LownCards = () => {
  const navigation = useNavigation(); // Get the navigation object
  const lawnData = [
    {
      name: "Green Shin Lawn",
      img: require("../assets/download.jpeg"),
    },
    {
      name: "Paradise Lawn",
      img: require("../assets/images.jpeg"),
    },
    {
      name: "Raj Royal Lawn",
      img:  require("../assets/download (1).jpeg"),
    },
   
  ];
  return (
   <View>
      {lawnData.map((dt) => {
        return (
          <SafeAreaView>
          <View style={styles.cardRow} >
          <TouchableWithoutFeedback
                onPress={() => navigation.navigate("LawnProfile", { lawnName: dt.name })}
              >
            <Card style={styles.card}>
              <Card.Cover source={dt.img} />
              <Text style={styles.title}>{dt.name}</Text>
            </Card>
            </TouchableWithoutFeedback>
          </View>
          </SafeAreaView>
        );
      })}
</View>
  );
};
const styles = StyleSheet.create({
  button: {
    margin: 16,
  },
  title: {
    position: "absolute",
    top: 160,
    left: 15,
    fontSize: 20,
    color: "white",
  },
  section: {
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  horizontalScroll: {
    marginVertical: 16,
  },
  scrollButton: {
    marginHorizontal: 8,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  card: {
    width: "100%",
    height: 197,
  },
});
export default LownCards;
