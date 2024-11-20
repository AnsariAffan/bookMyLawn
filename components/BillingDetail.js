// import React, { useEffect, useRef, useState } from "react";
// import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
// import { Text, Card, TextInput, Title } from "react-native-paper";
// import RNHTMLtoPDF from "react-native-html-to-pdf";
// import FileViewer from "react-native-file-viewer";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { updateDocument } from "../firebaseConfiguration/crudForBooking";

// const BillingDetail = ({dataDefaulting}) => {

//   console.log("--- data recevied in biiling details page");
//   console.log(dataDefaulting);
//   console.log("--- data recevied in biiling details page");
//   //dataDefaulting.TotalAmount
//   const [billingDetails, setBillingDetails] = useState({
//     billingDate: "31-10-2024",
//     paymentStatus: "",
//     finalAmount: dataDefaulting.totalAmount,
//     paidAmount: 0,
//     remainingAmount: 0,
//     bookingAmount:dataDefaulting.AdvBookAmount
//   });

//   const createPDF = async () => {
//     try {
//       const htmlContent = `
//         <h1 style="text-align: center; color: green;">Billing Details</h1>
//         <p><strong>Billing Date:</strong> ${billingDetails.billingDate}</p>
//         <p><strong>Payment Status:</strong> ${billingDetails.paymentStatus}</p>
//         <p><strong>Final Amount:</strong> ${billingDetails.finalAmount}</p>
//         <p><strong>Paid Amount:</strong> ${billingDetails.paidAmount}</p>
//         <p><strong>Remaining Amount:</strong> ${billingDetails.remainingAmount}</p>
//       `;

//       const options = {
//         html: htmlContent,
//         fileName: "BillingDetails",
//         directory: "Documents",
//       };

//       const file = await RNHTMLtoPDF.convert(options);
//       Alert.alert("PDF Generated", "The PDF has been created successfully.");
//       openPDF(file.filePath); // Call the function to open the PDF
//     } catch (error) {
//       Alert.alert("Error", "Something went wrong while generating the PDF.");
//     }
//   };

//   const openPDF = async (filePath) => {
//     try {
//       await FileViewer.open(filePath);
//     } catch (error) {
//       console.log("Error while opening PDF:", error);
//     }
//   };
 
//   const [isEdit, setIsEdit] = useState(false);
//   const [paidAmount, setPaidAmount] = useState(billingDetails.paidAmount); // Default value
//   const [openAmount, setOpenAmount] = useState(billingDetails.remainingAmount); // Remaining amount state
//   const [paymentStatus, setpaymentStatus] = useState(billingDetails.paymentStatus); // Remaining amount state
//   const [bookAmount, setBookingAmount] = useState(billingDetails.bookingAmount); // Remaining amount state
// const [receviedAmount,setReceviedAmount] = useState(paidAmount+bookAmount)
//   const edit = useRef();

//   const handlePaidAmountChange = (value) => {
//     setPaidAmount(value); // Update state on input change
//   };

//   const handleEditPaidAmount = () => {
//     console.log("Editing...");
//     setIsEdit(true);
//   };

//   const updateBookingData = async (updatedData) => {
//     try {

//       await updateDocument('bookings',dataDefaulting.id,updatedData)
//       Alert.alert("Success", "Data updated in Firestore successfully!");
//       console.log(updatedData);
//     } catch (error) {
//       Alert.alert("Error", "Failed to update data in Firestore.");
//       console.error("Firestore update error:", error);
//     }
//   };

//   const handleUpdate = () => {
//     const updatedPaidAmount = paidAmount || 0;
//     const updatedRemainingAmount = (billingDetails.finalAmount - updatedPaidAmount);

//     const updatedData = {
//       paidAmount: updatedPaidAmount,
//       remainingAmount: openAmount,
//       paymentStatus: paymentStatus,
//     };

//     setBillingDetails((prevDetails) => ({
//       ...prevDetails,
//       paidAmount: updatedPaidAmount,
//       remainingAmount: openAmount,
//       paymentStatus: updatedData.paymentStatus,
//     }));

//     // Call the function to update Firestore
//     updateBookingData(updatedData);

//     Alert.alert("Success", "Paid amount updated successfully!");
//     setIsEdit(false);
//   };

//   useEffect(() => {
//     // Calculate remaining (open) amount
//     const calculatedOpenAmount = billingDetails.finalAmount - bookAmount - paidAmount;
//     setOpenAmount(calculatedOpenAmount);

//     // Update payment status based on remaining amount
//     if (calculatedOpenAmount === 0) {
//         setpaymentStatus("Fully Paid");
//     } else if (calculatedOpenAmount < 0) {
//         setpaymentStatus("Over Paid");
//     } else {
//         setpaymentStatus("Partially Paid");
//     }
// }, [paidAmount, billingDetails.finalAmount, bookAmount]);


//   return (
//     <>
//       <Icon
//         name="pencil"
//         size={25}
//         color="#ffff"
//         style={{ marginRight: 60, position: "absolute", top: -115, right: -40 }}
//         onPress={handleEditPaidAmount}
//       />
//       <Card style={styles.card}>
//         <Card.Content>
//           <View style={styles.row}>
//             <Text style={styles.itemText}>Billing Date</Text>
//             <Text style={styles.priceText}>{billingDetails.billingDate}</Text>
//           </View>
//         </Card.Content>
//       </Card>

//       <Card style={styles.card}>
//         <Card.Content>
//           <View style={styles.row}>
//             <Text style={styles.itemText}>Payment Status</Text>
//             <Text style={styles.priceText}>{paymentStatus}</Text>
//           </View>
//         </Card.Content>
//       </Card>

//       <Card style={styles.card}>
//         <Card.Content>
//           <View style={styles.row}>
//             <Text style={styles.itemText}>Final Amount</Text>
//             <Text style={styles.priceText}>{billingDetails.finalAmount}</Text>
//           </View>
//         </Card.Content>
//       </Card>

//       <Card style={styles.card}>
//         <Card.Content>
//           <View style={styles.row}>
//             <Text style={styles.itemText}>Booking Amount</Text>
//             <Text style={styles.priceText}>{billingDetails.bookingAmount}</Text>
//           </View>
//         </Card.Content>
//       </Card>

//       <Card style={styles.card}>
//       <Card.Content>
//         <View style={styles.row}>
//           <Text style={styles.itemText}>Remaining Amount</Text>
//           <Text style={styles.priceText}>{openAmount}</Text>
//         </View>
//       </Card.Content>
//     </Card>

//       <Card style={styles.card}>
//         <Card.Content>
//           <View style={styles.row}>
//             <Text style={styles.itemText}>Paid Amount</Text>
//             {!isEdit && <Text style={styles.priceText}>{billingDetails.paidAmount}</Text>}

//             {isEdit && (
//               <TextInput
//                 ref={edit}
//                 value={paidAmount} // Bind the state to the value
//                 onChangeText={handlePaidAmountChange} // Handle text changes
//                 editable={true} // Make input editable based on isEditMode
//                 placeholder="Paid Amount"
//                 placeholderTextColor="#999" // Placeholder color
//                 keyboardType="numeric"
//                 style={styles.input} // Apply styles from the stylesheet
//               />
//             )}
//           </View>
//         </Card.Content>
//       </Card>

    
//       <View style={styles.row}>
//       <Title style={styles.total}>Total Received</Title>
//       <Text style={styles.totalText}>{Number(paidAmount) + Number(bookAmount)}</Text>
//     </View>
//       {isEdit ? (
//         <TouchableOpacity style={styles.button} onPress={handleUpdate}>
//           <Text style={styles.buttonText}>Update</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity style={styles.button} onPress={createPDF}>
//           <Text style={styles.buttonText}>Send PDF</Text>
//         </TouchableOpacity>
//       )}

       
//     </>
//   );
// };

// const styles = StyleSheet.create({
// totalText: {
//     fontSize: 20,
//     color: "#00FF00",
//     paddingRight: 20,
//     paddingLeft: 15,
//     paddingTop: 5,
//       marginBottom:40,
//       marginTop:10
//   },
//   total: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#ffff",
//       marginBottom:40,
//          marginTop:10,
//          paddingLeft: 10,
//   },
//  row: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-between",
  
    
//   },
//   card: {
//     marginBottom: 8,
//     backgroundColor: "#1e1e1e",
//   },
//   row: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   itemText: {
//     fontSize: 18,
//     color: "#ffffff",
//   },
//   priceText: {
//     fontSize: 16,
//     color: "#00FF00",
//     marginLeft: 10,
//   },
//   input: {
//     height: 40,
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginVertical: 10,
//     backgroundColor: "#ffff",
//     color: "#000000", // Set text color to black here
//   },
//   button: {
//     backgroundColor: "green",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default BillingDetail;
