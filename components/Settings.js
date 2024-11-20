import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar, List, TextInput, Dialog, Portal, Button, Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './Authprovider.js/AuthProvider';  // Import useAuth hook
import { storeUserInformation } from './Authprovider.js/userManagement';

const Settings = ({ navigation }) => {
  const { user, signOut } = useAuth();  // Get signOut from context
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState(user?.displayName);  // Using user info from context
  const [email, setEmail] = useState(user?.email || 'user@example.com');
  const [visible, setVisible] = useState(false);
  const [editType, setEditType] = useState('');
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    // Reset the fields if the user changes in the context
    console.log(user);
    setUsername(user?.displayName || 'Username');
    setEmail(user?.email || 'user@example.com');
  }, [user]);

  const showDialog = (type) => {
    setEditType(type);
    setTempValue(type === 'username' ? username : email);
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const handleSave = async () => {
    if (editType === 'username') {
      setUsername(tempValue);
    } else if (editType === 'email') {
      setEmail(tempValue);
    }
    hideDialog();

    // Update Firestore with the new user information
    try {
      await storeUserInformation({
        ...user,
        displayName: username,
        email: email,
      });
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();  // Call the signOut function from context
      // Optionally navigate to login screen or any other screen after logout
      navigation.navigate('LoginScreen');  // Ensure you have navigation set up
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Avatar.Image size={100} source={{ uri: image }} />
            ) : (
              <Avatar.Icon size={100} icon="account" />
            )}
          </TouchableOpacity>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <List.Section>
          <List.Item
            title="Change Username"
            left={() => <List.Icon icon="account-edit" />}
            onPress={() => showDialog('username')}
          />
          
          <List.Item
            title="Change Password"
            left={() => <List.Icon icon="lock-reset" />}
            onPress={() => console.log('Change Password')}
          />
          
          <List.Item
            title="Theme"
            left={() => <List.Icon icon="theme-light-dark" />}
            onPress={() => console.log('Change Theme')}
          />
          
          <List.Item
            title="Contact Us & About Us"
            left={() => <List.Icon icon="file-document-outline" />}
            onPress={() => console.log('Logger Details')}
          />

          <List.Item
            title="Logout"
            left={() => <List.Icon icon="logout" />}
            onPress={handleLogout}  // Call handleLogout on logout
          />
        </List.Section>

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Edit {editType.charAt(0).toUpperCase() + editType.slice(1)}</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label={`New ${editType.charAt(0).toUpperCase() + editType.slice(1)}`}
                value={tempValue}
                onChangeText={(text) => setTempValue(text)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
              <Button onPress={handleSave}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
});

export default Settings;
