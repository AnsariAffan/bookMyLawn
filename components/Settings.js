import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Avatar, TextInput, Dialog, Portal, Button, Provider, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importing Material Icons
import * as ImagePicker from 'expo-image-picker';
import { updateProfile, updatePassword, getAuth } from 'firebase/auth'; // Import Firebase methods
import { auth } from '../firebaseConfiguration/firebaseConfig';
import { version } from '../package.json';

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
  const theme = useTheme();


      // Ensure auth is defined and onAuthStateChanged exists
      const unsubscribe = auth?.onAuthStateChanged((user) => {
        if (user) {
          setUsername(user?.displayName || 'Username');
          setEmail(user?.email || 'user@example.com');
          setImage(user?.photoURL || null);  // Update photoURL from Firebase
        } else {
          setUsername('');
          setEmail('');
          setImage(null);
        }
      });
  
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

        // Update the state with the selected image
        setImage(selectedImage);

        // Update the photoURL in Firebase
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickImage}>
            {image ? (
              <Avatar.Image size={120} source={{ uri: image }} style={styles.avatar} />
            ) : (
              <Avatar.Icon size={120} icon="account" style={styles.avatar} />
            )}
          </TouchableOpacity>
          <Text style={[styles.username, { color: '#000000' }]}>{username}</Text>
          <Text style={[styles.email, { color: '#000000' }]}>{email}</Text>
             </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.item} onPress={() => showDialog('username')}>
            <View style={styles.iconTextContainer}>
              <Icon name="edit" size={24} color={theme.colors.text} style={styles.icon} />
              <Text style={[styles.title, { color: theme.colors.text }]}>Change Username</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={showPasswordDialog}>
            <View style={styles.iconTextContainer}>
              <Icon name="lock" size={24} color={theme.colors.text} style={styles.icon} />
              <Text style={[styles.title, { color: theme.colors.text }]}>Change Password</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('AboutContactUs')}>
            <View style={styles.iconTextContainer}>
              <Icon name="info" size={24} color={theme.colors.text} style={styles.icon} />
              <Text style={[styles.title, { color: theme.colors.text }]}>Contact Us & About Us</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <View style={styles.iconTextContainer}>
              <Icon name="exit-to-app" size={24} color={theme.colors.text} style={styles.icon} />
              <Text style={[styles.title, { color: theme.colors.text }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Edit {editType.charAt(0).toUpperCase() + editType.slice(1)}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={`New ${editType.charAt(0).toUpperCase() + editType.slice(1)}`}
              value={tempValue}
              onChangeText={(text) => setTempValue(text)}
              mode="outlined"
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
              mode="outlined"
            />
            <TextInput
              label="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
              mode="outlined"
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
  },
  versionContainer: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    color: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 10,
    backgroundColor: '#e1e1e1',
  },
  username: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
  
  },
  email: {
    fontSize: 16,
  },
  section: {
    marginTop: 20,
    paddingTop: 10,
  },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Settings;