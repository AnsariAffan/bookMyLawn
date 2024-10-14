import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Image, View, StyleSheet, Linking } from 'react-native';
import { Avatar, Button, Text, IconButton, Appbar, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LawnProfile = () => {
    const navigation = useNavigation(); // Use navigation
    const lawnData = [
      require("../assets/download.jpeg"),
     
    ]

    const contactNumber = '1234567890'; // Replace with your desired phone number
    const handlePress = () => {
      Linking.openURL(`tel:${contactNumber}`);
    };

  return (
    
   <SafeAreaView>
      {/* Profile Section */}
      <View style={styles.profileSection} >
        {/* Avatar */}
        <SafeAreaView>
          <View style={styles.cardRow} >
          
            <Card style={styles.card}>
              <Card.Cover source={lawnData[0]} />
            </Card>
    
          </View>
          </SafeAreaView>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>50 INR</Text>
            <Text style={styles.statLabel}>Price</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>30k</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        {/* Edit and Share Profile Buttons */}
        <View style={styles.buttonsRow}>
          <Button mode="contained" onPress={(()=>{navigation.navigate("BookingScreen")})} style={styles.button}>Booking</Button>
    
          <Button mode="outlined" style={styles.button} onPress={handlePress}>
        <Icon name="phone" size={25} />
        Inquiry
      </Button>
        </View>

        {/* Bio Section */}
        <Text style={styles.bio}>
          Maya Rhodes{'\n'}
          Adventurous soul exploring hidden gems and local cultures. Embracing the unexpected and sharing spontaneous journeys. Let's explore the world together!
        </Text>

        {/* Social Icons */}
        <View style={styles.socialIconsRow}>
          <Icon name="instagram" size={30} />
          <Icon name="youtube" size={30} />
          <Icon name="star" size={30} />
          <Icon name="link" size={30} />
          <Icon name="map-marker" size={30} />
        </View>
      </View>

      {/* Gallery Section */}
      <View style={styles.gallerySection}>
        <View style={styles.imageRow}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://your-image-url.com/himalayas.png' }} 
              style={styles.image} 
            />
            <Text style={styles.imageOverlay}>Exploring the Himalayas</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://your-image-url.com/bali.png' }} 
              style={styles.image} 
            />
            <Text style={styles.imageOverlay}>Bali Escapades</Text>
          </View>
        </View>
        <View style={styles.imageRow}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://your-image-url.com/beach.png' }} 
              style={styles.image} 
            />
            <Text style={styles.imageOverlay}>Beach Vibes</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://your-image-url.com/sunset.png' }} 
              style={styles.image} 
            />
            <Text style={styles.imageOverlay}>Sunset Paradise</Text>
          </View>
        </View>
      </View>
      </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  profileSection: {
  
    alignItems: 'center',
    padding: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: 'gray',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  button: {
   
    marginHorizontal: 1,
    width:"48%"
  },
  bio: {
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  socialIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  gallerySection: {
    padding: 10,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: -50,
  },
  card: {
    width: "100%",
    height: 197,
  },
});

export default LawnProfile;
