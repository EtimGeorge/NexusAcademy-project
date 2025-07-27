// /src/pages/CourseDetailPage/CourseDetailPage.js
import { auth } from "../../services/firebase.js";

import { initNavbar } from "../../components/Navbar/Navbar.js";
// We will create this new mock data file in the next step
import { getCourseDetailsById } from "../../services/courseData.js";

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

export async function render(params) {
  const pageContainer = document.createElement("div");
  const shellHtml = await (
    await fetch("/src/pages/CourseDetailPage/CourseDetailPage.html")
  ).text();
  pageContainer.innerHTML = shellHtml;

  const navbarContainer = pageContainer.querySelector("#navbar-container");
  navbarContainer.innerHTML = await (
    await fetch("/src/components/Navbar/Navbar.html")
  ).text();

  return pageContainer;
}

export async function init(params) {
  const courseId = params?.id;
  const contentContainer = document.getElementById("course-detail-content");

  if (!courseId) {
    contentContainer.innerHTML = `<h2>Error: Course ID not found.</h2>`;
    return;
  }

  // --- Fetch the specific course data ---
  // This function will get the course and its detailed curriculum
  const course = getCourseDetailsById(courseId);

  if (!course) {
    contentContainer.innerHTML = `<h2>Error: Course not found.</h2>`;
    return;
  }

  // --- Render the full page content ---
  contentContainer.innerHTML = createCourseDetailPageHtml(course);

  // --- Initialize interactivity ---
  initNavbar();
  initCurriculumAccordion();
  initEnrollButton(course);
}

// ===================================================================================
//  HTML TEMPLATE GENERATORS
// ===================================================================================

function createCourseDetailPageHtml(course) {
  return `
        <header class="container course-hero">
            <span class="course-category">${course.category}</span>
            <h1>${course.title}</h1>
            <p>${course.subtitle}</p>
        </header>

        <div class="container course-layout">
            <main class="course-main-content">
                <h2>What You'll Learn</h2>
                <p>${course.learningOutcomes}</p>
                <br>
                <h2>Course Curriculum</h2>
                <div class="curriculum-accordion">
                    ${course.modules.map(createModuleHtml).join("")}
                </div>
            </main>
            <aside class="course-sidebar">
                <div class="course-sidebar-card">
                    <img src="${course.imageUrl}" alt="${
    course.title
  }" class="course-card-image" style="margin-bottom: 1.5rem; border-radius: 8px;">
                    <div class="course-price">$${course.price}</div>
                    <button id="enroll-btn" class="btn btn-primary">Enroll Now</button>
                    <ul class="key-features-list">
                        <li class="key-feature-item"><svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg><span>${
                          course.level
                        } Level</span></li>
                        <li class="key-feature-item"><svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg><span>Approx. ${
                          course.duration
                        }</span></li>
                        <li class="key-feature-item"><svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg><span>Self-Paced Learning</span></li>
                    </ul>
                </div>
            </aside>
        </div>
    `;
}

function createModuleHtml(module) {
  return `
        <div class="curriculum-module">
            <div class="module-header">
                <h3>${module.title}</h3>
                <svg class="module-toggle-icon" width="24" height="24" viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
            </div>
            <ul class="lesson-list">
                ${module.lessons
                  .map(
                    (lesson) =>
                      `<li class="lesson-item"><span class="lesson-icon">✓</span> ${lesson}</li>`
                  )
                  .join("")}
            </ul>
        </div>
    `;
}

// ===================================================================================
//  INTERACTIVITY
// ===================================================================================

function initCurriculumAccordion() {
  const accordion = document.querySelector(".curriculum-accordion");
  if (!accordion) return;

  accordion.addEventListener("click", (e) => {
    const header = e.target.closest(".module-header");
    if (header) {
      const module = header.parentElement;
      module.classList.toggle("is-open");
    }
  });
}

// --- THIS IS THE NEW CODE BLOCK ---
// Find the initEnrollButton function in /src/pages/CourseDetailPage/CourseDetailPage.js
// and replace it with this new, enhanced version.

function initEnrollButton(course) {
  const enrollBtn = document.getElementById("enroll-btn");
  if (!enrollBtn) return;

  enrollBtn.addEventListener("click", () => {
    const user = auth.currentUser; // Assuming 'auth' is available from firebase.js
    if (!user) {
      // If the user is not logged in, redirect them to sign up first.
      alert("Please create an account or sign in to enroll.");
      window.location.hash = "/signup";
      return;
    }

    // --- Paystack Integration ---
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: "YOUR_TEST_PUBLIC_KEY", // *** REPLACE WITH YOUR PAYSTACK TEST PUBLIC KEY ***
      email: user.email,
      // Amount is in the smallest currency unit (e.g., kobo for NGN).
      // 299 NGN would be 29900 kobo.
      amount: course.price * 100,
      currency: "NGN", // Or get this from user preferences
      ref: `NEXUS-${course.id}-${Date.now()}`, // A unique reference for this transaction
      metadata: {
        user_id: user.uid,
        course_id: course.id,
        course_title: course.title,
      },
      onSuccess: (transaction) => {
        // This callback is triggered when the payment is successful on the client side.
        // We show a confirmation and redirect. The real enrollment happens via webhook.
        alert("Payment successful! Your enrollment is being processed.");
        window.location.hash = "/dashboard";
      },
      onCancel: () => {
        // This is called if the user closes the popup.
        alert("Payment was cancelled.");
      },
    });
  });
}

// You will also need to import 'auth' at the top of this file
// import { auth } from '../../services/firebase.js';
