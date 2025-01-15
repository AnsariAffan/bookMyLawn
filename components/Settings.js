import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar, List, TextInput, Dialog, Portal, Button, Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile, updatePassword } from 'firebase/auth'; // Import Firebase methods
import { auth } from '../firebaseConfiguration/firebaseConfig';

const Settings = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [visible, setVisible] = useState(false);
  const [editType, setEditType] = useState('');
  const [tempValue, setTempValue] = useState('');
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  // Fetch user details on component mount
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUsername(currentUser.displayName || 'Username');
      setEmail(currentUser.email || 'user@example.com');
      setImage(currentUser.photoURL || null);
    }
  }, []);

  // Show dialog to edit username or email
  const showDialog = (type) => {
    setEditType(type);
    setTempValue(type === 'username' ? username : email);
    setVisible(true);
  };

  // Show password change dialog
  const showPasswordDialog = () => {
    setPasswordDialogVisible(true);
  };

  // Hide the dialog
  const hideDialog = () => setVisible(false);

  // Hide password dialog
  const hidePasswordDialog = () => setPasswordDialogVisible(false);

  // Handle save action for updating display name or email
  const handleSave = async () => {
    if (editType === 'username') {
      try {
        await updateProfile(auth.currentUser, { displayName: tempValue });

        const currentUser = auth.currentUser;
        setUsername(currentUser.displayName); // Update username in state
      } catch (error) {
        console.error('Error updating displayName:', error);
      }
    } else if (editType === 'email') {
      try {
        await auth.currentUser.updateEmail(tempValue); // This will require email verification
        setEmail(tempValue); // Update email in state
      } catch (error) {
        console.error('Error updating email:', error);
      }
    }
    hideDialog();
  };

  // Pick and upload a new profile image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission to access media library was denied.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        setImage(selectedImage);
        await updateProfile(auth.currentUser, { photoURL: selectedImage });
      } else {
        console.log('Image selection was canceled.');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;

      // Re-authenticate the user to ensure they are allowed to change the password
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);

      // Update password
      await updatePassword(user, newPassword);
      alert('Password updated successfully!');
      setNewPassword('');
      setCurrentPassword('');
      hidePasswordDialog();
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please check your current password.');
    }
  };

  return (

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
        <View style={styles.section}>
        <TouchableOpacity style={styles.item} onPress={() => showDialog('username')}>
          <View style={styles.iconTextContainer}>
            <Text style={styles.icon}>✏️</Text>
            <Text style={styles.title}>Change Username</Text>
          </View>
        </TouchableOpacity>
      
        <TouchableOpacity style={styles.item} onPress={showPasswordDialog}>
          <View style={styles.iconTextContainer}>
            <Text style={styles.icon}>🔒</Text>
            <Text style={styles.title}>Change Password</Text>
          </View>
        </TouchableOpacity>
      
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('AboutContactUs')}>
          <View style={styles.iconTextContainer}>
            <Text style={styles.icon}>📄</Text>
            <Text style={styles.title}>Contact Us & About Us</Text>
          </View>
        </TouchableOpacity>
      
        <TouchableOpacity style={styles.item} onPress={handleLogout}>
          <View style={styles.iconTextContainer}>
            <Text style={styles.icon}>🚪</Text>
            <Text style={styles.title}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
      

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

          {/* Password change dialog */}
          <Dialog visible={passwordDialogVisible} onDismiss={hidePasswordDialog}>
        
            <Dialog.Content>
              <TextInput
                label="Current Password"
                secureTextEntry
                value={currentPassword}
                onChangeText={(text) => setCurrentPassword(text)}
              />
              <TextInput
                label="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hidePasswordDialog}>Cancel</Button>
              <Button onPress={handleChangePassword}>Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor:"white"
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 40,
  },
  username: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  color:"black"
  },
  email: {
    fontSize: 16,
     color:"black"
  },
  section: {
    marginTop: 20,

  
    paddingTop: 10,
  },
  item: {
    paddingVertical: 10,
  
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20, // Adjust the size of the icon
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    color: '#333', // Adjust the color to improve visibility
    fontWeight: 'bold',
  },
});

export default Settings;
