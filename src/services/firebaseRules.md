rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // --- Public & Semi-Public Collections ---
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if false; // Managed by Admin Panel in the future
    }

    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if false; // Managed by Admin Panel in the future
    }

    // --- User-Specific Collections ---

    match /enrollments/{enrollmentId} {
      // This rule from your file is correct. It allows a user to
      // read their own enrollment documents, whether by a direct 'get' or a 'query'.
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if false; // Managed by server-side logic upon payment
    }

    // *** THIS IS THE FINAL, CORRECTED RULE FOR USER PROFILES ***
    match /users/{userId} {
      // Any authenticated user can read public profile data.
      allow read: if request.auth != null;

      // A user can create, update, and delete THEIR OWN document, but no one else's.
      // This is the most secure and complete rule for all our features.
      allow create, update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}