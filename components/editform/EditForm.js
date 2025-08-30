import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Authprovider.js/AuthProvider";
import { saveBillingData } from "../../firebaseConfiguration/FirebaseCrud";

const { width } = Dimensions.get("window");

const EditForm = ({ dataDefaulting }) => {
  console.log(dataDefaulting)
  const navigation = useNavigation();
  const { user } = useAuth();
  const [newBooking, setNewBooking] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    eventType: "",
    numberOfGuests: 0,
    additionalServices: "",
    specialRequests: "",
    requiresSetupAssistance: "",
    totalAmount: 0,
    AdvBookAmount: 0,
    paidAmount: 0,
    billingId: "",
    totalReceivedAmount: 0,
    assets: [],
  });
  const [selectedDates, setSelectedDates] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [tempAssets, setTempAssets] = useState([]);

  useEffect(() => {
    const initialAssets = [
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
    ];

    if (dataDefaulting) {
      setNewBooking({ ...dataDefaulting, assets: dataDefaulting.assets || initialAssets });
      setSelectedDates(dataDefaulting.dates || []);
      setTempAssets(dataDefaulting.assets || initialAssets);
    } else if (!newBooking.assets || newBooking.assets.length === 0) {
      setNewBooking((prev) => ({ ...prev, assets: initialAssets }));
      setTempAssets(initialAssets);
    } else {
      setTempAssets(newBooking.assets);
    }
  }, [dataDefaulting]);

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
    if (!newBooking.requiresSetupAssistance) {
      newErrors.requiresSetupAssistance = "Setup Assistance is required";
    }
    tempAssets.forEach((asset, index) => {
      if (asset.included && asset.quantity <= 0) {
        newErrors[`assetQty_${index}`] = `Please select quantity for ${asset.name}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookingSubmitWrapper = async () => {
    if (!validateForm()) {
      alert("Please correct the errors in the form.");
      return;
    }
    setLoading(true);
    try {
      setNewBooking((prev) => ({
        ...prev,
        assets: tempAssets,
        id: dataDefaulting?.id || prev.id || "",
      }));

      const paymentStatus =
        newBooking.AdvBookAmount >= newBooking.totalAmount
          ? "Fully Paid"
          : newBooking.AdvBookAmount > 0
          ? "Partially Paid"
          : "Not Paid";

      const updatedBooking = {
        ...newBooking,
        assets: tempAssets,
        dates: selectedDates,
        paymentStatus,
        totalReceivedAmount: newBooking.AdvBookAmount,
        remainingAmount: newBooking.totalAmount - newBooking.AdvBookAmount,
        userId: user?.uid || newBooking.userId || "",
        createdAt: new Date().toISOString(),
        status: "Approved",
        id: dataDefaulting?.id || newBooking.id || "",
      };

      await saveBillingData(user.displayName, updatedBooking);

      setMarkedDates((prevMarkedDates) => {
        const updatedMarkedDates = { ...prevMarkedDates };
        if (dataDefaulting?.dates) {
          dataDefaulting.dates.forEach((date) => delete updatedMarkedDates[date]);
        }
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
    } catch (error) {
      console.error("Booking submit error:", error);
      alert("Error submitting booking: " + error.message);
    } finally {
      setLoading(false);
    }
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

  const renderAssetItem = ({ item, index }) => (
    <View style={styles.assetRow}>
      <TouchableOpacity
        style={styles.assetCheckbox}
        onPress={() => toggleAssetSelection(index)}
      >
        <Icon
          name={item.included ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={item.included ? "#4DABF7" : "#666666"}
        />
        <Text style={styles.assetName}>{item.name}</Text>
      </TouchableOpacity>
      {item.included && (
        <View style={styles.quantityWrapper}>
          <Picker
            style={styles.assetQtyPicker}
            selectedValue={item.quantity}
            onValueChange={(value) => updateAssetQuantity(index, value)}
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
  );

  const renderSelectedAssetItem = ({ item }) => (
    <View style={styles.selectedAssetRow}>
      <Text style={styles.selectedAssetText}>
        {item.name} ({item.quantity})
      </Text>
    </View>
  );

  const selectedAssets = tempAssets.filter((asset) => asset.included);

  const renderHeader = () => (
    <View style={styles.inputContainer}>
      <Text style={styles.formTitle}>
        {dataDefaulting ? "Edit Booking Details" : "Enter Booking Details"}
      </Text>
      {[
        { placeholder: "Name", icon: "person", key: "name" },
        { placeholder: "Contact (10 digits)", icon: "phone", key: "contact", keyboardType: "phone-pad" },
        { placeholder: "Email", icon: "email", key: "email" },
        { placeholder: "Address", icon: "location-on", key: "address" },
        { placeholder: "Number of Guests", icon: "group", key: "numberOfGuests", keyboardType: "numeric" },
        { placeholder: "₹ Total Amount", key: "totalAmount", keyboardType: "numeric" },
        { placeholder: "Advance Booking Amount", icon: "payment", key: "AdvBookAmount", keyboardType: "numeric" },
        { placeholder: "Paid Amount", icon: "money", key: "paidAmount", keyboardType: "numeric" },
        { placeholder: "Billing ID", icon: "fingerprint", key: "billingId" },
        { placeholder: "Total Received Amount", icon: "account-balance", key: "totalReceivedAmount", keyboardType: "numeric" },
        { placeholder: "Special Requests", icon: "note", key: "specialRequests", multiline: true },
        { placeholder: "Additional Services", icon: "add", key: "additionalServices", multiline: true },
      ].map(({ placeholder, icon, key, keyboardType, multiline }) => (
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
      <View style={styles.inputWrapper}>
        <Icon name="build" size={20} color="#666666" style={styles.inputIcon} />
        <Picker
          style={styles.picker}
          selectedValue={newBooking.requiresSetupAssistance}
          onValueChange={(value) => setNewBooking({ ...newBooking, requiresSetupAssistance: value })}
        >
          <Picker.Item label="Requires Setup Assistance?" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>
        {errors.requiresSetupAssistance && (
          <Text style={styles.errorText}>{errors.requiresSetupAssistance}</Text>
        )}
      </View>
      <Text style={[styles.formTitle, { fontSize: 20 }]}>Select Assets</Text>
      <TouchableOpacity
        style={styles.inputWrapper}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="list" size={20} color="#666666" style={styles.inputIcon} />
        <Text style={[styles.input, { paddingVertical: 15 }]} numberOfLines={1}>
          {selectedAssets.length > 0 ? "Edit Selected Assets" : "Select Assets"}
        </Text>
      </TouchableOpacity>
      {selectedAssets.length > 0 && (
        <View style={styles.selectedAssetsContainer}>
          <Text style={styles.selectedAssetsTitle}>Selected Assets:</Text>
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient colors={["#F3F4F6", "#F3F4F6"]} style={styles.gradient}>
      <FlatList
        data={selectedAssets}
        renderItem={renderSelectedAssetItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={() => (
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
                    <Text style={styles.buttonText}>
                      {dataDefaulting ? "Update Booking" : "Submit Booking"}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.formContainer}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.formTitle, { fontSize: 20 }]}>Select Assets</Text>
            <FlatList
              data={tempAssets}
              renderItem={renderAssetItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.assetList}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
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
                onPress={applyAssetSelections}
              >
                <LinearGradient
                  colors={["#4DABF7", "#3B82F6"]}
                  style={styles.buttonGradient}
                >
                  <Icon name="check" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Apply</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1, paddingHorizontal: 15 },
  formContainer: { flexGrow: 1, paddingVertical: 20, alignItems: "left" },
  formTitle: { fontSize: 24, fontWeight: "600", color: "#333333", marginBottom: 20, fontFamily: "Roboto" },
  inputContainer: { width: "100%", marginBottom: 20 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F6",
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
    backgroundColor: "#F5F5F6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 10,
    padding: 10,
  },
  assetCheckbox: { flexDirection: "row", alignItems: "left", flex: 1 },
  assetName: { fontSize: 16, fontWeight: "500", color: "#333333", marginLeft: 10 },
  quantityWrapper: { width: 100, marginHorizontal: 10 },
  assetQtyPicker: { height: 40, backgroundColor: "#FFFFFF", borderRadius: 5, borderWidth: 1, borderColor: "#CCCCCC" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 20 },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000000",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: width * 0.9,
    maxHeight: "80%",
  },
  assetList: { maxHeight: "70%" },
  modalButtonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  selectedAssetsContainer: {
    marginBottom: 15,
    backgroundColor: "#F5F5F6",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedAssetsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
    fontFamily: "Roboto",
  },
  selectedAssetRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  selectedAssetText: {
    fontSize: 14,
    color: "#333333",
    fontFamily: "Roboto",
  },
});

export default EditForm;