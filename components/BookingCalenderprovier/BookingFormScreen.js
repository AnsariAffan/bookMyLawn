import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Modal,
  Animated,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { BookingContext } from "../BookingCalenderprovier/BookingContext";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const BookingFormScreen = ({dataDefaulting}) => {
  const {
    selectedDates,
    setSelectedDates,
    newBooking,
    setNewBooking,
    loading,
    handleBookingSubmit,
    setMarkedDates,
  } = useContext(BookingContext);

  const navigation = useNavigation();
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [tempAssets, setTempAssets] = useState(newBooking.assets || []);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    if (!newBooking?.assets || newBooking.assets.length === 0) {
      const initialAssets = [
        { name: "छोटे बड़े गंज", included: false, quantity: 0, category: "Kitchen" },
        { name: "परात छोटी", included: false, quantity: 0, category: "Kitchen" },
        { name: "परात बड़ी", included: false, quantity: 0, category: "Kitchen" },
        { name: "कड़ाई", included: false, quantity: 0, category: "Kitchen" },
        { name: "बड़ी गंज", included: false, quantity: 0, category: "Kitchen" },
        { name: "गैस चूल्हा", included: false, quantity: 0, category: "Kitchen" },
        { name: "गैस सिपाई अम्बो", included: false, quantity: 0, category: "Kitchen" },
        { name: "स्टील बाल्टी", included: false, quantity: 0, category: "Kitchen" },
        { name: "पटिल", included: false, quantity: 0, category: "Kitchen" },
        { name: "फायदान पैन", included: false, quantity: 0, category: "Kitchen" },
        { name: "प्लेट", included: false, quantity: 0, category: "Serving" },
        { name: "कटोरी", included: false, quantity: 0, category: "Serving" },
        { name: "गिलास", included: false, quantity: 0, category: "Serving" },
        { name: "बरतन धोने का टब", included: false, quantity: 0, category: "Kitchen" },
        { name: "स्टील गिल का जग", included: false, quantity: 0, category: "Serving" },
        { name: "कन्टेनर", included: false, quantity: 0, category: "Storage" },
        { name: "गिलास स्टैंड", included: false, quantity: 0, category: "Serving" },
        { name: "छन्नी", included: false, quantity: 0, category: "Kitchen" },
        { name: "टोकरी", included: false, quantity: 0, category: "Storage" },
        { name: "लकड़ी चूल्हा", included: false, quantity: 0, category: "Kitchen" },
        { name: "डैग बड़ा मन", included: false, quantity: 0, category: "Kitchen" },
        { name: "डैग 2 मन", included: false, quantity: 0, category: "Kitchen" },
        { name: "डैग सवा मन", included: false, quantity: 0, category: "Kitchen" },
        { name: "पंखा", included: false, quantity: 0, category: "Equipment" },
        { name: "फुल्ली", included: false, quantity: 0, category: "Kitchen" },
        { name: "तेज हॉट सेट", included: false, quantity: 0, category: "Serving" },
        { name: "तेज हॉट चमचे", included: false, quantity: 0, category: "Serving" },
        { name: "जलेबी ट्रे", included: false, quantity: 0, category: "Serving" },
        { name: "सोफा", included: false, quantity: 0, category: "Furniture" },
        { name: "फाउंटेन राउंड बिना कवर", included: false, quantity: 0, category: "Decoration" },
        { name: "राउंड कवर के साथ", included: false, quantity: 0, category: "Decoration" },
        { name: "राउंड टेबल कवर", included: false, quantity: 0, category: "Furniture" },
        { name: "बफे टेबल", included: false, quantity: 0, category: "Furniture" },
        { name: "लॉर्न साइडिंग", included: false, quantity: 0, category: "Decoration" },
        { name: "किचन रेलिंग", included: false, quantity: 0, category: "Equipment" },
        { name: "गेट डेकोरेशन", included: false, quantity: 0, category: "Decoration" },
        { name: "लॉन में सेट पार्टीशन", included: false, quantity: 0, category: "Decoration" },
        { name: "फुल स्टेज डेकोरेशन", included: false, quantity: 0, category: "Decoration" },
        { name: "दुल्हन स्टेज डेकोरेशन", included: false, quantity: 0, category: "Decoration" },
        { name: "डायनिंग सेट पार्टीशन", included: false, quantity: 0, category: "Decoration" },
        { name: "इलुमिनेशन", included: false, quantity: 0, category: "Decoration" },
        { name: "मैरेज सोफा थ्री सीटर", included: false, quantity: 0, category: "Furniture" },
        { name: "मैरेज सोफा सिंगल सीटर", included: false, quantity: 0, category: "Furniture" },
        { name: "गाईड", included: false, quantity: 0, category: "Service" },
      ];
      setNewBooking((prevBooking) => ({
        ...prevBooking,
        assets: initialAssets,
      }));
      setTempAssets(initialAssets);
    } else {
      setTempAssets(newBooking.assets);
    }
  }, [newBooking, setNewBooking]);

  // const validateForm = () => {
  //   const newErrors = {};
  //   if (!newBooking.name ) newErrors.name = "Name is required";
  //   if (!newBooking.contact) {
  //     newErrors.contact = "Contact is required";
  //   } else if (!/^\d{10}$/.test(newBooking.contact)) {
  //     newErrors.contact = "Contact must be a 10-digit number";
  //   }
  //   if (!newBooking.email) {
  //     newErrors.email = "Email is required";
  //   } else if (!/\S+@\S+\.\S+/.test(newBooking.email)) {
  //     newErrors.email = "Email is invalid";
  //   }
  //   if (!newBooking.address) newErrors.address = "Address is required";
  //   if (!newBooking.eventType) newErrors.eventType = "Event Type is required";
  //   if (!newBooking.numberOfGuests) {
  //     newErrors.numberOfGuests = "Number of Guests is required";
  //   } else if (isNaN(newBooking.numberOfGuests) || newBooking.numberOfGuests <= 0) {
  //     newErrors.numberOfGuests = "Number of Guests must be a positive number";
  //   }
  //   if (!newBooking.totalAmount) {
  //     newErrors.totalAmount = "Total Amount is required";
  //   } else if (isNaN(newBooking.totalAmount) || newBooking.totalAmount <= 0) {
  //     newErrors.totalAmount = "Total Amount must be a positive number";
  //   }
  //   if (isNaN(newBooking.AdvBookAmount) || newBooking.AdvBookAmount < 0) {
  //     newErrors.AdvBookAmount = "Advance Amount must be a non-negative number";
  //   }
  //   if (!newBooking.requiresSetupAssistance) {
  //     newErrors.requiresSetupAssistance = "Setup Assistance is required";
  //   }
  //   tempAssets.forEach((asset, index) => {
  //     if (asset.included && asset.quantity <= 0) {
  //       newErrors[`assetQty_${index}`] = `Please select quantity for ${asset.name}`;
  //     }
  //   });
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };
const validateForm = () => {
  const newErrors = {};
  const bookingData = dataDefaulting || newBooking;  // Use dataDefaulting first, fallback to newBooking if not available.

  // Name validation
  if (!bookingData.name) newErrors.name = "Name is required";

  // Contact validation
  if (!bookingData.contact) {
    newErrors.contact = "Contact is required";
  } else if (!/^\d{10}$/.test(bookingData.contact)) {
    newErrors.contact = "Contact must be a 10-digit number";
  }

  // Email validation
  if (!bookingData.email) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(bookingData.email)) {
    newErrors.email = "Email is invalid";
  }

  // Address validation
  if (!bookingData.address) newErrors.address = "Address is required";

  // Event Type validation
  if (!bookingData.eventType) newErrors.eventType = "Event Type is required";

  // Number of Guests validation
  if (!bookingData.numberOfGuests) {
    newErrors.numberOfGuests = "Number of Guests is required";
  } else if (isNaN(bookingData.numberOfGuests) || bookingData.numberOfGuests <= 0) {
    newErrors.numberOfGuests = "Number of Guests must be a positive number";
  }

  // Total Amount validation
  if (!bookingData.totalAmount) {
    newErrors.totalAmount = "Total Amount is required";
  } else if (isNaN(bookingData.totalAmount) || bookingData.totalAmount <= 0) {
    newErrors.totalAmount = "Total Amount must be a positive number";
  }

  // Advance Booking Amount validation
  if (isNaN(bookingData.AdvBookAmount) || bookingData.AdvBookAmount < 0) {
    newErrors.AdvBookAmount = "Advance Amount must be a non-negative number";
  }

  // Setup Assistance validation
  if (!bookingData.requiresSetupAssistance) {
    newErrors.requiresSetupAssistance = "Setup Assistance is required";
  }

  // Asset quantity validation
  
  tempAssets.forEach((asset, index) => {
    if (asset.included && asset.quantity <= 0) {
      newErrors[`assetQty_${index}`] = `Please select quantity for ${asset.name}`;
    }
  });

  setErrors(newErrors);  // Set the errors state
  return Object.keys(newErrors).length === 0;  // Return whether the form is valid or not
};

  const handleBookingSubmitWrapper = () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please correct the errors in the form.");
      return;
    }
    setNewBooking((prev) => ({ ...prev, assets: tempAssets }));
    handleBookingSubmit().then((success) => {
      if (success) {
        setMarkedDates((prevMarkedDates) => {
          const updatedMarkedDates = { ...prevMarkedDates };
          selectedDates?.forEach((date) => {
            updatedMarkedDates[date] = {
              customStyles: {
                container: { backgroundColor: "#4DB6AC" },
                text: { color: "#000" },
              },
            };
          });
          console.log(updatedMarkedDates)
          return updatedMarkedDates;
         
        });
        setSelectedDates([]);
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to submit booking. Please try again.");
      }
    }).catch((error) => {
      console.error("Booking submit error:", error);
      Alert.alert("Error", "Error submitting booking: " + error.message);
    });
  };

  const toggleAssetSelection = (index) => {
    const updatedAssets = [...tempAssets];
    updatedAssets[index].included = !updatedAssets[index].included;
    updatedAssets[index].quantity = updatedAssets[index].included ? updatedAssets[index].quantity || 1 : 0;
    setTempAssets(updatedAssets);
  };

  const updateAssetQuantity = (index, value) => {
    const updatedAssets = [...tempAssets];
    updatedAssets[index].quantity = parseInt(value) || 0;
    setTempAssets(updatedAssets);
  };

  const applyAssetSelections = () => {
    setNewBooking((prev) => ({ ...prev, assets: tempAssets }));
    setModalVisible(false);
  };

  const quantityOptions = Array.from({ length: 101 }, (_, i) => i);

  // Group assets by category
  const groupedAssets = tempAssets.reduce((acc, asset, index) => {
    const category = asset.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push({ ...asset, originalIndex: index });
    return acc;
  }, {});

  const renderModernInput = ({ label, placeholder, icon, keyProp, keyboardType, multiline = false }) => (
    <View style={styles.modernInputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.modernInputWrapper, errors[keyProp] && styles.inputError]}>
        <Icon name={icon} size={22} color={errors[keyProp] ? "#FF6B6B" : "#6B7280"} style={styles.modernInputIcon} />
        <TextInput
          style={[styles.modernInput, multiline && styles.multilineInput]}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
   value={dataDefaulting ? dataDefaulting[keyProp]?.toString() : newBooking[keyProp]?.toString() || ""}
          onChangeText={(text) =>
            setNewBooking({
              ...newBooking,
              [keyProp]: keyboardType === "numeric" ? parseFloat(text) || 0 : text,
            })
          }
          keyboardType={keyboardType}
          multiline={multiline}
          autoCapitalize={keyProp === 'email' ? 'none' : 'sentences'}
        />
      </View>
      {errors[keyProp] && <Text style={styles.modernErrorText}>{errors[keyProp]}</Text>}
    </View>
  );

  const renderModernPicker = ({ label, icon, keyProp, options, placeholder }) => (
    <View style={styles.modernInputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.modernInputWrapper, errors[keyProp] && styles.inputError]}>
        <Icon name={icon} size={22} color={errors[keyProp] ? "#FF6B6B" : "#6B7280"} style={styles.modernInputIcon} />
        <Picker
          style={styles.modernPicker}
          selectedValue={newBooking[keyProp]}
          onValueChange={(value) => setNewBooking({ ...newBooking, [keyProp]: value })}
        >
          <Picker.Item label={placeholder} value="" />
          {options.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>
      {errors[keyProp] && <Text style={styles.modernErrorText}>{errors[keyProp]}</Text>}
    </View>
  );

  const renderAssetCategory = (category, assets) => (
    <View key={category} style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{category}</Text>
      {assets.map((asset) => (
        <View key={asset.originalIndex} style={styles.modernAssetRow}>
          <TouchableOpacity
            style={styles.modernAssetCheckbox}
            onPress={() => toggleAssetSelection(asset.originalIndex)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, asset.included && styles.checkboxChecked]}>
              {asset.included && <Icon name="check" size={16} color="#FFFFFF" />}
            </View>
            <Text style={styles.modernAssetName}>{asset.name}</Text>
          </TouchableOpacity>
          {asset.included && (
            <View style={styles.modernQuantityWrapper}>
              <Picker
                style={styles.modernAssetQtyPicker}
                selectedValue={asset.quantity}
                onValueChange={(value) => updateAssetQuantity(asset.originalIndex, value)}
              >
                <Picker.Item label="Qty" value={0} />
                {quantityOptions.slice(1).map((qty) => (
                  <Picker.Item key={qty} label={`${qty}`} value={qty} />
                ))}
              </Picker>
              {errors[`assetQty_${asset.originalIndex}`] && (
                <Text style={styles.modernErrorText}>{errors[`assetQty_${asset.originalIndex}`]}</Text>
              )}
            </View>
          )}
        </View>
      ))}
    </View>
  );

  const selectedAssets = newBooking.assets ? newBooking.assets.filter((asset) => asset.included) : [];

  return (
    <LinearGradient colors={["#F8FAFC", "#E2E8F0"]} style={styles.gradient}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        {dataDefaulting?"":<View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
       
          <Text style={styles.headerTitle}>New Booking</Text>
          <View style={styles.placeholder} />
        </View>}
        

        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Personal Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="person" size={24} color="#3B82F6" />
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>
            
            {renderModernInput({
              label: "Full Name",
              placeholder: "Enter your full name",
              icon: "person",
              keyProp: "name"
            })}
            
            {renderModernInput({
              label: "Contact Number",
              placeholder: "Enter 10-digit mobile number",
              icon: "phone",
              keyProp: "contact",
              keyboardType: "phone-pad"
            })}
            
            {renderModernInput({
              label: "Email Address",
              placeholder: "Enter your email address",
              icon: "email",
              keyProp: "email",
              keyboardType: "email-address"
            })}
            
            {renderModernInput({
              label: "Address",
              placeholder: "Enter complete address",
              icon: "location-on",
              keyProp: "address",
              multiline: true
            })}
          </View>

          {/* Event Details Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="event" size={24} color="#10B981" />
              <Text style={styles.cardTitle}>Event Details</Text>
            </View>
            
            {renderModernPicker({
              label: "Event Type",
              icon: "category",
              keyProp: "eventType",
              placeholder: "Select event type",
              options: ["Wedding", "Birthday Party", "Corporate Event", "Family Gathering", "Other"]
            })}
            
            {renderModernInput({
              label: "Number of Guests",
              placeholder: "Expected number of guests",
              icon: "group",
              keyProp: "numberOfGuests",
              keyboardType: "numeric"
            })}
            
            {renderModernPicker({
              label: "Setup Assistance",
              icon: "build",
              keyProp: "requiresSetupAssistance",
              placeholder: "Do you need setup assistance?",
              options: ["Yes", "No"]
            })}
          </View>

          {/* Financial Details Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="attach-money" size={24} color="#F59E0B" />
              <Text style={styles.cardTitle}>Financial Details</Text>
            </View>
            
            {renderModernInput({
              label: "Total Amount",
              placeholder: "Enter total booking amount",
              icon: "payment",
              keyProp: "totalAmount",
              keyboardType: "numeric"
            })}
            
            {renderModernInput({
              label: "Advance Amount",
              placeholder: "Enter advance payment",
              icon: "account-balance-wallet",
              keyProp: "AdvBookAmount",
              keyboardType: "numeric"
            })}
          </View>

          {/* Additional Details Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="note" size={24} color="#8B5CF6" />
              <Text style={styles.cardTitle}>Additional Information</Text>
            </View>
            
            {renderModernInput({
              label: "Special Requests",
              placeholder: "Any special requests or requirements",
              icon: "star",
              keyProp: "specialRequests",
              multiline: true
            })}
            
            {renderModernInput({
              label: "Additional Services",
              placeholder: "Any additional services needed",
              icon: "add-circle",
              keyProp: "additionalServices",
              multiline: true
            })}
          </View>

          {/* Assets Selection Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="inventory" size={24} color="#EF4444" />
              <Text style={styles.cardTitle}>Assets & Equipment</Text>
            </View>
            
            <TouchableOpacity
              style={styles.assetSelectButton}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.7}
            >
              <Icon name="list" size={20} color="#6B7280" />
              <Text style={styles.assetSelectText}>
                {selectedAssets.length > 0 
                  ? `${selectedAssets.length} items selected` 
                  : "Select assets & equipment"
                }
              </Text>
              <Icon name="chevron-right" size={20} color="#6B7280" />
            </TouchableOpacity>

            {/* Selected Assets Preview */}
            {selectedAssets.length > 0 && (
              <View style={styles.selectedAssetsPreview}>
                <Text style={styles.selectedAssetsTitle}>Selected Items:</Text>
                <View style={styles.selectedAssetsTags}>
                  {selectedAssets.slice(0, 3).map((asset, index) => (
                    <View key={index} style={styles.assetTag}>
                      <Text style={styles.assetTagText}>{asset.name} ({asset.quantity})</Text>
                    </View>
                  ))}
                  {selectedAssets.length > 3 && (
                    <View style={styles.assetTag}>
                      <Text style={styles.assetTagText}>+{selectedAssets.length - 3} more</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleBookingSubmitWrapper}
            disabled={loading}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={loading ? ["#9CA3AF", "#6B7280"] : ["#3B82F6", "#1D4ED8"]}
              style={styles.submitButtonGradient}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Icon name="check" size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Submit Booking</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Assets Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modernModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Assets & Equipment</Text>
                <TouchableOpacity 
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCloseButton}
                  activeOpacity={0.7}
                >
                  <Icon name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {Object.entries(groupedAssets).map(([category, assets]) =>
                  renderAssetCategory(category, assets)
                )}
              </ScrollView>
              
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.modalApplyButton}
                  onPress={applyAssetSelections}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={["#3B82F6", "#1D4ED8"]}
                    style={styles.modalApplyGradient}
                  >
                    <Text style={styles.modalApplyText}>Apply Selection</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepActive: {
    backgroundColor: '#3B82F6',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 10,
  },

  scrollContent: {
    paddingHorizontal: width*0,

  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  modernInputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  modernInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    minHeight: 52,
  },
  inputError: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FEF2F2',
  },
  modernInputIcon: {
    marginRight: 12,
  },
  modernInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 14,
  },
  multilineInput: {
    paddingTop: 14,
    paddingBottom: 14,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  modernPicker: {
    flex: 1,
    color: '#111827',
  },
  modernErrorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  assetSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  assetSelectText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  selectedAssetsPreview: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  selectedAssetsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 12,
  },
  selectedAssetsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  assetTag: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  assetTagText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: '500',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modernModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  modalCloseButton: {
    padding: 8,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoryContainer: {
    marginVertical: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  modernAssetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modernAssetCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  modernAssetName: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  modernQuantityWrapper: {
    width: 100,
  },
  modernAssetQtyPicker: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    height: 40,
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalApplyButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalApplyGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalApplyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
export default BookingFormScreen