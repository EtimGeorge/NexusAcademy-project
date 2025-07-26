# Product Requirements Document (PRD)
## Nexus Academy - Version 1.0

**Author:** AI CPO/CTO
**Stakeholder:** Human CEO
**Date:** July 24, 2025

---

### 1. Overview & Purpose
Nexus Academy is a web-based learning platform designed to provide practical, hands-on education in artificial intelligence for a diverse audience. This document outlines the requirements for the Minimum Viable Product (MVP) and the initial growth phase. Our core mission is to bridge the gap between theoretical knowledge and real-world application of AI tools. We will achieve this by offering a superior, interactive, and highly supported learning experience.

### 2. User Personas & Target Audience
We are building for three primary personas initially:

*   **P1: "The Creator" (Aisha, 28)**
    *   **Role:** Social Media Manager / Content Creator.
    *   **Goal:** Wants to learn how to use AI for ideation, image/video generation, and copywriting to gain a competitive edge and improve her workflow.
    *   **Frustration:** Finds generic YouTube tutorials unstructured and is overwhelmed by the number of new tools. Needs a clear, guided path.

*   **P2: "The Upskiller" (David, 35)**
    *   **Role:** Marketing Professional in a mid-sized company.
    *   **Goal:** Wants to learn how to apply AI for data analysis, productivity, and workflow automation to increase his value and secure a promotion.
    *   **Frustration:** His company is not providing formal training. He needs a flexible, self-paced course that delivers tangible business skills.

*   **P3: "The Curious" (Sam, 21)**
    *   **Role:** University Student.
    *   **Goal:** Wants to understand the fundamentals of AI to supplement his studies and prepare for the future job market.
    *   **Frustration:** Finds academic theory dry. Wants engaging, practical, and affordable ways to learn.

### 3. Product Features & Functionality (MVP)
The MVP will be centered around the "Value Ladder" model to ensure immediate value and a clear path for growth.

| Feature ID | Feature Name | Description | Priority |
| :--- | :--- | :--- | :--- |
| **AUTH-01** | **User Account System** | Users must be able to sign up, log in, and log out using Email/Password and Google Sign-In. The system will be powered by Firebase Authentication. | P0 (Must Have) |
| **PAY-01** | **Stripe Integration** | Users must be able to securely purchase courses. The initial launch will focus on selling the "AI Quickstart" package. This requires a Stripe Checkout integration and a secure webhook confirmation via a Firebase Cloud Function. | P0 (Must Have) |
| **LMS-01** | **Course Enrollment & Access** | Upon successful payment, users are granted access to the purchased course content. This will be managed via user permissions in the Firestore database. | P0 (Must Have) |
| **LMS-02**| **Course Player UI** | A clean, focused interface for consuming lesson content. It must support video embeds (YouTube/Vimeo), formatted text (HTML), and downloadable resources. | P0 (Must Have) |
| **LMS-03**| **Lesson Progress Tracking** | The system must automatically track which lessons a user has completed. A lesson is marked "complete" when the user clicks a "Mark as Complete" button. | P1 (Should Have) |
| **WEB-01** | **Marketing Landing Page**| A compelling, single-page public-facing website that explains the Nexus Academy value proposition and drives users to purchase the "AI Quickstart" course. | P0 (Must Have) |
| **WEB-02** | **Student Dashboard** | A private page for logged-in users. It will display their enrolled courses and their progress in each. | P0 (Must Have) |
| **BLOG-01** | **The Nexus Pulse Blog** | A functional blog to publish articles. It must support a list view of all posts and a detail view for individual posts. This is our primary marketing engine. Content will be stored in Firestore. | P1 (Should Have) |

### 4. Out of Scope for MVP (Future Features)
To ensure a timely launch, the following features will be deferred:
*   Community forums or real-time chat within the platform. (Community will be on WhatsApp initially).
*   Advanced quizzing and assessments.
*   Uploading of user-generated content or projects.
*   Admin dashboard for content creation (initially, content will be added directly to Firestore).
*   Cohort-based "sprints" and scheduling.

### 5. Success Metrics
We will measure the success of the MVP by tracking the following KPIs:
*   **Conversion Rate:** % of landing page visitors who purchase the "AI Quickstart" course. (Target: 2%)
*   **User Engagement:** Average number of lessons completed per user in the first week.
*   **Blog Traffic:** Number of unique visitors to "The Nexus Pulse."
*   **Upsell Interest:** Number of clicks on "Learn More" for the higher-tiered courses.

---