import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  StatusBar,
  Animated,
  Share,
} from "react-native";
import {
  Text,
  Card,
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

const { width, height } = Dimensions.get("window");

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

  useEffect(() => {
    // Animate components on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    if (billingData?.id) {
      const unsubscribe = onBillingDataChange(
        user.displayName,
        (updatedData) => {
          if (updatedData?.[billingData.id]) {
            setBillingData((prev) => ({
              ...prev,
              ...updatedData[billingData.id],
            }));
          }
        }
      );
      return unsubscribe || (() => {});
    }
  }, [billingData?.id, user.displayName]);

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
      totalReceivedAmount: billingData?.totalAmount,
      paymentStatus: "Fully Paid",
    };

    try {
      setLoading(true);
      await updateBillingData(
        user?.displayName,
        billingData?.id,
        updatedDetails
      );
      setDialogMessage("Payment marked as fully paid successfully!");
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

  const handleEmailPress = useCallback(() => {
    if (dataDefaulting?.email) {
      Linking.openURL(`mailto:${dataDefaulting.email}`);
    }
  }, [dataDefaulting?.email]);

  const handleShare = useCallback(async () => {
    try {
      const shareContent = `Invoice Details\n\nCustomer: ${dataDefaulting?.name}\nAmount: ₹${billingData?.totalAmount}\nStatus: ${billingData?.paymentStatus}\nDate: ${billingData?.dates}\n\nBill ID: ${dataDefaulting?.id}`;
      
      await Share.share({
        message: shareContent,
        title: 'Invoice Details',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }, [dataDefaulting, billingData]);

  const handlePrint = async (format = "pdf") => {
    try {
      setLoading(true);
      setMenuVisible(false);
      await exportData(billingData, format);
      setDialogMessage(`Successfully exported as ${format.toUpperCase()}!`);
    } catch (error) {
      setDialogMessage(error.message || `Error exporting ${format.toUpperCase()}. Please try again.`);
      console.error(error);
    } finally {
      setLoading(false);
      setDialogVisible(true);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Fully Paid":
        return { bg: "#E8F5E8", text: "#2E7D32", border: "#4CAF50" };
      case "Partially Paid":
        return { bg: "#FFF3E0", text: "#F57C00", border: "#FF9800" };
      case "Unpaid":
        return { bg: "#FFEBEE", text: "#C62828", border: "#F44336" };
      default:
        return { bg: "#F5F5F5", text: "#757575", border: "#BDBDBD" };
    }
  };

  const statusColors = getStatusColor(billingData?.paymentStatus);
  const completionPercentage = billingData?.totalAmount > 0 
    ? ((billingData?.totalReceivedAmount || 0) / billingData?.totalAmount) * 100 
    : 0;

  const renderHeader = () => (
    <LinearGradient
      colors={["#667eea", "#764ba2"]}
      style={styles.headerGradient}
    >
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
        <View style={styles.headerTop}>
        {dataDefaulting?"": <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>}
         
          
          <Text style={styles.headerTitle}>Invoice</Text>
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setMenuVisible(true)}
                style={styles.menuButton}
              >
                <Icon name="dots-vertical" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            }
            contentStyle={styles.menuContent}
          >
            <Menu.Item
              onPress={() => handlePrint("pdf")}
              title="Export PDF"
              leadingIcon="file-pdf-box"
            />
            <Menu.Item
              onPress={() => handlePrint("excel")}
              title="Export Excel"
              leadingIcon="file-excel"
            />
            <Divider />
            <Menu.Item
              onPress={handleShare}
              title="Share Invoice"
              leadingIcon="share-variant"
            />
          </Menu>
        </View>

        <View style={styles.invoiceInfo}>
          <View style={styles.invoiceDetails}>
            <Text style={styles.invoiceNumber}>#{dataDefaulting?.id?.slice(-8)}</Text>
            <Text style={styles.invoiceDate}>{dataDefaulting?.createdAt}</Text>
          </View>
          
          <View style={styles.amountContainer}>
            <Text style={styles.totalAmountLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{billingData?.totalAmount}</Text>
          </View>
        </View>

        {/* Payment Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Payment Progress</Text>
            <Text style={styles.progressPercentage}>{completionPercentage.toFixed(1)}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { width: `${completionPercentage}%` }
                ]}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );

  const renderCustomerCard = () => (
    <Animated.View style={[styles.cardContainer, { 
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }]}>
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
    <Animated.View style={[styles.cardContainer, { 
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }]
    }]}>
      <View style={styles.modernCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <Icon name="credit-card" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.cardTitle}>Payment Details</Text>
          <View style={[styles.statusBadge, { 
            backgroundColor: statusColors.bg,
            borderColor: statusColors.border 
          }]}>
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {billingData?.paymentStatus}
            </Text>
          </View>
        </View>

        <View style={styles.paymentGrid}>
          <View style={styles.paymentItem}>
            <View style={styles.paymentIconContainer}>
              <Icon name="calendar-clock" size={20} color="#FF9800" />
            </View>
            <Text style={styles.paymentLabel}>Booking Date</Text>
            <Text style={styles.paymentValue}>{billingData?.dates}</Text>
          </View>

          <View style={styles.paymentItem}>
            <View style={styles.paymentIconContainer}>
              <Icon name="currency-inr" size={20} color="#2196F3" />
            </View>
            <Text style={styles.paymentLabel}>Total Amount</Text>
            <Text style={[styles.paymentValue, styles.amountText]}>
              ₹{billingData?.totalAmount}
            </Text>
          </View>

          <View style={styles.paymentItem}>
            <View style={styles.paymentIconContainer}>
              <Icon name="account-cash" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.paymentLabel}>Advance Paid</Text>
            <Text style={[styles.paymentValue, { color: "#4CAF50" }]}>
              ₹{billingData?.AdvBookAmount}
            </Text>
          </View>

          <View style={styles.paymentItem}>
            <View style={styles.paymentIconContainer}>
              <Icon name="cash-check" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.paymentLabel}>Total Received</Text>
            <Text style={[styles.paymentValue, { color: "#4CAF50" }]}>
              ₹{billingData?.totalReceivedAmount}
            </Text>
          </View>

          <View style={styles.paymentItem}>
            <View style={styles.paymentIconContainer}>
              <Icon name="cash-minus" size={20} color="#F44336" />
            </View>
            <Text style={styles.paymentLabel}>Remaining</Text>
            <Text style={[styles.paymentValue, { color: "#F44336" }]}>
              ₹{billingData?.remainingAmount}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderActionButton = () => (
    <Animated.View style={[styles.actionContainer, { opacity: fadeAnim }]}>
      {billingData?.remainingAmount > 0 && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleMarkAsPaid}
          disabled={loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4CAF50", "#45a049"]}
            style={styles.actionButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Icon name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>Mark as Fully Paid</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderCustomerCard()}
        {renderPaymentCard()}
        {renderActionButton()}
      </ScrollView>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Icon icon="information" size={48} />
          <Dialog.Title style={styles.dialogTitle}>Notification</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={() => setDialogVisible(false)} 
              mode="contained"
              buttonColor="#667eea"
            >
              Got it
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  invoiceInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 5,
  },
  invoiceDetails: {
    flex: 1,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  invoiceDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  totalAmountLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  progressContainer: {
    marginTop: 0,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  progressPercentage: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 0,
  },
  cardContainer: {
    marginBottom: 6,
  },
  modernCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F4FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  customerDetails: {
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailIcon: {
    marginRight: 12,
    width: 24,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  contactLink: {
    color: "#667eea",
  },
  paymentGrid: {
    gap: 16,
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",

  },
  paymentIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  paymentValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },
  amountText: {
    fontSize: 18,
    fontWeight: "700",
  },
  actionContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  dialog: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
  dialogMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
});

export default BillingDetails;