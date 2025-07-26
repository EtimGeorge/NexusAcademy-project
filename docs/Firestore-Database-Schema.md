# Firestore Database Schema
## Nexus Academy - Version 1.0

**Author:** AI CPO/CTO
**Purpose:** To define the collections and data structures for the Nexus Academy application within Google Firestore. This schema is designed for a Vanilla JavaScript implementation.

---

### 1. Data Modeling Philosophy
We will use a denormalized, collection-based approach suited for NoSQL databases like Firestore. This minimizes complex queries and is optimized for speed, as we will primarily fetch documents by their known IDs.

### 2. Core Collections

#### 2.1. `users`
Stores public-facing information for each registered user. The document ID will be the user's `uid` provided by Firebase Authentication.

*   **Collection:** `users`
*   **Document ID:** `{userId}` (e.g., `G7qR...tU23`)

```javascript
// Structure of a document in the 'users' collection
{
  // This is the unique ID from Firebase Auth, linking the auth record to this db record.
  "uid": "G7qR...tU23",

  // User's email, used for communication.
  "email": "student@example.com",

  // The user's chosen display name.
  "displayName": "Aisha David",

  // URL to the user's profile picture, provided by Google Sign-In or a placeholder.
  "photoURL": "https://lh3.googleusercontent.com/a-/...",

  // Timestamp of when the user account was created in our database.
  "createdAt": Timestamp(2025, 7, 24, ...)
}

2.2. courses
Stores the static information about each course offering.
Collection: courses
Document ID: {courseId} (e.g., ai-quickstart-v1)
Generated javascript
// Structure of a document in the 'courses' collection
{
  // A human-readable identifier for the course.
  "slug": "ai-quickstart-v1",

  // The full title of the course.
  "title": "The AI Quickstart Package",

  // A short, compelling description for display on course cards.
  "description": "Go from zero to creating with AI in your first hour. No experience needed.",

  // URL for the course's promotional thumbnail image.
  "thumbnailURL": "https://firebasestorage.googleapis.com/...",

  // Price in the smallest currency unit (e.g., cents for USD, kobo for NGN). 4900 = $49.00
  "price": 4900,

  // Currency code, e.g., "NGN", "USD".
  "currency": "NGN",

  // An ordered list of module IDs, defining the structure of the course.
  "moduleOrder": ["module-1-fundamentals", "module-2-practical-creation"]
}

2.3. lessons
Stores the actual content for each individual lesson. This keeps the courses documents light.
Collection: lessons
Document ID: {lessonId} (e.g., q_and_a_with_ai)
Generated javascript
// Structure of a document in the 'lessons' collection
{
  // The ID of the parent course, for fetching all lessons for a specific course.
  "courseId": "ai-quickstart-v1",

  // The ID of the module this lesson belongs to.
  "moduleId": "module-2-practical-creation",

  // The title of the lesson.
  "title": "Clone Your Voice in 5 Minutes",

  // The full URL for the lesson's video. We will use YouTube or Vimeo embeds.
  "videoURL": "https://www.youtube.com/embed/...",

  // The full text content of the lesson, stored as an HTML string for easy rendering.
  "textContentHTML": "<p>In this lesson, we will explore the amazing world of voice cloning...</p>",

  // An array of objects, where each object is a downloadable resource.
  "resources": [
    { "name": "Prompt Cheatsheet.pdf", "url": "https://firebasestorage.googleapis.com/..." },
    { "name": "Example Audio Files.zip", "url": "https://firebasestorage.googleapis.com/..." }
  ],

  // A number used for ordering lessons within a module.
  "order": 3
}

2.4. enrollments
This crucial collection links users to the courses they've purchased and tracks their progress.
Collection: enrollments
Document ID: {userId}_{courseId} (e.g., G7qR...tU23_ai-quickstart-v1)
Generated javascript
// Structure of a document in the 'enrollments' collection
{
  // The ID of the user who is enrolled.
  "userId": "G7qR...tU23",

  // The ID of the course they are enrolled in.
  "courseId": "ai-quickstart-v1",

  // Timestamp of when the enrollment was created (immediately after payment).
  "enrolledAt": Timestamp(2025, 7, 26, ...),

  // An array of completed lesson IDs. This is how we track progress.
  // When a user completes a lesson, we add the {lessonId} to this array.
  "completedLessons": ["intro-to-ai", "the-universal-prompt"]
}

2.5. blogPosts
Stores content for "The Nexus Pulse" blog.
Collection: blogPosts
Document ID: {postId} (e.g., top-5-ai-video-tools-2025)
Generated javascript
// Structure of a document in the 'blogPosts' collection
{
  // A URL-friendly version of the title.
  "slug": "top-5-ai-video-tools-2025",

  // The title of the blog post.
  "title": "The Top 5 AI Video Generation Tools You Need to Try in 2025",

  // The full content of the post, stored as an HTML string.
  "contentHTML": "<h1>The Rise of Generative Video</h1><p>The landscape of video creation has been...",

  // Name of the author.
  "authorName": "Nexus Academy Team",

  // The date the post was published. Used for sorting.
  "publishedAt": Timestamp(2025, 8, 1, ...),

  // URL for the post's header image.
  "headerImageURL": "https://firebasestorage.googleapis.com/..."
}


// =====================================
//  `firebaseConfig` object
// ==========================================
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyADaoyNEBjUIfFuHXxyCdviUr2Zxrw4ox4",
    authDomain: "nexus-academy-fe605.firebaseapp.com",
    projectId: "nexus-academy-fe605",
    storageBucket: "nexus-academy-fe605.firebasestorage.app",
    messagingSenderId: "452930306032",
    appId: "1:452930306032:web:8b15c4bbdb92f5cb98e735",
    measurementId: "G-136E2B6XZV"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>