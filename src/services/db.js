// /src/services/db.js - FINAL CORRECTED VERSION

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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { db } from './firebase.js'; // Our initialized Firestore instance

/**
 * Creates a new user document in the 'users' collection after signup.
 * @param {object} user - The user object provided by Firebase Authentication.
 * @returns {Promise<void>} A promise that resolves when the document is created.
 */
export const createUserProfile = (user) => {
  if (!user) return; // Exit if no user is provided

  const userRef = doc(db, "users", user.uid);
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    createdAt: serverTimestamp()
  };

  return setDoc(userRef, userData);
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

    if (querySnapshot.empty) {
      return [];
    }

    const coursePromises = querySnapshot.docs.map(enrollmentDoc => {
      const courseId = enrollmentDoc.data().courseId;
      const courseRef = doc(db, "courses", courseId);
      return getDoc(courseRef);
    });

    const courseSnapshots = await Promise.all(coursePromises);

    const courses = courseSnapshots.map(courseDoc => {
      if (courseDoc.exists()) {
        return { id: courseDoc.id, ...courseDoc.data() };
      }
      return null;
    }).filter(course => course !== null);

    return courses;

  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    return [];
  }
};

// /src/services/db.js -- ADD THIS NEW FUNCTION

// --- All other functions (createUserProfile, getEnrolledCourses) are above ---

// Import 'orderBy' to sort our lessons correctly
import { orderBy } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

/**
 * Fetches all lessons for a specific course, sorted by their order.
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Array>} A promise that resolves with an array of lesson objects.
 */
export const getCourseLessons = async (courseId) => {
  if (!courseId) return [];

  try {
    const lessonsRef = collection(db, "lessons");
    // Create a query to find all lessons where courseId matches, and order them.
    const q = query(lessonsRef, where("courseId", "==", courseId), orderBy("order", "asc"));
    
    const querySnapshot = await getDocs(q);

    const lessons = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    const courseRef = doc(db, 'courses', courseId);
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