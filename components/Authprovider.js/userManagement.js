import { getDatabase, ref, set, get } from "firebase/database";

// Function to store user information in Firebase Realtime Database under userInfo
export const storeUserInformation = async (user) => {
  // Define the path to store user info under 'userInfo' node
  const dbRef = ref(getDatabase(), "userInfo/" + user.uid);

  // Get the user data to check if the user already exists
  try {
    const snapshot = await get(dbRef);
    
    if (!snapshot.exists()) {
      // User does not exist, so add user information
      const userData = {
        uid: user?.uid,
        email: user.email,
        displayName: user.displayName || 'BookMyLawn', // Set displayName once, won't change later
        photoURL: user.photoURL || '',
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || '',
        createdAt: new Date().toISOString(), // Only set createdAt once, when the user is first created
      };

      // Store the user data in Realtime Database under 'userInfo' node
      await set(dbRef, userData);
      console.log("User information stored successfully in Realtime Database under 'userInfo'");
    } else {
      console.log("User already exists in Realtime Database, not updating");
    }
  } catch (error) {
    console.error("Error storing user information in Realtime Database: ", error);
  }
};
