import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
  Animated,
  Share,
} from "react-native";
import {
  Text,
  Button,
  Dialog,
  Portal,
  ActivityIndicator,
  useTheme,
  Menu,
  Divider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

import { useAuth } from "../Authprovider.js/AuthProvider";
import {
  updateBillingData,
  onBillingDataChange,
} from "../../firebaseConfiguration/FirebaseCrud";
import { exportData } from "../utility/ExportData";

const BillingDetails = ({ navigation, dataDefaulting }) => {
  const theme = useTheme();
  const { user } = useAuth();

  const [billingData, setBillingData] = useState(dataDefaulting);
  const [loading, setLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [menuVisible, setMenuVisible] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // ----------------------------------------------
  // ANIMATION + FIREBASE SUBSCRIBER
  // ----------------------------------------------
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    if (billingData?.id) {
      const unsubscribe = onBillingDataChange(user.displayName, updatedData => {
        if (updatedData?.[billingData.id]) {
          setBillingData(prev => ({ ...prev, ...updatedData[billingData.id] }));
        }
      });
      return unsubscribe;
    }
  }, [billingData?.id, user.displayName]);

  // ----------------------------------------------
  // HANDLERS
  // ----------------------------------------------
  const handleMarkAsPaid = useCallback(async () => {
    if (!billingData || billingData.remainingAmount === 0) {
      setDialogMessage(
        billingData?.remainingAmount === 0
          ? "This invoice is already fully paid."
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
      await updateBillingData(user.displayName, billingData.id, updatedDetails);
      setDialogMessage("Payment marked as fully paid successfully!");
    } catch {
      setDialogMessage("Failed to update payment status. Please try again.");
    } finally {
      setLoading(false);
      setDialogVisible(true);
    }
  }, [billingData, user.displayName]);

  const handleContactPress = () => {
    if (dataDefaulting?.contact) Linking.openURL(`tel:${dataDefaulting.contact}`);
  };

  const handleEmailPress = () => {
    if (dataDefaulting?.email) Linking.openURL(`mailto:${dataDefaulting.email}`);
  };

  const handleShare = async () => {
    try {
      const content = `Invoice Details\n\nCustomer: ${dataDefaulting?.name}\nAmount: ₹${billingData?.totalAmount}\nStatus: ${billingData?.paymentStatus}\nDate: ${billingData?.dates}\n\nBill ID: ${dataDefaulting?.id}`;
      await Share.share({ message: content, title: "Invoice Details" });
    } catch (error) {
      console.error("Share Error:", error);
    }
  };

  const handlePrint = async (format = "pdf") => {
    try {
      setLoading(true);
      setMenuVisible(false);
      await exportData(billingData, format);
      setDialogMessage(`Successfully exported as ${format.toUpperCase()}!`);
    } catch (error) {
      setDialogMessage(error.message || `Error exporting ${format}.`);
    } finally {
      setLoading(false);
      setDialogVisible(true);
    }
  };

  // ----------------------------------------------
  // HELPERS
  // ----------------------------------------------
  const getStatusColor = status => {
    const colors = {
      "Fully Paid": { bg: "#E8F5E8", text: "#2E7D32", border: "#4CAF50" },
      "Partially Paid": { bg: "#FFF3E0", text: "#F57C00", border: "#FF9800" },
      Unpaid: { bg: "#FFEBEE", text: "#C62828", border: "#F44336" },
    };
    return colors[status] || { bg: "#F5F5F5", text: "#757575", border: "#BDBDBD" };
  };

  const colors = getStatusColor(billingData?.paymentStatus);
  const completion = billingData?.totalAmount
    ? ((billingData?.totalReceivedAmount || 0) / billingData.totalAmount) * 100
    : 0;

  // ----------------------------------------------
  // UI COMPONENTS (UNCHANGED)
  // ----------------------------------------------
  const renderHeader = () => (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.headerGradient}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />

      <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
        <View style={styles.headerTop}>
          {!dataDefaulting && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          <Text style={styles.headerTitle}>Invoice</Text>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                <Icon name="dots-vertical" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}
          >
            <Menu.Item onPress={() => handlePrint("pdf")} title="Export PDF" leadingIcon="file-pdf-box" />
            <Menu.Item onPress={() => handlePrint("excel")} title="Export Excel" leadingIcon="file-excel" />
            <Divider />
            <Menu.Item onPress={handleShare} title="Share Invoice" leadingIcon="share-variant" />
          </Menu>
        </View>

        <View style={styles.invoiceInfo}>
          <View>
            <Text style={styles.invoiceNumber}>#{dataDefaulting?.id?.slice(-8)}</Text>
            <Text style={styles.invoiceDate}>{dataDefaulting?.createdAt}</Text>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.totalAmountLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{billingData?.totalAmount}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Payment Progress</Text>
            <Text style={styles.progressPercentage}>{completion.toFixed(1)}%</Text>
          </View>

          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: `${completion}%` }]} />
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );

  const renderCustomerCard = () => (
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.modernCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <Icon name="account-circle" size={24} color="#667eea" />
          </View>
          <Text style={styles.cardTitle}>Customer Information</Text>
        </View>

        <View style={styles.customerDetails}>
          <View style={styles.detailItem}>
            <Icon name="account" size={20} color="#666" style={styles.detailIcon} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Customer Name</Text>
              <Text style={styles.detailValue}>{dataDefaulting?.name}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Icon name="map-marker" size={20} color="#666" style={styles.detailIcon} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{dataDefaulting?.address}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={handleContactPress} style={styles.detailItem}>
            <Icon name="phone" size={20} color="#667eea" style={styles.detailIcon} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone Number</Text>
              <Text style={[styles.detailValue, styles.contactLink]}>
                {dataDefaulting?.contact}
              </Text>
            </View>
            <Icon name="phone-dial" size={16} color="#667eea" />
          </TouchableOpacity>

          {dataDefaulting?.email && (
            <TouchableOpacity onPress={handleEmailPress} style={styles.detailItem}>
              <Icon name="email" size={20} color="#667eea" style={styles.detailIcon} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email Address</Text>
                <Text style={[styles.detailValue, styles.contactLink]}>
                  {dataDefaulting?.email}
                </Text>
              </View>
              <Icon name="email-send" size={16} color="#667eea" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );

  const renderPaymentCard = () => (
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={styles.modernCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <Icon name="credit-card" size={24} color="#4CAF50" />
          </View>

          <Text style={styles.cardTitle}>Payment Details</Text>

          <View style={[styles.statusBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <Text style={[styles.statusText, { color: colors.text }]}>
              {billingData?.paymentStatus}
            </Text>
          </View>
        </View>

        <View style={styles.paymentGrid}>
          {[
            { icon: "calendar-clock", label: "Booking Date", value: billingData?.dates },
            { icon: "currency-inr", label: "Total Amount", value: `₹${billingData?.totalAmount}` },
            { icon: "account-cash", label: "Advance Paid", value: `₹${billingData?.AdvBookAmount}` },
            { icon: "cash-check", label: "Total Received", value: `₹${billingData?.totalReceivedAmount}` },
            { icon: "cash-minus", label: "Remaining", value: `₹${billingData?.remainingAmount}` },
          ].map((item, idx) => (
            <View key={idx} style={styles.paymentItem}>
              <View style={styles.paymentIconContainer}>
                <Icon name={item.icon} size={20} color="#4CAF50" />
              </View>
              <Text style={styles.paymentLabel}>{item.label}</Text>
              <Text style={styles.paymentValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );

  const renderActionButton = () =>
    billingData?.remainingAmount > 0 && (
      <Animated.View style={[styles.actionContainer, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMarkAsPaid}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient colors={["#4CAF50", "#45a049"]} style={styles.actionButtonGradient}>
            {loading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                <Icon name="check-circle" size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Mark as Fully Paid</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );

  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderCustomerCard()}
        {renderPaymentCard()}
        {renderActionButton()}
      </ScrollView>

      {/* Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
          <Dialog.Icon icon="information" size={48} />
          <Dialog.Title style={styles.dialogTitle}>Notification</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>{dialogMessage}</Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)} mode="contained" buttonColor="#667eea">
              Got it
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

// STYLES (no changes made)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  headerGradient: {
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: { paddingHorizontal: 17 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },

  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#FFFFFF" },
  menuButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
  },

  menuContent: { backgroundColor: "#FFFFFF", borderRadius: 12 },

  invoiceInfo: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-end", marginBottom: 5,
  },
  invoiceNumber: { fontSize: 18, fontWeight: "600", color: "#FFF", marginBottom: 4 },
  invoiceDate: { fontSize: 14, color: "rgba(255,255,255,0.8)" },

  amountContainer: { alignItems: "flex-end" },
  totalAmountLabel: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 4 },
  totalAmount: { fontSize: 28, fontWeight: "700", color: "#FFFFFF" },

  progressContainer: { marginTop: 0 },
  progressInfo: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  progressLabel: { fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: "500" },
  progressPercentage: { fontSize: 14, color: "#FFF", fontWeight: "600" },
  progressBar: {
    height: 6, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 3, overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#FFF", borderRadius: 3 },

  scrollContent: { paddingHorizontal: 20, paddingVertical: 10, paddingBottom: 0 },

  cardContainer: { marginBottom: 6 },
  modernCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 20 },

  cardIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#1F2937", flex: 1 },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: { fontSize: 12, fontWeight: "600" },

  customerDetails: { gap: 16 },

  detailItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  detailIcon: { marginRight: 12, width: 24 },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 12, color: "#6B7280", marginBottom: 2 },
  detailValue: { fontSize: 16, color: "#1F2937", fontWeight: "500" },
  contactLink: { color: "#667eea" },

  paymentGrid: { gap: 16 },
  paymentItem: { flexDirection: "row", alignItems: "center" },

  paymentIconContainer: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  paymentLabel: { fontSize: 14, color: "#6B7280", fontWeight: "500", flex: 1 },
  paymentValue: { fontSize: 16, color: "#1F2937", fontWeight: "600" },

  actionContainer: { marginTop: 20, marginBottom: 20 },

  actionButton: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 8,
  },
  actionButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  actionButtonText: { fontSize: 16, fontWeight: "600", color: "#FFF" },

  dialog: { backgroundColor: "#FFFFFF", borderRadius: 16 },
  dialogTitle: { fontSize: 20, fontWeight: "600", textAlign: "center" },
  dialogMessage: { fontSize: 16, color: "#6B7280", textAlign: "center", lineHeight: 24 },
});

export default BillingDetails;
