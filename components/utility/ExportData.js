import RNHTMLtoPDF from "react-native-html-to-pdf";
import RNFS from "react-native-fs";
import XLSX from "xlsx";
import { Platform } from "react-native";

const exportData = async (data, format = "pdf") => {
  try {
    if (!data || !data.id) {
      throw new Error("Invalid or missing billing data");
    }

    const fileName = `Invoice_${data.id}_${new Date().toISOString().split("T")[0]}`;
    const filePath = Platform.OS === "ios"
      ? `${RNFS.DocumentDirectoryPath}/${fileName}.${format}`
      : `${RNFS.DownloadDirectoryPath}/${fileName}.${format}`;

    if (format === "pdf") {
      const htmlContent = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Invoice</h1>
            <p><strong>Bill ID:</strong> ${data.id}</p>
            <p><strong>Created At:</strong> ${data.createdAt || "N/A"}</p>
            <h2>Customer Details</h2>
            <p><strong>Name:</strong> ${data.name || "N/A"}</p>
            <p><strong>Address:</strong> ${data.address || "N/A"}</p>
            <p><strong>Contact:</strong> ${data.contact || "N/A"}</p>
            <h2>Invoice Details</h2>
            <p><strong>Payment Status:</strong> ${data.paymentStatus || "N/A"}</p>
            <p><strong>Booking Date:</strong> ${data.dates || "N/A"}</p>
            <p><strong>Total Amount:</strong> ₹${data.totalAmount || "0"}</p>
            <p><strong>Booking Amount:</strong> ₹${data.AdvBookAmount || "0"}</p>
            <p><strong>Remaining Amount:</strong> ₹${data.remainingAmount || "0"}</p>
            <p><strong>Total Received:</strong> ₹${data.totalReceivedAmount || "0"}</p>
          </body>
        </html>
      `;

      const options = {
        html: htmlContent,
        fileName: fileName,
        directory: Platform.OS === "ios" ? "Documents" : "Download",
      };

      const file = await RNHTMLtoPDF.convert(options);
      await RNFS.moveFile(file.filePath, filePath);
    } else if (format === "excel") {
      const worksheetData = [
        ["Invoice", "", ""],
        ["Bill ID", data.id, ""],
        ["Created At", data.createdAt || "N/A", ""],
        ["", "", ""],
        ["Customer Details", "", ""],
        ["Name", data.name || "N/A", ""],
        ["Address", data.address || "N/A", ""],
        ["Contact", data.contact || "N/A", ""],
        ["", "", ""],
        ["Invoice Details", "", ""],
        ["Payment Status", data.paymentStatus || "N/A", ""],
        ["Booking Date", data.dates || "N/A", ""],
        ["Total Amount", `₹${data.totalAmount || "0"}`, ""],
        ["Booking Amount", `₹${data.AdvBookAmount || "0"}`, ""],
        ["Remaining Amount", `₹${data.remainingAmount || "0"}`, ""],
        ["Total Received", `₹${data.totalReceivedAmount || "0"}`, ""],
      ];

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Invoice");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "base64" });

      await RNFS.writeFile(filePath, wbout, "base64");
    }

    return { success: true, filePath, message: `File saved to ${filePath}` };
  } catch (error) {
    console.error(`Error creating ${format.toUpperCase()}:`, error);
    throw new Error(`Failed to export ${format.toUpperCase()}: ${error.message}`);
  }
};

export { exportData };