import React, { useContext, useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Text, Card, TextInput, Title } from "react-native-paper";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useBilling } from "./BillingContext";
import { BookingListContext } from "../BookingListContext/BookingListContext";
import { updateDocument } from "../../firebaseConfiguration/crudForBooking";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfiguration/firebaseConfig";


const BillingDetail = ({ dataDefaulting }) => {
  
    const { billingDetails, 
        setBillingDetails,
        fetchBooingDetails,
        fetchingAllBillings,
        allBills
     } = useBilling();
     
    const {
        filteredHotels
      } = useContext(BookingListContext);

      
      const [billID, setBillId] = useState();

      // Effect to fetch billing details and set billID
      useEffect(() => {
        if (allBills.length > 0 && dataDefaulting.id) {
          const matchingBilling = allBills.find(billing => billing.bookingId === dataDefaulting.id);
          if (matchingBilling) {
            setBillingDetails(matchingBilling);
            setBillId(matchingBilling.id);
            console.log("Matching data found:", matchingBilling); // Log the whole object for more context
          }
        }
      }, [allBills, dataDefaulting.id]);
      
      // Effect to log billID when it changes
      useEffect(() => {
        console.log("Updated billID:", billID); // This will show the updated billID
      }, [billID]);


      
    // Ensure all needed properties exist in billingDetails
    const initialDetails = {
        billingDate: new Date().toISOString().split('T')[0], // Set the billing date to today
        finalAmount: dataDefaulting.totalAmount || 0, // Fallback to 0 if undefined
        bookingAmount: dataDefaulting.AdvBookAmount || 0, // Fallback to 0 if undefined
        paidAmount: billingDetails.paidAmount || 0, // Fallback to 0 if undefined
        paymentStatus: billingDetails.paymentStatus || "Pending", // Default status
        billId:billingDetails.billId
    };

    const [isEdit, setIsEdit] = useState(false);
    const [openAmount, setOpenAmount] = useState(dataDefaulting.remainingAmount); // Fallback to 0 if undefined
    const edit = useRef();



    const openPDF = async (filePath) => {
        try {
          await FileViewer.open(filePath);
        } catch (error) {
          console.log("Error while opening PDF:", error);
        }
      };

    const handlePaidAmountChange = (value) => {
        const numericValue = Number(value); // Convert input value to number
        setBillingDetails({
            ...billingDetails,
            paidAmount: numericValue,
            remainingAmount: initialDetails.finalAmount - initialDetails.bookingAmount - numericValue,
        });
    };

    const handleEditPaidAmount = () => {
        console.log("Editing...");
        setIsEdit(true);
    };

    const handleUpdate = async ()  => {
        console.log("Updated billing details:", {
            ...billingDetails,
            finalAmount: initialDetails.finalAmount,
            bookingAmount: initialDetails.bookingAmount,
            paidAmount: billingDetails.paidAmount,
            remainingAmount: openAmount,
            paymentStatus: billingDetails.paymentStatus,
        });


        //Getting updated billing details sending to DB

       const setUpdatedBillingDetails=
             {
            ...billingDetails,
            finalAmount: initialDetails.finalAmount,
            bookingAmount: initialDetails.bookingAmount,
            paidAmount: billingDetails.paidAmount,
            remainingAmount: openAmount,
            paymentStatus: billingDetails.paymentStatus,
        }

        try {
            // Call the updateDocument function with the appropriate parameters
            await updateDocument('billings', billID, setUpdatedBillingDetails);
            console.log("Updated billing details:", setUpdatedBillingDetails); // Log updated details
       Alert.alert("Notification","Payment updated successfully")

        } catch (error) {
            console.error("Failed to update document:", error);
        }
      
        setIsEdit(false);
    };

    useEffect(() => {
        const finalAmount = Number(initialDetails.finalAmount) || 0;
        const bookingAmount = Number(initialDetails.bookingAmount) || 0;
        const paidAmount = Number(billingDetails.paidAmount) || 0;
    
        const calculatedOpenAmount = finalAmount - bookingAmount - paidAmount;
        setOpenAmount(calculatedOpenAmount);
    
        console.log("Final Amount:", finalAmount, "Booking Amount:", bookingAmount, "Paid Amount:", paidAmount, "Calculated Open Amount:", calculatedOpenAmount); // Debugging log
    
        if (calculatedOpenAmount === 0) {
            setBillingDetails({ ...billingDetails, paymentStatus: "Fully Paid" });
        } else if (calculatedOpenAmount < 0) {
            setBillingDetails({ ...billingDetails, paymentStatus: "Over Paid" });
        } else {
            setBillingDetails({ ...billingDetails, paymentStatus: "Partially Paid" });
        }
    }, [billingDetails.paidAmount, initialDetails.finalAmount, initialDetails.bookingAmount]);
    
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
      openPDF(file.filePath); // Call the function to open the PDF
    } catch (error) {
      Alert.alert("Error", "Something went wrong while generating the PDF.");
    }
  };

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
    
            // Cleanup the listener on unmount
            return () => unsubscribe();
        }
    }, [billID]); // Trigger effect when billID changes
    
    return (
        <>
            <Icon
                name="pencil"
                size={25}
                color="#ffff"
                style={{ marginRight: 60, position: "absolute", top: -115, right: -40 }}
                onPress={handleEditPaidAmount}
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

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.row}>
                        <Text style={styles.itemText}>Paid Amount</Text>
                        {!isEdit && <Text style={styles.priceText}>{billingDetails.paidAmount}</Text>}
                        {isEdit && (
                            <TextInput
                                ref={edit}
                                value={billingDetails.paidAmount} // Ensure the value is a string for TextInput
                                onChangeText={handlePaidAmountChange} // Handle text changes
                                editable={true}
                                placeholder="Paid Amount"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                style={styles.input}
                            />
                        )}
                    </View>
                </Card.Content>
            </Card>

            <View style={styles.row}>
                <Title style={styles.total}>Total Received</Title>
                <Text style={styles.totalText}> {Number(billingDetails.paidAmount || 0) + Number(initialDetails.bookingAmount || 0)}</Text>
            </View>
            {isEdit ? (
                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.button} onPress={createPDF}>
                    <Text style={styles.buttonText}>Send PDF</Text>
                </TouchableOpacity>
            )}
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
    },
    priceText: {
        fontSize: 18,
        color: "lightblue",
        paddingLeft: 30,
        paddingRight: 10,
    },
    button: {
        backgroundColor: "#00509E",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    input: {
        height: 40,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: "#000",
    },
});

export default BillingDetail;
