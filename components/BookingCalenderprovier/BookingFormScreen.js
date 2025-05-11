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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { BookingContext } from "../BookingCalenderprovier/BookingContext";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const BookingFormScreen = () => {
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

  useEffect(() => {
    if (!newBooking?.assets || newBooking.assets.length === 0) {
      setNewBooking((prevBooking) => ({
        ...prevBooking,
        assets: [
          { name: "छोटे बड़े गंज", included: false, quantity: 0 },
          { name: "परात छोटी", included: false, quantity: 0 },
          { name: "परात बड़ी", included: false, quantity: 0 },
          { name: "कड़ाई", included: false, quantity: 0 },
          { name: "बड़ी गंज", included: false, quantity: 0 },
          { name: "गैस चूल्हा", included: false, quantity: 0 },
          { name: "गैस सिपाई अम्बो", included: false, quantity: 0 },
          { name: "स्टील बाल्टी", included: false, quantity: 0 },
          { name: "पटिल", included: false, quantity: 0 },
          { name: "फायदान पैन", included: false, quantity: 0 },
          { name: "प्लेट", included: false, quantity: 0 },
          { name: "कटोरी", included: false, quantity: 0 },
          { name: "गिलास", included: false, quantity: 0 },
          { name: "बरतन धोने का टब", included: false, quantity: 0 },
          { name: "स्टील गिल का जग", included: false, quantity: 0 },
          { name: "कन्टेनर", included: false, quantity: 0 },
          { name: "गिलास स्टैंड", included: false, quantity: 0 },
          { name: "छन्नी", included: false, quantity: 0 },
          { name: "टोकरी", included: false, quantity: 0 },
          { name: "लकड़ी चूल्हा", included: false, quantity: 0 },
          { name: "डैग बड़ा मन", included: false, quantity: 0 },
          { name: "डैग 2 मन", included: false, quantity: 0 },
          { name: "डैग सवा मन", included: false, quantity: 0 },
          { name: "पंखा", included: false, quantity: 0 },
          { name: "फुल्ली", included: false, quantity: 0 },
          { name: "तेज हॉट सेट", included: false, quantity: 0 },
          { name: "तेज हॉट चमचे", included: false, quantity: 0 },
          { name: "जलेबी ट्रे", included: false, quantity: 0 },
          { name: "सोफा", included: false, quantity: 0 },
          { name: "फाउंटेन राउंड बिना कवर", included: false, quantity: 0 },
          { name: "राउंड कवर के साथ", included: false, quantity: 0 },
          { name: "राउंड टेबल कवर", included: false, quantity: 0 },
          { name: "बफे टेबल", included: false, quantity: 0 },
          { name: "लॉर्न साइडिंग", included: false, quantity: 0 },
          { name: "किचन रेलिंग", included: false, quantity: 0 },
          { name: "गेट डेकोरेशन", included: false, quantity: 0 },
          { name: "लॉन में सेट पार्टीशन", included: false, quantity: 0 },
          { name: "फुल स्टेज डेकोरेशन", included: false, quantity: 0 },
          { name: "दुल्हन स्टेज डेकोरेशन", included: false, quantity: 0 },
          { name: "डायनिंग सेट पार्टीशन", included: false, quantity: 0 },
          { name: "इलुमिनेशन", included: false, quantity: 0 },
          { name: "मैरेज सोफा थ्री सीटर", included: false, quantity: 0 },
          { name: "मैरेज सोफा सिंगल सीटर", included: false, quantity: 0 },
          { name: "गाईड", included: false, quantity: 0 },
        ],
      }));
    }
  }, [newBooking]);

  const validateForm = () => {
    const newErrors = {};
    if (!newBooking.name) newErrors.name = "Name is required";
    if (!newBooking.contact) {
      newErrors.contact = "Contact is required";
    } else if (!/^\d{10}$/.test(newBooking.contact)) {
      newErrors.contact = "Contact must be a 10-digit number";
    }
    if (!newBooking.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newBooking.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!newBooking.address) newErrors.address = "Address is required";
    if (!newBooking.eventType) newErrors.eventType = "Event Type is required";
    if (!newBooking.numberOfGuests) {
      newErrors.numberOfGuests = "Number of Guests is required";
    } else if (isNaN(newBooking.numberOfGuests) || newBooking.numberOfGuests <= 0) {
      newErrors.numberOfGuests = "Number of Guests must be a positive number";
    }
    if (!newBooking.totalAmount) {
      newErrors.totalAmount = "Total Amount is required";
    } else if (isNaN(newBooking.totalAmount) || newBooking.totalAmount <= 0) {
      newErrors.totalAmount = "Total Amount must be a positive number";
    }
    if (isNaN(newBooking.AdvBookAmount) || newBooking.AdvBookAmount < 0) {
      newErrors.AdvBookAmount = "Advance Amount must be a non-negative number";
    }
    // Validate asset quantities
    newBooking.assets.forEach((asset, index) => {
      if (asset.included && asset.quantity <= 0) {
        newErrors[`assetQty_${index}`] = `Please select quantity for ${asset.name}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingSubmitWrapper = () => {
    if (!validateForm()) {
      alert("Please correct the errors in the form.");
      return;
    }
    handleBookingSubmit().then((success) => {
      if (success) {
        setMarkedDates((prevMarkedDates) => {
          const updatedMarkedDates = { ...prevMarkedDates };
          selectedDates.forEach((date) => {
            updatedMarkedDates[date] = {
              customStyles: {
                container: { backgroundColor: "#4DB6AC" },
                text: { color: "#000" },
              },
            };
          });
          return updatedMarkedDates;
        });
        setSelectedDates([]);
        navigation.goBack();
      } else {
        alert("Failed to submit booking. Please try again.");
      }
    }).catch((error) => {
      console.error("Booking submit error:", error);
      alert("Error submitting booking: " + error.message);
    });
  };

  const quantityOptions = Array.from({ length: 101 }, (_, i) => i); // 0 to 100

  return (
    <LinearGradient colors={["#F3F4F6", "#F3F4F6"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.formTitle}>Enter Booking Details</Text>
        <View style={styles.inputContainer}>
          {[
            { placeholder: "Name", icon: "person", key: "name" },
            { placeholder: "Contact (10 digits)", icon: "phone", key: "contact", keyboardType: "phone-pad" },
            { placeholder: "Email", icon: "email", key: "email" },
            { placeholder: "Address", icon: "location-on", key: "address" },
            { placeholder: "Number of Guests", icon: "group", key: "numberOfGuests", keyboardType: "numeric" },
            { placeholder: "₹ Total Amount", key: "totalAmount", keyboardType: "numeric" },
            { placeholder: "Advance Booking Amount", icon: "payment", key: "AdvBookAmount", keyboardType: "numeric" },
            { placeholder: "Special Requests", icon: "note", key: "specialRequests", multiline: true },
          ]?.map(({ placeholder, icon, key, keyboardType, multiline }) => (
            <View style={styles.inputWrapper} key={key}>
              {icon && <Icon name={icon} size={20} color="#666666" style={styles.inputIcon} />}
              <TextInput
                style={[styles.input, multiline && { height: 80, textAlignVertical: "top" }]}
                placeholder={placeholder}
                placeholderTextColor="#666666"
                value={newBooking[key]?.toString()}
                onChangeText={(text) =>
                  setNewBooking({
                    ...newBooking,
                    [key]: keyboardType === "numeric" ? parseFloat(text) || 0 : text,
                  })
                }
                keyboardType={keyboardType}
                multiline={multiline}
              />
              {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
            </View>
          ))}

          {/* Event Type Dropdown */}
          <View style={styles.inputWrapper}>
            <Icon name="event" size={20} color="#666666" style={styles.inputIcon} />
            <Picker
              style={styles.picker}
              selectedValue={newBooking.eventType}
              onValueChange={(value) => setNewBooking({ ...newBooking, eventType: value })}
            >
              <Picker.Item label="Select Event Type" value="" />
              <Picker.Item label="Wedding" value="Wedding" />
              <Picker.Item label="Birthday Party" value="Birthday Party" />
              <Picker.Item label="Corporate Event" value="Corporate Event" />
              <Picker.Item label="Family Gathering" value="Family Gathering" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
            {errors.eventType && <Text style={styles.errorText}>{errors.eventType}</Text>}
          </View>

          {/* Asset Selection */}
          <Text style={[styles.formTitle, { fontSize: 20 }]}>Select Assets</Text>
          {Array.isArray(newBooking.assets) &&
            newBooking.assets.map((asset, index) => (
              <View key={index} style={styles.assetRow}>
                <Text style={styles.assetName}>{asset.name}</Text>
                <Picker
                  style={styles.assetPicker}
                  selectedValue={asset.included ? "Yes" : "No"}
                  onValueChange={(value) => {
                    const updatedAssets = [...newBooking.assets];
                    updatedAssets[index].included = value === "Yes";
                    updatedAssets[index].quantity = value === "Yes" ? updatedAssets[index].quantity : 0;
                    setNewBooking({ ...newBooking, assets: updatedAssets });
                  }}
                >
                  <Picker.Item label="No" value="No" />
                  <Picker.Item label="Yes" value="Yes" />
                </Picker>
                {asset.included && (
                  <View style={styles.quantityWrapper}>
                    <Picker
                      style={styles.assetQtyPicker}
                      selectedValue={asset.quantity}
                      onValueChange={(value) => {
                        const updatedAssets = [...newBooking.assets];
                        updatedAssets[index].quantity = parseInt(value) || 0;
                        setNewBooking({ ...newBooking, assets: updatedAssets });
                      }}
                    >
                      <Picker.Item label="Qty" value={0} />
                      {quantityOptions.slice(1).map((qty) => (
                        <Picker.Item key={qty} label={`${qty}`} value={qty} />
                      ))}
                    </Picker>
                    {errors[`assetQty_${index}`] && (
                      <Text style={styles.errorText}>{errors[`assetQty_${index}`]}</Text>
                    )}
                  </View>
                )}
              </View>
            ))}

          {/* Redesigned Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF6B6B", "#EF5350"]}
                style={styles.buttonGradient}
              >
                <Icon name="close" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleBookingSubmitWrapper}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4DABF7", "#3B82F6"]}
                style={styles.buttonGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Icon name="check" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Submit Booking</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1, paddingHorizontal: 15 },
  formContainer: { flexGrow: 1, paddingVertical: 20, alignItems: "center" },
  formTitle: { fontSize: 24, fontWeight: "600", color: "#333333", marginBottom: 20, fontFamily: "Roboto" },
  inputContainer: { width: "100%", marginBottom: 20 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: "#333333", fontSize: 16, fontFamily: "Roboto" },
  picker: { flex: 1, height: 50, color: "#333333" },
  errorText: { color: "#EF5350", fontSize: 12, marginTop: 5, marginLeft: 10 },
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 10,
    padding: 10,
  },
  assetName: { flex: 1, fontSize: 16, fontWeight: "500", color: "#333" },
  assetPicker: { width: 100, height: 40, marginHorizontal: 10 },
  quantityWrapper: { width: 100, marginHorizontal: 10 },
  assetQtyPicker: { height: 40, backgroundColor: "#FFF", borderRadius: 5, borderWidth: 1, borderColor: "#CCC" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 20 },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cancelButton: {},
  submitButton: {},
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  buttonIcon: { marginRight: 8 },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Roboto",
    letterSpacing: 0.5,
  },
});

export default BookingFormScreen;