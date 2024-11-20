import React, { createContext, useContext, useState, useEffect } from "react";
import { BookingListContext } from "../BookingListContext/BookingListContext";
import { readDocumentById, readDocuments } from "../../firebaseConfiguration/crudForBooking";

const BillingContext = createContext();

export const useBilling = () => {
  return useContext(BillingContext);
};

export const BillingProvider = ({ children }) => {
  // const { filteredHotels } = useContext(BookingListContext);

  const [billingDetails, setBillingDetails] = useState({
    billingDate: "",
    paymentStatus: "",
    finalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    bookingAmount: 0,
    billId: "",
  });


  const [allBills, setAllBills] = useState([]);

  // Function to fetch all billing details
  const fetchingAllBillings = async () => {
    try {
      // console.log("Fetching all billings...");
      const allBillings = await readDocuments("billings");
      // console.log("Fetched all billings:", allBillings);
      if (allBillings) {
        setAllBills(allBillings);
      }
      return allBillings;
    } catch (error) {
      console.error("Error fetching billings:", error);
      return [];
    }
  };

  // Fetch all billings on component mount
  useEffect(() => {
    fetchingAllBillings();
  }, []);
  // Function to fetch booking details by ID
  const fetchBookingDetails = async (billId) => {
    try {
      const data = await readDocumentById("bookings", billId);
      if (data) {
        setBillingDetails(data); // Update context state with fetched data
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  return (
    <BillingContext.Provider
      value={{ billingDetails, setBillingDetails, fetchBookingDetails, fetchingAllBillings, allBills }}
    >
      {children}
    </BillingContext.Provider>
  );
};
