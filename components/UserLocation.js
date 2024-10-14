import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, View } from "react-native";
import { Appbar, Button, Searchbar, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Use MaterialCommunityIcons for map-marker

const UserLocation = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const onChangeSearch = (query) => setSearchQuery(query);
  const navigation = useNavigation(); // Use navigation

  return (
    <View style={{ flex: 1, padding: 2 }}>
      <Appbar.Header
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <Appbar.Action
            icon={() => <Icon name="map-marker" size={24} color="black" />}
          />
          <Text style={{ paddingBottom: 10 }}>Kamptee</Text>
        </View>
      </Appbar.Header>
      
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={{ borderRadius: 0, width: "95%", margin: 10 }}
      />

      <View style={{ flex: 1, padding: 10 }}>
        <Text variant="titleLarge" style={{ marginVertical: 10 }}>
          Top Cities
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {[
            "Ahmedabad",
            "Bengaluru",
            "Chennai",
            "Delhi/NCR",
            "Hyderabad",
            "Jaipur",
            "Kolkata",
            "Lucknow",
            "Mumbai",
            "Pune",
            "Vijayawada",
            "Vizag",
          ].map((city) => (
            <Button
              key={city}
              mode="outlined"
              style={{ margin: 5, width: "30%" }}
              onPress={() => {}}
            >
              <Text>{city}</Text> {/* Ensure city name is wrapped in <Text> */}
            </Button>
          ))}
        </View>

        <Text variant="titleLarge" style={{ marginVertical: 10 }}>
          All Cities
        </Text>
        <ScrollView>
          {[
            "Abohar",
            "Abu Road",
            "Achampet",
            "Acharapakkam",
            "Addanki",
            "Adilabad",
            "Adipur",
          ].map((city) => (
            <Text key={city} style={{ paddingVertical: 10 }}>
              {city}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default UserLocation;
