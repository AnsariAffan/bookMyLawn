import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Avatar, TextInput, Dialog, Portal, Button, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile, updatePassword } from 'firebase/auth';
import { auth } from '../firebaseConfiguration/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const Settings = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editType, setEditType] = useState('');
  const [tempValue, setTempValue] = useState('');
  const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName || 'Username');
        setEmail(user.email || 'user@example.com');
        setImage(user.photoURL || null);
      }
    });
    return unsubscribe;
  }, []);

  const showDialog = (type) => {
    setEditType(type);
    setTempValue(type === 'username' ? username : email);
    setDialogVisible(true);
  };

  const hideDialog = () => setDialogVisible(false);

  const handleSave = async () => {
    try {
      if (editType === 'username') {
        await updateProfile(auth.currentUser, { displayName: tempValue });
        setUsername(tempValue);
      } else if (editType === 'email') {
        await auth.currentUser.updateEmail(tempValue);
        setEmail(tempValue);
      }
    } catch (error) {
      console.error(`Error updating ${editType}:`, error);
    } finally {
      hideDialog();
    }
  };

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
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const selectedImage = result.assets[0].uri;
        setImage(selectedImage);
        await updateProfile(auth.currentUser, { photoURL: selectedImage });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);
      await updatePassword(user, newPassword);
      alert('Password updated successfully!');
      setNewPassword('');
      setCurrentPassword('');
      setPasswordDialogVisible(false);
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please check your current password.');
    }
  };

  return (
    <LinearGradient colors={["#F5F7FA", "#E3F2FD"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Section */}
          <LinearGradient colors={["#FFFFFF", "#E3F2FD"]} style={styles.profileContainer}>
            <Animatable.View animation="fadeIn" duration={500}>
              <TouchableOpacity onPress={pickImage}>
                {image ? (
                  <Avatar.Image size={100} source={{ uri: image }} style={styles.avatar} />
                ) : (
                  <Avatar.Icon size={100} icon="account" style={styles.avatar} />
                )}
              </TouchableOpacity>
            </Animatable.View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
          </LinearGradient>

          {/* Settings Items */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => showDialog('username')}
              activeOpacity={0.7}
            >
              <View style={styles.iconTextContainer}>
                <Icon name="edit" size={24} color="#3B82F6" style={styles.icon} />
                <Text style={styles.title}>Change Username</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => setPasswordDialogVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.iconTextContainer}>
                <Icon name="lock" size={24} color="#3B82F6" style={styles.icon} />
                <Text style={styles.title}>Change Password</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('AboutContactUs')}
              activeOpacity={0.7}
            >
              <View style={styles.iconTextContainer}>
                <Icon name="info" size={24} color="#3B82F6" style={styles.icon} />
                <Text style={styles.title}>Contact Us & About Us</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.iconTextContainer}>
                <Icon name="exit-to-app" size={24} color="#EF5350" style={styles.icon} />
                <Text style={[styles.title, { color: "#EF5350" }]}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Dialogs */}
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog} style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>
              Edit {editType.charAt(0).toUpperCase() + editType.slice(1)}
            </Dialog.Title>
            <Dialog.Content>
              <TextInput
                label={`New ${editType.charAt(0).toUpperCase() + editType.slice(1)}`}
                value={tempValue}
                onChangeText={setTempValue}
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: "#3B82F6" } }}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog} textColor="#666666">Cancel</Button>
              <Button onPress={handleSave} textColor="#3B82F6">Save</Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog visible={passwordDialogVisible} onDismiss={() => setPasswordDialogVisible(false)} style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>Change Password</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Current Password"
                secureTextEntry
                value={currentPassword}
                onChangeText={setCurrentPassword}
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: "#3B82F6" } }}
              />
              <TextInput
                label="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: "#3B82F6" } }}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setPasswordDialogVisible(false)} textColor="#666666">Cancel</Button>
              <Button onPress={handleChangePassword} textColor="#3B82F6">Save</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  avatar: {
    marginBottom: 10,
    backgroundColor: '#E3F2FD',
  },
  username: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333333",
    fontFamily: "Roboto",
  },
  email: {
    fontSize: 16,
    color: "#666666",
    fontFamily: "Roboto",
    marginTop: 5,
  },
  section: {
    marginTop: 10,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
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
    fontWeight: "500",
    color: "#333333",
    fontFamily: "Roboto",
  },
  dialog: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  dialogTitle: {
    fontFamily: "Roboto",
    fontWeight: "600",
    color: "#333333",
  },
  input: {
    marginBottom: 10,
    fontFamily: "Roboto",
  },
});

export default Settings;