import React, { createContext, useContext, useState } from 'react';

// Create the BillingData Context
const BillingDataContext = createContext();

// Create a Provider component
export const BillingDataProvider = ({ children }) => {
  const [billingDataState, setBillingDataState] = useState({
    filteredData: [],            // Stores filtered billing data for the selected month/year
    totalRemainingAmount: 0,      // Total remaining amount for the filtered data
    totalReceivedAmount: 0,       // Total received amount for the filtered data
    totalBookings: 0,             // Total bookings count for the selected month
    totalUpcomingDates: 0,     // Total upcoming bookings in the current month
  });

  // Function to update billing data
  const setBillingData = (data) => {
    setBillingDataState((prevState) => ({
      ...prevState,
      ...data, // Merge the new data with the existing state
    }));
  };

  return (
    <BillingDataContext.Provider value={{ billingDataState, setBillingData }}>
      {children}
    </BillingDataContext.Provider>
  );
};

// Custom hook to use the BillingData context
export const useBillingData = () => {
  const context = useContext(BillingDataContext);
  if (!context) {
    throw new Error('useBillingData must be used within a BillingDataProvider');
  }
  return context;
};
