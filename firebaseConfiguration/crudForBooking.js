// firebaseCrud.js
import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query,
  where
} from 'firebase/firestore';

// Create a new document in a collection
export const createBooking = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};



// Read all documents from a collection
export const readDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return documents;
  } catch (error) {
    console.error("Error reading documents: ", error);
    throw error;
  }
};

// Read a single document by ID
export const readDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

// Update a document by ID
export const updateDocument = async (collectionName, docId, updatedData) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updatedData);
    console.log("Document updated successfully!");
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Delete a document by ID
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document deleted successfully!");
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};
export const fetchDataBasedOnUserId = async (userId, collectionName) => {
  try {
    if (userId) {
      console.log("Firebase User ID:", userId);

      // Reference the Firestore collection you want to query
      const collectionRef = collection(db, collectionName);

      // Query Firestore collection based on userId
      const q = query(collectionRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      // Fetch and store the data
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      return data; // Return the resolved data
    } else {
      console.log("No user is signed in");
      return []; // Return an empty array if no user is signed in
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array if there is an error
  }
};
