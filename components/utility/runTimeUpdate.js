// hooks/useAuthState.js

import { useState, useEffect } from "react";
import { auth } from "../firebaseConfiguration/firebaseConfig"; // Adjust path accordingly

const runTimeUpdate = () => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Listen for changes to authentication state
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // Update user state when user data changes
        setImage(currentUser.photoURL);  // Update image if changed
      } else {
        setUser(null);  // Reset if user is logged out
      }
    });

    // Cleanup the listener on unmount
    return unsubscribe;
  }, []);  // Empty dependency array ensures this effect runs once when component mounts

  return { user, image };  // Return the user data and image URL
};

export default runTimeUpdate;
