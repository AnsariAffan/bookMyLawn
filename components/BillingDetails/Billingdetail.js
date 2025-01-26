import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Dimensions } from "react-native";
import { Text, Card, Title, ActivityIndicator } from "react-native-paper";
import { updateBillingData, onBillingDataChange } from "../../firebaseConfiguration/FirebaseCrud";
import { useAuth } from "../Authprovider.js/AuthProvider";

const { width, height } = Dimensions.get('window');

const BillingDetail = ({ dataDefaulting }) => {
    const { user } = useAuth(); // Get current logged-in user
    const [isLoading, setIsLoading] = useState(false);
    const [updatedData, setUpdatedData] = useState(dataDefaulting); // Initialize with the default data

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
            Alert.alert("Error", "No billing data available.");
            return;
        }

        const { remainingAmount, totalReceivedAmount } = updatedData;

        if (remainingAmount === 0) {
            Alert.alert("Notification", "Already Fully Paid");
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
                Alert.alert("Error", "Invalid Bill ID.");
                setIsLoading(false);
                return;
            }

            // Update document in Firebase
            updateBillingData(user?.displayName, updatedData.id, updatedBillingDetails);
            console.log("Updated billing details:", updatedBillingDetails);
            setIsLoading(false);
            Alert.alert("Payment Status", "The amount has been marked as fully paid.");
        } catch (error) {
            console.error("Failed to update document:", error);
            setIsLoading(false);
            Alert.alert("Error", "Failed to update payment status. Please try again.");
        }
    };

    return (
        <>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Billing Date</Text>
                        <Text style={styles.priceText}>
                            {new Date().toLocaleString('default', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Payment Status</Text>
                        <Text style={styles.priceText}>{updatedData?.paymentStatus}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Final Amount</Text>
                        <Text style={styles.priceText}>{updatedData?.totalAmount}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Booking Amount</Text>
                        <Text style={styles.priceText}>{updatedData?.AdvBookAmount}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Remaining Amount</Text>
                        <Text style={styles.priceText}>{updatedData?.remainingAmount}</Text>
                    </View>
                </Card.Content>
            </Card>

            <View style={styles.row}>
                <Title style={styles.total}>Total Received</Title>
                <Text style={styles.totalText}>{updatedData?.totalReceivedAmount}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleMarkAsFullyPaid}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Mark as Fully Paid</Text>
                )}
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    totalText: {
        fontSize: 20,
        color: "black",
        paddingRight: 20,
        paddingLeft: 15,
        paddingTop: 5,
        marginBottom: 40,
        marginTop: 10,
        fontWeight: "700"
    },
    total: {
        fontSize: width * 0.06,
        fontWeight: "bold",
        color: "black",
        marginBottom: 40,
        marginTop: 10,
        paddingLeft: 10,
        fontStyle: "normal",
    },
    row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    card: {
        marginBottom: height * 0.01,
        marginHorizontal: width * 0.00,
        backgroundColor: "#ffff",
        padding: height * 0,
    },
    itemText: {
        fontSize: width * 0.04,
        color: "black",
        fontWeight: "600",
        paddingTop: 5,
        fontStyle: "normal",
    },
    priceText: {
        fontSize: width * 0.04,
        color: "black",
        paddingTop: 5,
        fontWeight: "600"
    },
    button: {
        backgroundColor: "#00509E",
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
