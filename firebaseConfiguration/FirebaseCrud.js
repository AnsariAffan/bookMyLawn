import { getDatabase, ref, set, push, update, remove, get, onValue } from 'firebase/database';
import { realtimeDb } from './firebaseConfig';


// Function to save billing data for a specific client
export const saveBillingData = (clientId, billingData) => {
  const billingRef = ref(realtimeDb, `clients/${clientId}/Billings`);
  const newBillingRef = push(billingRef); // Push creates a new unique ID for each billing entry
  
  // Add the generated id and createdAt timestamp in ISO 8601 format to the billing data
  const billingDataWithId = { 
    ...billingData, 
    id: newBillingRef.key, // Set the generated ID as part of the billing data
    createdAt: new Date().toISOString() // Add the current timestamp in ISO 8601 format
  };

  set(newBillingRef, billingDataWithId)
    .then(() => console.log('Billing data saved successfully.'))
    .catch((error) => console.error('Error saving billing data: ', error));
};

// Function to save booking data for a specific client
export const saveBookingData = (clientId, bookingData) => {
  const bookingRef = ref(realtimeDb, `clients/${clientId}/Bookings`);
  const newBookingRef = push(bookingRef); // Push creates a new unique ID for each booking entry
  
  // Add createdAt timestamp in ISO 8601 format to the booking data
  const bookingDataWithTimestamp = {
    ...bookingData,
    createdAt: new Date().toISOString() // Add the current timestamp in ISO 8601 format
  };

  set(newBookingRef, bookingDataWithTimestamp)
    .then(() => console.log('Booking data saved successfully.'))
    .catch((error) => console.error('Error saving booking data: ', error));
};

// Function to update billing data for a specific client and billing ID
export const updateBillingData = (clientId, billingId, updatedBillingData) => {
  const billingRef = ref(realtimeDb, `clients/${clientId}/Billings/${billingId}`);
  update(billingRef, updatedBillingData)
    .then(() => console.log('Billing data updated successfully.'))
    .catch((error) => console.error('Error updating billing data: ', error));
};

// Function to update booking data for a specific client and booking ID
export const updateBookingData = (clientId, bookingId, updatedBookingData) => {
  const bookingRef = ref(realtimeDb, `clients/${clientId}/Bookings/${bookingId}`);
  update(bookingRef, updatedBookingData)
    .then(() => console.log('Booking data updated successfully.'))
    .catch((error) => console.error('Error updating booking data: ', error));
};

// Function to delete billing data for a specific client and billing ID
export const deleteBillingData = (clientId, billingId) => {
  const billingRef = ref(realtimeDb, `clients/${clientId}/Billings/${billingId}`);
  remove(billingRef)
    .then(() => console.log('Billing data deleted successfully.'))
    .catch((error) => console.error('Error deleting billing data: ', error));
};

// Function to delete booking data for a specific client and booking ID
export const deleteBookingData = (clientId, bookingId) => {
  const bookingRef = ref(realtimeDb, `clients/${clientId}/Bookings/${bookingId}`);
  remove(bookingRef)
    .then(() => console.log('Booking data deleted successfully.'))
    .catch((error) => console.error('Error deleting booking data: ', error));
};

// Function to fetch all billing data for a specific client once
export const getBillingData = (clientId) => {
  const billingRef = ref(realtimeDb, `clients/${clientId}/Billings`);
  return get(billingRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val(); // Returns the billing data
      } else {
        console.log('No billing data available.');
        return null;
      }
    })
    .catch((error) => {
      console.error('Error fetching billing data: ', error);
      return null;
    });
};

// Function to fetch all booking data for a specific client once
export const getBookingData = (clientId) => {
  const bookingRef = ref(realtimeDb, `clients/${clientId}/Bookings`);
  return get(bookingRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val(); // Returns the booking data
      } else {
        console.log('No booking data available.');
        return null;
      }
    })
    .catch((error) => {
      console.error('Error fetching booking data: ', error);
      return null;
    });
};

// Real-time listener for billing data (Client-specific)
export const onBillingDataChange = (clientId, callback) => {
  const billingRef = ref(realtimeDb, `clients/${clientId}/Billings`);
  onValue(billingRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val()); // Pass the billing data to the callback
    } else {
      console.log('No billing data available.');
      callback(null);
    }
  }, (error) => {
    console.error('Error fetching billing data in real-time: ', error);
  });
};

// Real-time listener for booking data (Client-specific)
export const onBookingDataChange = (clientId, callback) => {
  const bookingRef = ref(realtimeDb, `clients/${clientId}/Bookings`);
  onValue(bookingRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val()); // Pass the booking data to the callback
    } else {
      console.log('No booking data available.');
      callback(null);
    }
  }, (error) => {
    console.error('Error fetching booking data in real-time: ', error);
  });
};
