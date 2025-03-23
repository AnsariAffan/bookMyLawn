import { getDatabase, ref, set, get, child } from "firebase/database";

// Function to store user information in Firebase Realtime Database under userInfo
export const storeUserInformation = async (user) => {
  if (!user?.uid) {
    console.error("Invalid user object provided.");
    return;
  }

  const db = getDatabase();
  const dbRef = ref(db);
  const userPath = `userInfo/${user.uid}`;

  try {
    // Check if the user already exists
    const snapshot = await get(child(dbRef, userPath));
    if (snapshot.exists()) {
      console.log("User already exists in Realtime Database, not updating.");
      return;
    }

    // Prepare user data
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "BookMyLawn",
      photoURL: user.photoURL || "",
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber || "",
      createdAt: new Date().toISOString(),
    };

    // Store the user data
    await set(ref(db, userPath), userData);
    console.log("User information stored successfully in Realtime Database under 'userInfo'.");
  } catch (error) {
    console.error("Error storing user information in Realtime Database: ", error);
  }
};
