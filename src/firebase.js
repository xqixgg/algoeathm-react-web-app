import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCCwRXxeQ1Ta3zGfDArVYxO0SRFT0v13iw",
  authDomain: "algoeathm.firebaseapp.com",
  projectId: "algoeathm",
  storageBucket: "algoeathm.firebasestorage.app",
  messagingSenderId: "606074979316",
  appId: "1:606074979316:web:f212e27e4a38f51704afa1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Collection references
const usersCollection = collection(db, "users");
const userRecipesCollection = collection(db, "userRecipes");

// Simple function to check if collections exist and create them if needed
const ensureCollectionsExist = async () => {
  try {
    // Check if collections exist by attempting to get docs
    const usersSnapshot = await getDocs(usersCollection);
    const recipesSnapshot = await getDocs(userRecipesCollection);

    console.log(
      `Database initialized with ${usersSnapshot.size} users and ${recipesSnapshot.size} recipes`
    );
  } catch (error) {
    console.error("Error initializing database:", error);
    // Collections will be created automatically when the first document is added
  }
};

// Call this function when the app initializes
ensureCollectionsExist();

// Export for use in your app
export { db, auth, usersCollection, userRecipesCollection };
export default app;
