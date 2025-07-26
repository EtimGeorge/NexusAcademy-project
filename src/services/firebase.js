// 1. Import the necessary functions from the Firebase SDKs

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// =========================================================================================
// IMPORTANT: REPLACE THIS CONFIGURATION OBJECT WITH YOUR OWN FROM THE FIREBASE CONSOLE
// =========================================================================================
const firebaseConfig = {
    apiKey: "AIzaSyADaoyNEBjUIfFuHXxyCdviUr2Zxrw4ox4",
    authDomain: "nexus-academy-fe605.firebaseapp.com",
    projectId: "nexus-academy-fe605",
    storageBucket: "nexus-academy-fe605.firebasestorage.app",
    messagingSenderId: "452930306032",
    appId: "1:452930306032:web:8b15c4bbdb92f5cb98e735",
    measurementId: "G-136E2B6XZV"
  };
// =========================================================================================
// END OF CONFIGURATION
// =========================================================================================


// 3. Initialize Firebase
// This creates the connection between our app and our Firebase project.
const app = initializeApp(firebaseConfig);

// 4. Initialize and export Firebase services
// We initialize each service (Auth, Firestore, etc.) here and export it.
// Other files in our project will import these services instead of re-initializing the app.
// This keeps our code clean and ensures we have a single instance of each service.
export const auth = getAuth(app);
export const db = getFirestore(app);


// Export these constants so we can import them into other files (like auth.js and db.js).
// This is the core of our modular approach.
// export { auth, db };