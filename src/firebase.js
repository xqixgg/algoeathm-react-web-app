import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase config object
const firebaseConfig = {
    apiKey: "AIzaSyCCwRXxeQ1Ta3zGfDArVYxO0SRFT0v13iw",
    authDomain: "algoeathm.firebaseapp.com",
    projectId: "algoeathm",
    storageBucket: "algoeathm.firebasestorage.app",
    messagingSenderId: "606074979316",
    appId: "1:606074979316:web:f212e27e4a38f51704afa1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);

// Export for use in your app
export { db, auth };
export default app;
