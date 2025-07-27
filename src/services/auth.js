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
  updatePassword,
  deleteUser
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { auth } from './firebase.js';

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
 * Re-authenticates the current user with their password.
 * @param {string} currentPassword - The user's current password.
 * @returns {Promise<void>}
 */
export const reauthenticateUser = (currentPassword) => {
    const user = auth.currentUser;
    if (!user) return Promise.reject(new Error("No user is currently signed in."));
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    return reauthenticateWithCredential(user, credential);
};

/**
 * Updates the current user's password. Requires recent re-authentication.
 * @param {string} newPassword - The user's desired new password.
 * @returns {Promise<void>}
 */
export const updateUserPassword = (newPassword) => {
    const user = auth.currentUser;
    if (!user) return Promise.reject(new Error("No user is currently signed in."));
    return updatePassword(user, newPassword);
};

/**
 * Deletes the current user's account from Firebase Authentication. Requires recent re-authentication.
 * @returns {Promise<void>}
 */
export const deleteUserAccount = () => {
    const user = auth.currentUser;
    if (!user) return Promise.reject(new Error("No user is currently signed in."));
    return deleteUser(user);
};