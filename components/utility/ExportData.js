import XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import RNFS from "react-native-fs";
import { Platform, Alert } from "react-native";

/**
 * Exports data to Excel or PDF format.
 * @param {Array} data - The data to export.
 * @param {string} format - The format to export ('excel' or 'pdf').
 */


export const exportData = async (data, format) => {
    console.log("RNFS:", RNFS); 
  const columns = [
    { header: "Name", key: "name" },
    { header: "Date", key: "dates" },
    { header: "Payment Status", key: "paymentStatus" },
    { header: "Total Amount", key: "totalAmount" },
    { header: "Received Amount", key: "totalReceivedAmount" },
    { header: "Remaining Amount", key: "remainingAmount" },
  ];

  try {
    if (!RNFS || !RNFS.DownloadDirectoryPath) {
      throw new Error("File system access is not available on this platform.");
    }

    if (format === "excel") {
      const worksheetData = data.map((item) => ({
        name: item.name,
        dates: item.dates,
        paymentStatus: item.paymentStatus,
        totalAmount: item.totalAmount,
        totalReceivedAmount: item.totalReceivedAmount,
        remainingAmount: item.totalAmount - item.totalReceivedAmount,
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData, {
        header: columns.map((col) => col.header),
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Booking Data");

      const excelFile = XLSX.write(workbook, { type: "binary", bookType: "xlsx" });
      const filePath = `${RNFS?.DownloadDirectoryPath}/BookingData.xlsx`;

      await RNFS?.writeFile(filePath, excelFile, "ascii");
      Alert.alert("Success", `Excel file saved to ${filePath}`);
    } else if (format === "pdf") {
      const doc = new jsPDF();
      const tableData = data.map((item) => [
        item.name,
        item.dates,
        item.paymentStatus,
        item.totalAmount,
        item.totalReceivedAmount,
        item.totalAmount - item.totalReceivedAmount,
      ]);

      doc.text("Booking Data", 14, 20);
      doc.autoTable({
        head: [columns.map((col) => col.header)],
        body: tableData,
        startY: 30,
      });

      const pdfFile = `${RNFS?.DownloadDirectoryPath}/BookingData.pdf`;
      const pdfOutput = doc.output("arraybuffer");
      await RNFS.writeFile(pdfFile, Buffer.from(pdfOutput).toString("base64"), "base64");
      Alert.alert("Success", `PDF file saved to ${pdfFile}`);
    } else {
      throw new Error("Unsupported format. Use 'excel' or 'pdf'.");
    }
  } catch (error) {
    Alert.alert("Error", `Failed to export data: ${error.message}`);
  }
};
