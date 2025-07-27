// /src/services/auth.js - FINAL, CORRECTED, AND DE-DUPLICATED

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup, // *** THIS IS THE ONLY ADDITION ***
  updatePassword,
  deleteUser,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from "./firebase.js";

const googleProvider = new GoogleAuthProvider();

// ===================================================================================
//  CORE AUTHENTICATION FUNCTIONS
// ===================================================================================

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

export const onAuthStateChanged = (callback) => {
  return firebaseOnAuthStateChanged(auth, callback);
};

// ===================================================================================
//  USER PROFILE & ACCOUNT MANAGEMENT FUNCTIONS
// ===================================================================================

/**
 * Updates the current user's profile in Firebase Authentication (e.g., displayName, photoURL).
 * This is the single, correct version of this function.
 * @param {object} profileData - An object with data to update, e.g., { displayName: 'New Name' }.
 * @returns {Promise<void>}
 */
export const updateUserProfile = (profileData) => {
  const user = auth.currentUser;
  if (!user) return Promise.reject(new Error("No authenticated user found."));
  return updateProfile(user, profileData);
};

/**
 * Re-authenticates the current user based on their original sign-in method.
 * This is the new, smart function that handles both Password and Google users.
 * @param {string} [currentPassword] - The user's current password, ONLY required for email/password users.
 * @returns {Promise<void>} A promise that resolves if re-authentication is successful.
 */
export const reauthenticateUser = (currentPassword) => {
  const user = auth.currentUser;
  if (!user)
    return Promise.reject(new Error("No user is currently signed in."));

  // Check the user's provider data to see how they signed in.
  const providerId = user.providerData[0].providerId;

  if (providerId === "password") {
    // User signed in with email/password. This requires a password.
    if (!currentPassword) {
      return Promise.reject(
        new Error("Password is required for re-authentication.")
      );
    }
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return reauthenticateWithCredential(user, credential);
  }

  if (providerId === "google.com") {
    // User signed in with Google. This triggers a popup.
    return reauthenticateWithPopup(user, googleProvider);
  }

  // Handle other providers or unexpected cases in the future.
  return Promise.reject(
    new Error("Unsupported authentication provider for re-authentication.")
  );
};

/**
 * Updates the current user's password. Requires recent re-authentication.
 * @param {string} newPassword - The user's desired new password.
 * @returns {Promise<void>}
 */
export const updateUserPassword = (newPassword) => {
  const user = auth.currentUser;
  if (!user)
    return Promise.reject(new Error("No user is currently signed in."));
  return updatePassword(user, newPassword);
};

/**
 * Deletes the current user's account from Firebase Authentication. Requires recent re-authentication.
 * @returns {Promise<void>}
 */
export const deleteUserAccount = () => {
  const user = auth.currentUser;
  if (!user)
    return Promise.reject(new Error("No user is currently signed in."));
  return deleteUser(user);
};
