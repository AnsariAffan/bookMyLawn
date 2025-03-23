import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import {
  Text,
  Card,
  Button,
  Dialog,
  Portal,
  ActivityIndicator,
  useTheme,
  Appbar,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../Authprovider.js/AuthProvider";
import { updateBillingData, onBillingDataChange } from "../../firebaseConfiguration/FirebaseCrud";

const { width } = Dimensions.get("window");

const Billingdetail = ({ navigation, route }) => {
    const dataDefaulting = route?.params?.booking
    console.log(dataDefaulting);
  const theme = useTheme();
  const { user } = useAuth();
  const [billingData, setBillingData] = useState(dataDefaulting);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    if (billingData?.id) {
      const unsubscribe = onBillingDataChange(user.displayName, (updatedData) => {
        if (updatedData?.[billingData.id]) {
          setBillingData((prev) => ({ ...prev, ...updatedData[billingData.id] }));
        }
      });
      return unsubscribe || (() => {});
    }
  }, [billingData?.id, user.displayName]);

  const handleMarkAsPaid = useCallback(async () => {
    if (!billingData || billingData.remainingAmount === 0) {
      setDialogMessage(
        billingData?.remainingAmount === 0
          ? "This bill is already fully paid."
          : "No billing data available."
      );
      setDialogVisible(true);
      return;
    }

    const updatedDetails = {
      ...billingData,
      remainingAmount: 0,
      totalReceivedAmount: billingData.totalAmount,
      paymentStatus: "Fully Paid",
    };

    try {
      setLoading(true);
      await updateBillingData(user?.displayName, billingData?.id, updatedDetails);
      setDialogMessage("Payment marked as fully paid successfully.");
    } catch (error) {
      setDialogMessage("Failed to update payment status. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      setDialogVisible(true);
    }
  }, [billingData, user?.displayName]);

  const handleContactPress = useCallback(() => {
    if (dataDefaulting?.contact) {
      Linking.openURL(`tel:${dataDefaulting.contact}`);
    }
  }, [dataDefaulting?.contact]);
  const handlePrint = async () => {
    try {
      // await createPDF(); // Make sure it's awaited
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };
  const renderCustomerDetails = useMemo(() => (
    
    <Card style={styles.card}>
     
      <Card.Content>
        <Text style={styles.sectionHeader}>Customer Details</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Icon name="account" size={20} style={styles.icon} />
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{dataDefaulting.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="map-marker" size={20} style={styles.icon} />
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{dataDefaulting.address}</Text>
          </View>
          <TouchableOpacity onPress={handleContactPress}>
            <View style={styles.detailRow}>
              <Icon name="phone" size={20} style={styles.icon} />
              <Text style={styles.label}>Contact</Text>
              <Text style={[styles.value, styles.contactLink]}>{dataDefaulting.contact}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  ), [dataDefaulting, handleContactPress]);

  const renderBillingDetails = useMemo(() => (
    
    <Card style={styles.card2}>
      <Card.Content>
        <Text style={styles.sectionHeader}>Invoice Details</Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Payment Status</Text>
            <View
              style={[
                styles.statusBadge,
                billingData.paymentStatus === "Fully Paid"
                  ? styles.paidBadge
                  : styles.unpaidBadge,
              ]}
            >
              <Text style={styles.statusText}>{billingData.paymentStatus}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Booking Date</Text>
            <Text style={styles.value}>{billingData.dates}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Total Amount</Text>
            <Text style={[styles.value, styles.amount]}>₹{billingData.totalAmount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Booking Amount</Text>
            <Text style={styles.value}>₹{billingData.AdvBookAmount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Remaining Amount</Text>
            <Text style={[styles.value, { color: "#EF5350" }]}>₹{billingData.remainingAmount}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.label}>Total Received</Text>
            <Text style={[styles.value, { color: "#4CAF50" }]}>₹{billingData.totalReceivedAmount}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  ), [billingData]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <Appbar.Header style={{ backgroundColor: "#ffff" }}>
            <Appbar.BackAction
              style={{ color: "black", backgroundColor: "#ffff" }}
              onPress={() => navigation.goBack()}
            />
            <Appbar.Content
              style={{ paddingLeft: 10, fontWeight: "700" }}
              color="black"
              title="Details"
              subtitle="Step 2 of 3"
            />
            <Appbar.Action icon="printer" onPress={handlePrint} color="#4DB6AC" />
          </Appbar.Header> 
    <View style={styles.headerContainer}>
    <View Style={{display:"flex",flexDirection:"column",justifyContent:"space-evenlt]y"}}>
    <Text style={styles.headerTitle}>Invoice </Text>
    <Text style={styles.headerSubtitle}>Bill id:{dataDefaulting.id} </Text>
    </View>
     
        <Text style={styles.headerSubtitle}>Bill for {dataDefaulting.name}</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleMarkAsPaid}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.exportButtonText}>Mark As Fully Paid</Text>
          )}
        </TouchableOpacity>
      </View>
      {renderCustomerDetails}
      {renderBillingDetails}
      
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Notification</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)} textColor="#FF9900">
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: "#F5F5F5",
    
  },
  headerContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 10,
    
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 10,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF9900",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  exportIcon: {
    marginRight: 8,
  },
  exportButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  
  },
  card2: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  marginBottom:60
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 5,
  },
  detailsContainer: {
    marginVertical: 5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 16,
    color: "#666666",
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "right",
    flex: 1,
  },
  contactLink: {
    color: "#007185",
  },
  icon: {
    marginRight: 10,
    color: "#007185",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  paidBadge: {
    backgroundColor: "#4CAF50",
  },
  unpaidBadge: {
    backgroundColor: "#EF5350",
  },
  statusText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  amount: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#26A69A",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dialog: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  dialogMessage: {
    fontSize: 16,
    color: "#666666",
  },
});

export default Billingdetail;