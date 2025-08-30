import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert,
  Dimensions,
  StatusBar
} from 'react-native';
import { 
  Text, 
  Avatar, 
  TextInput, 
  Dialog, 
  Portal, 
  Button, 
  useTheme,
  Divider,
  Card,
  Badge
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile, updatePassword } from 'firebase/auth';
import { auth } from '../firebaseConfiguration/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

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
  
  // New settings states
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [language, setLanguage] = useState('English');
  const [storageUsed, setStorageUsed] = useState('2.3 GB');
  
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

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            try {
              await auth.signOut();
              navigation.navigate('LoginScreen');
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }
        }
      ]
    );
  };

  const handleChangePassword = async () => {
    try {
      const user = auth.currentUser;
      const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
      await user.reauthenticateWithCredential(credential);
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Password updated successfully!');
      setNewPassword('');
      setCurrentPassword('');
      setPasswordDialogVisible(false);
    } catch (error) {
      console.error('Error updating password:', error);
      Alert.alert('Error', 'Failed to update password. Please check your current password.');
    }
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent, color = "#667085" }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon name={icon} size={22} color={color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Icon name="chevron-right" size={24} color="#C4C4C4" />}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <LinearGradient colors={["#FAFBFC", "#F8FAFC"]} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#1F2937" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Settings</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Profile Card */}
            <Animatable.View animation="fadeInUp" duration={600} delay={100}>
              <Card style={styles.profileCard}>
                <LinearGradient
                  colors={["#667EEA", "#764BA2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.profileGradient}
                >
                  <TouchableOpacity onPress={pickImage} style={styles.profileContent}>
                    {image ? (
                      <Avatar.Image size={80} source={{ uri: image }} style={styles.profileAvatar} />
                    ) : (
                      <Avatar.Icon size={80} icon="account" style={styles.profileAvatar} />
                    )}
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>{username}</Text>
                      <Text style={styles.profileEmail}>{email}</Text>
                      <Badge style={styles.profileBadge}>Premium Member</Badge>
                    </View>
                  </TouchableOpacity>
                </LinearGradient>
              </Card>
            </Animatable.View>

            {/* Account Settings */}
            <Animatable.View animation="fadeInUp" duration={600} delay={200}>
              <SectionHeader title="Account" />
              <Card style={styles.settingCard}>
                <SettingItem
                  icon="person"
                  title="Edit Profile"
                  subtitle="Update your personal information"
                  onPress={() => showDialog('username')}
                  color="#667EEA"
                />
                <Divider style={styles.divider} />
                <SettingItem
                  icon="email"
                  title="Email Address"
                  subtitle={email}
                  onPress={() => showDialog('email')}
                  color="#10B981"
                />
                <Divider style={styles.divider} />
                <SettingItem
                  icon="lock"
                  title="Change Password"
                  subtitle="Update your security credentials"
                  onPress={() => setPasswordDialogVisible(true)}
                  color="#F59E0B"
                />
              </Card>
            </Animatable.View>

            {/* Preferences */}
            <Animatable.View animation="fadeInUp" duration={600} delay={300}>
              <SectionHeader title="Preferences" />
              <Card style={styles.settingCard}>
                <SettingItem
                  icon="dark-mode"
                  title="Dark Mode"
                  subtitle="Toggle dark theme"
                  rightComponent={
                    <Switch
                      value={darkMode}
                      onValueChange={setDarkMode}
                      trackColor={{ false: "#E5E5E5", true: "#667EEA" }}
                      thumbColor={darkMode ? "#FFFFFF" : "#F4F4F4"}
                    />
                  }
                  color="#6B7280"
                />
                <Divider style={styles.divider} />
                <SettingItem
                  icon="language"
                  title="Language"
                  subtitle={language}
                  onPress={() => {/* Language picker */}}
                  color="#8B5CF6"
                />
                <Divider style={styles.divider} />
                <SettingItem
                  icon="location-on"
                  title="Location Access"
                  subtitle="Allow location-based features"
                  rightComponent={
                    <Switch
                      value={locationAccess}
                      onValueChange={setLocationAccess}
                      trackColor={{ false: "#E5E5E5", true: "#667EEA" }}
                      thumbColor={locationAccess ? "#FFFFFF" : "#F4F4F4"}
                    />
                  }
                  color="#EF4444"
                />
              </Card>
            </Animatable.View>

            {/* Notifications */}
            <Animatable.View animation="fadeInUp" duration={600} delay={400}>
              <SectionHeader title="Notifications" />
              <Card style={styles.settingCard}>
                <SettingItem
                  icon="notifications"
                  title="Push Notifications"
                  subtitle="Receive app notifications"
                  rightComponent={
                    <Switch
                      value={pushNotifications}
                      onValueChange={setPushNotifications}
                      trackColor={{ false: "#E5E5E5", true: "#667EEA" }}
                      thumbColor={pushNotifications ? "#FFFFFF" : "#F4F4F4"}
                    />
                  }
                  color="#06B6D4"
                />
                <Divider style={styles.divider} />
                <SettingItem
                  icon="email"
                  title="Email Notifications"
                  subtitle="Receive updates via email"
                  rightComponent={
                    <Switch
                      value={emailNotifications}
                      onValueChange={setEmailNotifications}
                      trackColor={{ false: "#E5E5E5", true: "#667EEA" }}
                      thumbColor={emailNotifications ? "#FFFFFF" : "#F4F4F4"}
                    />
                  }
                  color="#10B981"
                />
              </Card>
            </Animatable.View>

            {/* Security & Privacy */}
            <Animatable.View animation="fadeInUp" duration={600} delay={500}>
              <SectionHeader title="Security & Privacy" />
              <Card style={styles.settingCard}>
                <SettingItem
                  icon="fingerprint"
                  title="Biometric Authentication"
                  subtitle="Use fingerprint or face unlock"
                  rightComponent={
                    <Switch
                      value={biometricAuth}
                      onValueChange={setBiometricAuth}
                      trackColor={{ false: "#E5E5E5", true: "#667EEA" }}
                      thumbColor={biometricAuth ? "#FFFFFF" : "#F4F4F4"}
                    />
                  }
                  color="#F59E0B"
                />
                <Divider style={styles.divider} />
                <SettingItem
                  icon="shield"
                  title="Privacy Policy"
                  subtitle="Review our privacy terms"
                  onPress={() => navigation.navigate('PrivacyPolicy')}
                  color="#8B5CF6"
                />
                <Divider style={styles.divider} />
                <SettingItem
                  icon="security"
                  title="Two-Factor Authentication"
                  subtitle="Add extra security layer"
                  onPress={() => navigation.navigate('TwoFactor')}
                  color="#EF4444"
                />
              </Card>
            </Animatable.View>

            {/* Storage & Backup */}
            <Animatable.View animation="fadeInUp" duration={600} delay={600}>
              <SectionHeader title="Storage & Backup" />
              <Card style={styles.settingCard}>
                <SettingItem
                  icon="cloud"
                  title="Auto Backup"
                  subtitle="Automatically backup your data"
                  rightComponent={
                    <Switch
                      value={autoBackup}
                      onValueChange={setAutoBackup}
                      trackColor={{ false: "#E5E5E5", true: "#667EEA" }}
                      thumbColor={autoBackup ? "#FFFFFF" : "#F4F4F4"}
                    />
                  }
                  color="#06B6D4"
                />
                <Divider style={styles.divider} />
                <SettingItem
                  icon="storage"
                  title="Storage Usage"
                  subtitle={`${storageUsed} of 5 GB used`}
                  onPress={() => navigation.navigate('StorageUsage')}
                  color="#F59E0B"
                />
              </Card>
            </Animatable.View>

            {/* Support */}
            <Animatable.View animation="fadeInUp" duration={600} delay={700}>
              <SectionHeader title="Support" />
              <Card style={styles.settingCard}>
                <SettingItem
                  icon="help"
                  title="Help Center"
                  subtitle="Get help and support"
                  onPress={() => navigation.navigate('HelpCenter')}
                  color="#10B981"
                />
                <Divider style={styles.divider} />
                <SettingItem
                  icon="info"
                  title="About & Contact"
                  subtitle="App info and contact details"
                  onPress={() => navigation.navigate('AboutContactUs')}
                  color="#667EEA"
                />
                <Divider style={styles.divider} />
                <SettingItem
                  icon="star"
                  title="Rate App"
                  subtitle="Rate us on the App Store"
                  onPress={() => {/* Rate app */}}
                  color="#F59E0B"
                />
              </Card>
            </Animatable.View>

            {/* Logout */}
            <Animatable.View animation="fadeInUp" duration={600} delay={800}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="exit-to-app" size={24} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </Animatable.View>
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
                  theme={{ colors: { primary: "#667EEA" } }}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog} textColor="#6B7280">Cancel</Button>
                <Button onPress={handleSave} textColor="#667EEA">Save</Button>
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
                  theme={{ colors: { primary: "#667EEA" } }}
                />
                <TextInput
                  label="New Password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  mode="outlined"
                  style={styles.input}
                  theme={{ colors: { primary: "#667EEA" } }}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setPasswordDialogVisible(false)} textColor="#6B7280">Cancel</Button>
                <Button onPress={handleChangePassword} textColor="#667EEA">Save</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </SafeAreaView>
      </LinearGradient>
    </>
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
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Roboto',
  },
  profileCard: {
    marginBottom: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 20,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Roboto',
    marginBottom: 8,
  },
  profileBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Roboto',
    marginBottom: 12,
    marginTop: 8,
  },
  settingCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    fontFamily: 'Roboto',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Roboto',
    marginTop: 2,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom:50,
    borderWidth: 1,
    borderColor: '#FECACA',
   
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    fontFamily: 'Roboto',
    marginLeft: 8,
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  dialogTitle: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    color: '#1F2937',
  },
  input: {
    marginBottom: 12,
    fontFamily: 'Roboto',
    backgroundColor: '#FFFFFF',
  },
});

export default Settings;