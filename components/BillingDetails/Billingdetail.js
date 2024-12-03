import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Text, Card, TextInput, Title, ActivityIndicator } from "react-native-paper";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useBilling } from "./BillingContext";
import { BookingListContext } from "../BookingListContext/BookingListContext";
import { updateDocument } from "../../firebaseConfiguration/crudForBooking";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfiguration/firebaseConfig";

const BillingDetail = ({ dataDefaulting }) => {
    const { billingDetails, setBillingDetails, fetchBooingDetails, fetchingAllBillings, allBills } = useBilling();
    const { filteredHotels } = useContext(BookingListContext);
    const [billID, setBillId] = useState();
    const [isLoading, setIsLoading] = useState(false);
    // Effect to fetch billing details and set billID
    useEffect(() => {
        if (allBills.length > 0 && dataDefaulting.id) {
            const matchingBilling = allBills.find(billing => billing.bookingId === dataDefaulting.id);
            if (matchingBilling) {
                setBillingDetails(matchingBilling);
                setBillId(matchingBilling.id);
                console.log("Matching data found:", matchingBilling);
            }
        }
    }, [allBills, dataDefaulting.id]);

    // Initial details and fallback values
    const initialDetails = {
        billingDate: new Date().toISOString().split('T')[0], // Set the billing date to today
        finalAmount: dataDefaulting.totalAmount || 0, // Fallback to 0 if undefined
        bookingAmount: dataDefaulting.AdvBookAmount || 0, // Fallback to 0 if undefined
        paidAmount: billingDetails.paidAmount || 0, // Fallback to 0 if undefined
        paymentStatus: billingDetails.paymentStatus || "Pending", // Default status
        billId: billingDetails.billId
    };

    const [isEdit, setIsEdit] = useState(false);
    const [openAmount, setOpenAmount] = useState(dataDefaulting.remainingAmount);

    // Effect to handle remaining amount and payment status
    useEffect(() => {
        const finalAmount = Number(initialDetails.finalAmount) || 0;
        const bookingAmount = Number(initialDetails.bookingAmount) || 0;
        const paidAmount = Number(billingDetails.paidAmount) || 0;

        const calculatedOpenAmount = finalAmount - bookingAmount - paidAmount;
        setOpenAmount(calculatedOpenAmount);

        if (calculatedOpenAmount === 0) {
            setBillingDetails({ ...billingDetails, paymentStatus: "Fully Paid" });
        } else if (calculatedOpenAmount < 0) {
            setBillingDetails({ ...billingDetails, paymentStatus: "Over Paid" });
        } else {
            setBillingDetails({ ...billingDetails, paymentStatus: "Partially Paid" });
        }
    }, [billingDetails.paidAmount, initialDetails.finalAmount, initialDetails.bookingAmount]);

    // Mark as Fully Paid button handler
    const handleMarkAsFullyPaid = async() => {
      
        const paidAmountToMarkFullyPaid = Number(openAmount)// Add the remaining amount to the paid amount
        // setBillingDetails({
        //     ...billingDetails,
        //     paidAmount: paidAmountToMarkFullyPaid,
        //     remainingAmount: 0,  // Since the amount is fully paid, set remaining amount to 0
        //     paymentStatus: "Fully Paid"
        // });


        // Prepare updated billing details
        const setUpdatedBillingDetails = {
            ...billingDetails,
            finalAmount: initialDetails.finalAmount,
            bookingAmount: initialDetails.bookingAmount,
            paidAmount: paidAmountToMarkFullyPaid,
            remainingAmount: 0,
            paymentStatus: "Fully Paid",
            totalReceivedAmount: Number(paidAmountToMarkFullyPaid) + Number(initialDetails.bookingAmount), // Add totalReceivedAmount to the update
        };

        

        try {
            if(billingDetails?.remainingAmount == 0){
                Alert.alert("Notification", "Already Fully Paid");
         
            }else{
            setIsLoading(true);
            // Call the updateDocument function with the appropriate parameters
           
            await updateDocument('billings', billID, setUpdatedBillingDetails);
            console.log("Updated billing details:", setUpdatedBillingDetails); // Log updated details
            setIsLoading(false);
            Alert.alert("Payment Status", "The amount has been marked as fully paid.");
            // Alert.alert("Notification", "Payment updated successfully");
             }
        } catch (error) {
            console.error("Failed to update document:", error);
        }
    
        setIsEdit(false);

      
    };

    // Create PDF function
    const createPDF = async () => {
        try {
            const htmlContent = `
            <h1 style="text-align: center; color: green;">Billing Details</h1>
            <p><strong>Billing Date:</strong> ${billingDetails.billingDate}</p>
            <p><strong>Payment Status:</strong> ${billingDetails.paymentStatus}</p>
            <p><strong>Final Amount:</strong> ${billingDetails.finalAmount}</p>
            <p><strong>Paid Amount:</strong> ${billingDetails.paidAmount}</p>
            <p><strong>Remaining Amount:</strong> ${billingDetails.remainingAmount}</p>
        `;

            const options = {
                html: htmlContent,
                fileName: "BillingDetails",
                directory: "Documents",
            };

            const file = await RNHTMLtoPDF.convert(options);
            Alert.alert("PDF Generated", "The PDF has been created successfully.");
            openPDF(file.filePath);
        } catch (error) {
            Alert.alert("Error", "Something went wrong while generating the PDF.");
        }
    };

    // Open the PDF file after creation
    const openPDF = async (filePath) => {
        try {
            await FileViewer.open(filePath);
        } catch (error) {
            console.log("Error while opening PDF:", error);
        }
    };

    // Effect to listen for updates in billing details
    useEffect(() => {
        if (billID) { // Ensure billID is defined
            const unsubscribe = onSnapshot(doc(db, 'billings', billID), (doc) => {
                if (doc.exists()) {
                    const data = doc.data();
                    setBillingDetails(data);
                    console.log("Current billing data: ", data);
                } else {
                    console.log("No such document!");
                }
            });

            return () => unsubscribe();
        }
    }, [billID]);

    return (
        <>
            <Icon
                name="printer"
                size={25}
                color="#ffff"
                style={{ marginRight: 60, position: "absolute", top: -115, right: -40 }}
                onPress={createPDF} // Disable editing if fully paid
            />
            
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Billing Date</Text>
                        <Text style={styles.priceText}>{initialDetails.billingDate}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Payment Status</Text>
                        <Text style={styles.priceText}>{billingDetails.paymentStatus}</Text>
                    </View>
                </Card.Content>
            </Card>
            
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Final Amount</Text>
                        <Text style={styles.priceText}>{initialDetails.finalAmount}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Booking Amount</Text>
                        <Text style={styles.priceText}>{initialDetails.bookingAmount}</Text>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Remaining Amount</Text>
                        <Text style={styles.priceText}>{openAmount}</Text>
                    </View>
                </Card.Content>
            </Card>

          
{/*
    
      <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Paid Amount</Text>
                        <Text style={styles.priceText}>{billingDetails.paymentStatus === "Fully Paid" ? "Paid" : billingDetails.paidAmount}</Text>
                    </View>
                </Card.Content>
            </Card>
    */}
            <View style={styles.row}>
                <Title style={styles.total}>Total Received</Title>
                <Text style={styles.totalText}> {Number(billingDetails.paidAmount || 0) + Number(initialDetails.bookingAmount || 0)}</Text>
            </View>

           
                <TouchableOpacity style={styles.button} onPress={handleMarkAsFullyPaid}>
                {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />  // Show loader while signing up
                  ) : (
                    <Text style={styles.buttonText}>Mark as Fully Paid</Text>
                  )
                }
                    </TouchableOpacity>
           
        </>
    );
};

const styles = StyleSheet.create({
    totalText: {
        fontSize: 20,
        color: "lightblue",
        paddingRight: 20,
        paddingLeft: 15,
        paddingTop: 5,
        marginBottom: 40,
        marginTop: 10,
    },
    total: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ffff",
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
        marginBottom: 8,
        backgroundColor: "#1e1e1e",
    },
    itemText: {
        fontSize: 18,
        color: "#ffff",
        fontWeight: "500",
        paddingTop: 5,
    },
    priceText: {
        fontSize: 18,
        color: "lightblue",
        paddingTop: 5,
    },
    button: {
        backgroundColor: "#4CAF50",
        padding: 20,
        alignItems: "center",
        borderRadius: 25,
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});

export default BillingDetail;
