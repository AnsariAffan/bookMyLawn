import React, { useState, useEffect } from "react";
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
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../Authprovider.js/AuthProvider";
import {
  updateBillingData,
  onBillingDataChange,
} from "../../firebaseConfiguration/FirebaseCrud";

const { width } = Dimensions.get("window");

const Billingdetail = ({ dataDefaulting }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [billingData, setBillingData] = useState(dataDefaulting);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    if (billingData?.id) {
      const unsubscribe = onBillingDataChange(user.displayName, (updatedData) => {
        if (updatedData) {
          const newData = updatedData[billingData.id];
          if (newData) {
            setBillingData((prev) => ({ ...prev, ...newData }));
          }
        }
      });
      return () => unsubscribe;
    }
  }, [billingData?.id]);

  const handleMarkAsPaid = async () => {
    if (!billingData) {
      setDialogMessage("No billing data available.");
      setDialogVisible(true);
      return;
    }

    if (billingData.remainingAmount === 0) {
      setDialogMessage("This bill is already fully paid.");
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
      await updateBillingData(user.displayName, billingData.id, updatedDetails);
      setDialogMessage("Payment marked as fully paid successfully.");
    } catch (error) {
      setDialogMessage("Failed to update payment status. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      setDialogVisible(true);
    }
  };

  const handleContactPress = () => {
    if (dataDefaulting?.contact) {
      Linking.openURL(`tel:${dataDefaulting.contact}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

   {/* User Details Section */}
   <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
   <Card.Content>
     <Text style={styles.header}>User Details</Text>
     
     <View style={styles.detailsContainer}>
     
       <View style={styles.detailRow}>
         <Icon name="account" size={20} style={styles.icon} />
         <Text style={styles.label}>Name:</Text>
         <Text style={styles.value}>{dataDefaulting.name}</Text>
       </View>
       <View style={styles.detailRow}>
         <Icon name="map-marker" size={20} style={styles.icon} />
         <Text style={styles.label}>Address:</Text>
         <Text style={styles.value}>{dataDefaulting.address}</Text>
       </View>
       <TouchableOpacity onPress={handleContactPress}>
         <View style={styles.detailRow}>
           <Icon name="phone" size={20} style={styles.icon} />
           <Text style={styles.label}>Contact:</Text>
           <Text style={styles.value}>{dataDefaulting.contact}</Text>
         </View>
       </TouchableOpacity>
     </View>
   </Card.Content>
 </Card>


      {/* Billing Details Section */}
      <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
        <Card.Content>
          <Text style={styles.header}>Billing Details</Text>
          <View style={styles.detailsContainer}>
        
        
          <View style={styles.detailRow}>
          <Text style={styles.label}>Payment Status:</Text>
          <Text
            style={[
              styles.value,
              billingData.paymentStatus === "Fully Paid"
                ? styles.paid
                : styles.unpaid,
            ]}
          >
            {billingData.paymentStatus}
          </Text>
        </View>

            <View style={styles.detailRow}>
            <Text style={styles.label}>Booking Date</Text>
            <Text style={styles.value}>{billingData.dates}</Text>
          </View>

        
        
            
            <View style={styles.detailRow}>
              <Text style={styles.label}>Total Amount:</Text>
              <Text style={styles.value}>{billingData.totalAmount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Booking Amount:</Text>
              <Text style={styles.value}>{billingData.AdvBookAmount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Remaining Amount:</Text>
              <Text style={styles.value}>{billingData.remainingAmount}</Text>
            </View>
            <Text style={styles.label}>----------------------------------------------------------------------------------</Text>
            <View style={styles.detailRow}>
          
              <Text style={styles.label}>Total Received:</Text>
              <Text style={styles.value}>{billingData.totalReceivedAmount}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleMarkAsPaid}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Mark as Fully Paid</Text>
        )}
      </TouchableOpacity>

   
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Notification</Dialog.Title>
          <Dialog.Content>
            <Text>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
padding:5,
    backgroundColor: "#f9f9f9",
  },
  card: {
    borderRadius: 12,
    marginBottom: 10,
    elevation: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  detailsContainer: {
    marginVertical: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  icon: {
    marginRight: 10,
    color: "#666",
  },
  button: {
   
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  paid: {
    color: "green",
  },
  unpaid: {
    color: "red",
  },
});

export default Billingdetail;
