import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Text, Card, Title, ActivityIndicator, useTheme, Dialog, Portal, Button } from "react-native-paper";
import { updateBillingData, onBillingDataChange } from "../../firebaseConfiguration/FirebaseCrud";
import { useAuth } from "../Authprovider.js/AuthProvider";

const { width, height } = Dimensions.get('window');

const BillingDetail = ({ dataDefaulting }) => {
    const theme = useTheme(); // Use the theme
    const { user } = useAuth(); // Get current logged-in user
    const [isLoading, setIsLoading] = useState(false);
    const [updatedData, setUpdatedData] = useState(dataDefaulting); // Initialize with the default data
    const [visibleDialog, setVisibleDialog] = useState(false); // Manage Dialog visibility
    const [dialogMessage, setDialogMessage] = useState(""); // Message to be displayed in dialog

    // Real-time data listener for updating UI based on Firebase changes
    useEffect(() => {
        if (updatedData?.id) {
            const unsubscribe = onBillingDataChange(user.displayName, (newData) => {
                console.log("Received real-time update:", newData);

                if (newData) {
                    setUpdatedData((prevData) => {
                        if (!prevData) return prevData; // Ensure prevData exists

                        const newEntry = newData[prevData.id];
                        if (!newEntry) return prevData; // No relevant updates

                        // Merge the new data while preserving arrays and nested fields
                        return {
                            ...prevData,
                            ...newEntry,
                            dates: Array.isArray(newEntry.dates) ? [...newEntry.dates] : prevData.dates, // Preserve dates
                        };
                    });
                }
            });

            // Cleanup listener on unmount or dependency change
            return () => {
                console.log("Cleaning up real-time listener");
                unsubscribe
            };
        }
    }, [updatedData?.id]);

    // Mark as Fully Paid button handler
    const handleMarkAsFullyPaid = async () => {
        if (!updatedData) {
            setDialogMessage("No billing data available.");
            setVisibleDialog(true);
            return;
        }

        const { remainingAmount, totalReceivedAmount } = updatedData;

        if (remainingAmount === 0) {
            setDialogMessage("Already Fully Paid");
            setVisibleDialog(true);
            return;
        }

        const paidAmountToMarkFullyPaid = Number(remainingAmount) + Number(totalReceivedAmount);

        // Prepare updated billing details
        const updatedBillingDetails = {
            ...updatedData,
            paidAmount: paidAmountToMarkFullyPaid,
            remainingAmount: 0, // Fully paid means no remaining amount
            paymentStatus: "Fully Paid",
            totalReceivedAmount: paidAmountToMarkFullyPaid,
        };

        try {
            setIsLoading(true);

            if (!updatedData.id) {
                setDialogMessage("Invalid Bill ID.");
                setVisibleDialog(true);
                setIsLoading(false);
                return;
            }

            // Update document in Firebase
            await updateBillingData(user?.displayName, updatedData.id, updatedBillingDetails);
            console.log("Updated billing details:", updatedBillingDetails);
            setIsLoading(false);
            setDialogMessage("The amount has been marked as fully paid.");
            setVisibleDialog(true);
        } catch (error) {
            console.error("Failed to update document:", error);
            setIsLoading(false);
            setDialogMessage("Failed to update payment status. Please try again.");
            setVisibleDialog(true);
        }
    };

    return (
        <>
            <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={[styles.itemText, { color: theme.colors.text }]}>Billing Date</Text>
                        <Text style={[styles.priceText, { color: theme.colors.text }]}>{new Date().toLocaleString('default', { day: '2-digit', month: 'long', year: 'numeric' })}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={[styles.itemText, { color: theme.colors.text }]}>Payment Status</Text>
                        <Text style={[styles.priceText, { color: theme.colors.text }]}>{updatedData?.paymentStatus}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={[styles.itemText, { color: theme.colors.text }]}>Final Amount</Text>
                        <Text style={[styles.priceText, { color: theme.colors.text }]}>{updatedData?.totalAmount}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={[styles.itemText, { color: theme.colors.text }]}>Booking Amount</Text>
                        <Text style={[styles.priceText, { color: theme.colors.text }]}>{updatedData?.AdvBookAmount}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={[styles.itemText, { color: theme.colors.text }]}>Remaining Amount</Text>
                        <Text style={[styles.priceText, { color: theme.colors.text }]}>{updatedData?.remainingAmount}</Text>
                    </View>
                </Card.Content>
            </Card>

            <View style={styles.row}>
                <Title style={[styles.total, { color: theme.colors.text }]}>Total Received</Title>
                <Text style={[styles.totalText, { color: theme.colors.text }]}>{updatedData?.totalReceivedAmount}</Text>
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={handleMarkAsFullyPaid}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Mark as Fully Paid</Text>
                )}
            </TouchableOpacity>

            {/* Dialog for notifications */}
            <Portal>
                <Dialog visible={visibleDialog} onDismiss={() => setVisibleDialog(false)}>
                    <Dialog.Title>Notification</Dialog.Title>
                    <Dialog.Content>
                        <Text>{dialogMessage}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setVisibleDialog(false)}>OK</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    totalText: {
        fontSize: 20,
        paddingRight: 20,
        paddingLeft: 15,
        paddingTop: 5,
        marginBottom: 40,
        marginTop: 10,
        fontWeight: "700",
    },
    total: {
        fontSize: width * 0.06,
        fontWeight: "bold",
        marginBottom: 40,
        marginTop: 10,
        paddingLeft: 10,
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    card: {
        marginBottom: height * 0.01,
        marginHorizontal: width * 0.00,
        padding: height * 0,
        elevation: 4, // Apply elevation to the card for shadow
        borderRadius: 10, // Rounded corners for cards
    },
    itemText: {
        fontSize: width * 0.04,
        fontWeight: "600",
        paddingTop: 5,
    },
    priceText: {
        fontSize: width * 0.04,
        fontWeight: "600",
    },
    button: {
        padding: 20,
        alignItems: "center",
        borderRadius: 25,
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: width * 0.04,
    },
});

export default BillingDetail;
