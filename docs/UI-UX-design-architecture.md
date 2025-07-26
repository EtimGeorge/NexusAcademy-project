# UI/UX Design & Architecture
## Nexus Academy - Version 1.0

**Author:** AI CPO/CTO
**Stakeholder:** Human CEO
**Date:** July 24, 2025

---

### 1. Design Philosophy
*   **Clarity and Focus:** The UI must be clean, modern, and uncluttered, removing all distractions from the core task of learning.
*   **Mobile-First Responsive Design:** All components and layouts will be designed for a small screen first, then scaled up to tablet and desktop. This ensures a flawless experience on all devices.
*   **Accessibility:** We will adhere to WCAG 2.1 AA standards, ensuring proper color contrast, keyboard navigation, and semantic HTML for screen readers.

### 2. Design System

*   **Color Palette:**
    *   **Primary (Brand/Action):** `#4F46E5` (A strong, modern Indigo)
    *   **Neutral (Text):** `#111827` (Almost Black)
    *   **Neutral-Secondary (Sub-text):** `#6B7280` (Gray)
    *   **Background (Main):** `#FFFFFF` (White)
    *   **Background (Subtle):** `#F9FAFB` (Off-White)
    *   **Success:** `#10B981` (Green)
    *   **Warning/Error:** `#EF4444` (Red)

*   **Typography:**
    *   **Font Family:** `Inter` (A clean, highly legible sans-serif font, available on Google Fonts).
    *   **Headings (`<h1>`, `<h2>`):** Font weight `700` (Bold).
    *   **Body Text (`<p>`):** Font weight `400` (Regular). Line height `1.6`.

*   **Spacing & Layout:**
    *   A consistent spacing scale based on a 4px grid will be used (e.g., 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px).
    *   Max content width will be `1280px` on large screens, centered.

*   **Buttons:**
    *   **Primary:** Solid background (`#4F46E5`), white text, rounded corners (`6px`), subtle shadow on hover.
    *   **Secondary:** White background, solid border (`#4F46E5`), brand color text.

### 3. Component Architecture (Vanilla JavaScript Approach)
To manage complexity without a framework, we will adopt a component-based file structure.


/src
|-- /components
| |-- /Navbar
| | |-- Navbar.css
| | |-- Navbar.js
| |-- /CourseCard
| | |-- CourseCard.css
| | |-- CourseCard.js
|-- /pages
| |-- /Dashboard
| | |-- Dashboard.html
| | |-- Dashboard.css
| | |-- Dashboard.js
| |-- /CoursePlayer
| | |-- CoursePlayer.html
| | |-- CoursePlayer.css
| | |-- CoursePlayer.js
|-- /services
| |-- auth.js (Handles all Firebase Auth logic)
| |-- db.js (Handles all Firestore logic)
|-- app.js (Main application script, router)
|-- index.html (The single page shell)
|-- style.css (Global styles, variables)
Generated code
The `app.js` will be responsible for dynamically loading the HTML, CSS, and JS for each "page" into the `index.html` shell.

### 4. Wireframes (Text-Based Description)

#### 4.1. Page: Landing Page (`/`)
*   **Header:** Logo on the left. Navigation links ("Courses", "Blog", "Login") on the right. A primary "Enroll Now" button.
*   **Hero Section:** Large, compelling headline (e.g., "Go From Zero to AI Hero"). Sub-headline explaining the value proposition. A primary call-to-action (CTA) button linking to the "AI Quickstart" purchase.
*   **"As Seen On" Social Proof:** Logos of trusted brands (can be aspirational initially).
*   **Course Features Section:** Icon-based grid highlighting key benefits (e.g., "24/7 AI Tutor", "Practical Projects", "Community").
*   **How It Works Section:** A simple 1-2-3 graphic explaining the learning process.
*   **Course Details Section:** A detailed breakdown of the "AI Quickstart" curriculum.
*   **Testimonials Section:** Placeholders for future student testimonials.
*   **Final CTA Section:** Another large section urging users to enroll.
*   **Footer:** Links to social media, terms of service, and contact information.

#### 4.2. Page: Student Dashboard (`/dashboard`)
*   **Header:** Authenticated state (shows user's profile picture/initials, dropdown with "Logout").
*   **Main Content Area:**
    *   **Headline:** `<h1>Welcome back, [User's Name]!</h1>`
    *   **"My Courses" Section:**
        *   A grid of `CourseCard` components.
        *   Each card displays the course title, a thumbnail image, and a progress bar showing completion percentage.
        *   Clicking a card navigates to the `CoursePlayer` page for that course.
    *   **"Latest from the Blog" Section (Optional):** A small section linking to the 3 most recent posts from "The Nexus Pulse".

#### 4.3. Page: Course Player (`/course/{courseId}`)
*   **Layout:** Two-column layout on desktop. Single column on mobile.
*   **Left Column (Lesson List):**
    *   A scrollable list of all lessons in the course, grouped by module.
    *   Each lesson item shows a checkmark if completed.
    *   The currently active lesson is highlighted.
*   **Right Column (Main Content Area):**
    *   **Lesson Title:** `<h2>Module 1.1: What is a Large Language Model?</h2>`
    *   **Video Player:** A large, responsive video embed area.
    *   **Lesson Text:** Well-formatted text content below the video.
    *   **Resources:** A section for downloadable files.
    *   **Action Buttons:**
        *   A large, primary "Mark as Complete & Go to Next Lesson" button.
        *   A secondary "Ask Aida about this lesson" button (This will open WhatsApp via a `wa.me` link).

---