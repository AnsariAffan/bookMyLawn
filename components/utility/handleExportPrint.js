import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';

export default handleExportPrint = async () => {
  try {
    // Generate HTML for the invoice
    const htmlContent = `
      <html>
        <body>
          <h1>Invoice</h1>
          <h2>Bill for ${dataDefaulting.name}</h2>
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> ${dataDefaulting.name}</p>
          <p><strong>Address:</strong> ${dataDefaulting.address}</p>
          <p><strong>Contact:</strong> ${dataDefaulting.contact}</p>
          <h3>Invoice Details</h3>
          <p><strong>Payment Status:</strong> ${billingData.paymentStatus}</p>
          <p><strong>Booking Date:</strong> ${billingData.dates}</p>
          <p><strong>Total Amount:</strong> ₹${billingData.totalAmount}</p>
          <p><strong>Booking Amount:</strong> ₹${billingData.AdvBookAmount}</p>
          <p><strong>Remaining Amount:</strong> ₹${billingData.remainingAmount}</p>
          <p><strong>Total Received:</strong> ₹${billingData.totalReceivedAmount}</p>
        </body>
      </html>
    `;

    // Generate PDF
    const options = {
      html: htmlContent,
      fileName: `invoice_${billingData.id}`,
      directory: 'Documents',
    };
    const file = await RNHTMLtoPDF.convert(options);
    setDialogMessage(`PDF generated at: ${file.filePath}`);
    setDialogVisible(true);

    // Optionally, print the PDF
    await RNPrint.print({ filePath: file.filePath });
  } catch (error) {
    setDialogMessage("Failed to export/print invoice. Please try again.");
    setDialogVisible(true);
    console.error(error);
  }
};