import React from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";

const BookLawnFilter = () => {
  return (
    <ScrollView horizontal={true} style={styles.horizontalScroll}>
      <Button onPress={() => {}} style={styles.scrollButton}>
        Veg
      </Button>
      <Button onPress={() => {}} style={styles.scrollButton}>
        Non-Veg
      </Button>
      <Button onPress={() => {}} style={styles.scrollButton}>
        Veg & Non-Veg
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 16,
  },
  section: {
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  horizontalScroll: {
    marginVertical: 10,
  },
  scrollButton: {
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    color:"black"
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  card: {
    width: 150,
    height: 200,
  },
});

export default BookLawnFilter;
