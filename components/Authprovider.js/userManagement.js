import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfiguration/firebaseConfig";

// Function to store user information in Firestore
export const storeUserInformation = async (user) => {
  const userDoc = doc(db, "users", user.uid);

  // Get the user document to check if it already exists
  const docSnap = await getDoc(userDoc);

  // If the document doesn't exist, we will add the user data
  if (!docSnap.exists()) {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'BookMyLawn', // Set displayName once, won't change later
      photoURL: user.photoURL || '',
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber || '',
      createdAt: new Date(), // Only set createdAt once, when the user is first created
    };

    try {
      // Store the user data in Firestore (create a new document)
      await setDoc(userDoc, userData);
      console.log("User information stored successfully");
    } catch (error) {
      console.error("Error storing user information: ", error);
    }
  } else {
    console.log("User already exists in Firestore, not updating");
  }
};
