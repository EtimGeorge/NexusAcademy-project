// /src/services/auth.js - FINAL CORRECTED VERSION

// 1. Import necessary Firebase Auth functions and our initialized 'auth' service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  // We import the function we need from the SDK
  onAuthStateChanged as firebaseOnAuthStateChanged // <-- See change 1: Import with a temporary name
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from './firebase.js'; // Our initialized auth service

// 2. Create an instance of the Google provider
const googleProvider = new GoogleAuthProvider();

// --- All other functions remain the same ---

export const signupWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
  return signOut(auth);
};


// --- *** THE FIX IS HERE *** ---
/**
 * A listener that triggers a callback function whenever the user's
 * authentication state changes (login or logout).
 * We are creating our own function that takes a callback, and inside it,
 * we call the official Firebase function we imported.
 * @param {function} callback - The function to call with the user object (or null if logged out).
 * @returns {Unsubscribe} A function to unsubscribe the listener.
 */
export const onAuthStateChanged = (callback) => {
  // Call the official function (which we named 'firebaseOnAuthStateChanged')
  // and pass it our auth instance and the callback we received.
  return firebaseOnAuthStateChanged(auth, callback);
};