// /src/services/db.js - ENHANCED WITH PROFILE FUNCTIONS

// This module centralizes all interactions with the Firestore database.

// 1. Import all necessary Firestore functions and our initialized 'db' service
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  orderBy, // Merged imports for cleanliness
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { db } from "./firebase.js"; // Our initialized Firestore instance

// ===================================================================================
//  EXISTING WORKING FUNCTIONS (No changes were made to these)
// ===================================================================================

/**
 * Creates a new user document in the 'users' collection after signup.
 * @param {object} user - The user object provided by Firebase Authentication.
 * @returns {Promise<void>} A promise that resolves when the document is created.
 */
export const createUserProfile = (user) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp(),
  };
  // Using { merge: true } is a best practice to prevent overwriting data
  return setDoc(userRef, userData, { merge: true });
};

/**
 * Fetches all courses a specific user is enrolled in.
 * @param {string} userId - The UID of the user.
 * @returns {Promise<Array>} A promise that resolves with an array of course objects.
 */
export const getEnrolledCourses = async (userId) => {
  if (!userId) {
    console.error("User ID is required to fetch enrolled courses.");
    return [];
  }
  try {
    const enrollmentsRef = collection(db, "enrollments");
    const q = query(enrollmentsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return [];
    const coursePromises = querySnapshot.docs.map((enrollmentDoc) => {
      const courseId = enrollmentDoc.data().courseId;
      const courseRef = doc(db, "courses", courseId);
      return getDoc(courseRef);
    });
    const courseSnapshots = await Promise.all(coursePromises);
    const courses = courseSnapshots
      .map((courseDoc) => {
        if (courseDoc.exists()) {
          return { id: courseDoc.id, ...courseDoc.data() };
        }
        return null;
      })
      .filter((course) => course !== null);
    return courses;
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return [];
  }
};

/**
 * Fetches all lessons for a specific course, sorted by their order.
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Array>} A promise that resolves with an array of lesson objects.
 */
export const getCourseLessons = async (courseId) => {
  if (!courseId) return [];
  try {
    const lessonsRef = collection(db, "lessons");
    const q = query(
      lessonsRef,
      where("courseId", "==", courseId),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);
    const lessons = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return lessons;
  } catch (error) {
    console.error("Error fetching course lessons:", error);
    return [];
  }
};

/**
 * Fetches a single course document by its ID.
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<object|null>} A promise that resolves with the course data or null if not found.
 */
export const getCourseById = async (courseId) => {
  if (!courseId) return null;
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      return { id: courseSnap.id, ...courseSnap.data() };
    } else {
      console.log("No such course found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    return null;
  }
};

// ===================================================================================
//  *** NEW FUNCTIONS FOR THE 'MY PROFILE' PAGE START HERE ***
// ===================================================================================

/**
 * Fetches the user's detailed profile data from the 'users' collection in Firestore.
 * @param {string} userId - The UID of the user whose profile to fetch.
 * @returns {Promise<object|null>} A promise that resolves with the user profile data or null if not found.
 */
export const getUserProfile = async (userId) => {
  if (!userId) return null;
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No user profile found in Firestore for this user.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Updates a user's profile document in the 'users' collection in Firestore.
 * @param {string} userId - The UID of the user whose profile to update.
 * @param {object} profileData - An object containing the fields to update (e.g., { firstName, lastName, whatsappNumber }).
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
export const updateUserProfileData = (userId, profileData) => {
  if (!userId || !profileData)
    return Promise.reject(new Error("User ID and profile data are required."));
  const userRef = doc(db, "users", userId);
  // Use setDoc with { merge: true } to only update the fields provided, without overwriting the entire document.
  return setDoc(userRef, profileData, { merge: true });
};
