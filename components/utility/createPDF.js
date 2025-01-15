import RNHTMLtoPDF from "react-native-html-to-pdf";
import FileViewer from "react-native-file-viewer"; 
import { Alert } from "react-native";


// Create PDF function
  export  const createPDF = async () => {
        try {
            const htmlContent = `
            <h1 style="text-align: center; color: green;">Billing Details</h1>
            <p><strong>Billing Date:</strong> Test</p>
            <p><strong>Payment Status:</strong> Test</p>
            <p><strong>Final Amount:</strong> Test</p>
            <p><strong>Paid Amount:</strong> Test</p>
            <p><strong>Remaining Amount:</strong> Test</p>
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
   export const openPDF = async (filePath) => {
        try {
            await FileViewer.open(filePath);
        } catch (error) {
            console.log("Error while opening PDF:", error);
        }
    };