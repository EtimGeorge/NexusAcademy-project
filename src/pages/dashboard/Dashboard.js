// /src/pages/Dashboard/Dashboard.js - FINAL ENHANCED VERSION

import { auth } from "../../services/firebase.js";
import { logout } from "../../services/auth.js";
import { getEnrolledCourses } from "../../services/db.js";

// ===================================================================================
//  MOCK DATA (for Phase 1 of the dashboard)
//  This simulates the progress data we will later store in Firestore.
// ===================================================================================
const mockUserProgress = {
  "0081JItLJETHm6mWSVF7": {
    progressPercentage: 66,
    lastAccessedLesson: "The Universal Prompt Formula",
  },
  // In a real scenario with more courses, we would add their IDs and progress here.
  // e.g., "cm-2": { progressPercentage: 25, lastAccessedLesson: "Advanced Prompting" }
};

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

/**
 * Renders the initial HTML shell for the dashboard.
 * The content is populated dynamically by the init() function.
 * @returns {Promise<HTMLElement>} The fully constructed page element.
 */
export async function render() {
  const pageHtml = await (
    await fetch("/src/pages/Dashboard/Dashboard.html")
  ).text();
  const element = document.createElement("div");
  element.innerHTML = pageHtml;
  return element;
}

/**
 * Initializes all functionality for the dashboard after it's rendered.
 */
export async function init() {
  const user = auth.currentUser;
  // This is a safeguard; the main router should prevent unauthenticated access.
  if (!user) {
    window.location.hash = "/login";
    return;
  }

  // Initialize all parts of the new dashboard UI
  initMobileSidebarToggle();
  renderUserProfile(user);
  initDashboardNav();
  renderMainContent(user.uid);
}

// ===================================================================================
//  UI RENDERING & LOGIC
// ===================================================================================

/**
 * Populates the user profile widget in the sidebar with the user's details.
 * @param {object} user - The current Firebase user object.
 */
function renderUserProfile(user) {
  const avatarDiv = document.getElementById("user-avatar");
  const nameHeader = document.getElementById("user-display-name");
  const emailPara = document.getElementById("user-email");

  if (!avatarDiv || !nameHeader || !emailPara) return;

  nameHeader.textContent = user.displayName || "Nexus Student";
  emailPara.textContent = user.email;

  if (user.photoURL) {
    avatarDiv.innerHTML = `<img src="${user.photoURL}" alt="User Avatar">`;
  } else {
    // Create avatar with initials if no photo exists
    const initials = (user.displayName || user.email || "NS")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    avatarDiv.textContent = initials;
  }
}

/**
 * Fetches course data and renders the "Continue Learning" and "My Courses" sections.
 * @param {string} userId - The UID of the current user.
 */
async function renderMainContent(userId) {
  const contentContainer = document.getElementById(
    "dashboard-content-container"
  );
  if (!contentContainer) return;

  const enrolledCourses = await getEnrolledCourses(userId);

  if (enrolledCourses.length === 0) {
    contentContainer.innerHTML = `<h2>My Learning</h2><p>You are not yet enrolled in any courses. <a href="/#/courses" style="color: var(--primary-color);">Explore our courses</a> to get started.</p>`;
    return;
  }

  const continueLearningHtml = renderContinueLearning(enrolledCourses);
  const myCoursesHtml = renderMyCourses(enrolledCourses);

  contentContainer.innerHTML = `
        ${continueLearningHtml}
        ${myCoursesHtml}
    `;

  initScrollAnimations();
}

/**
 * Creates the HTML for the "Continue Learning" section.
 * @param {Array} courses - The user's enrolled courses.
 * @returns {string} The HTML string for the section.
 */
function renderContinueLearning(courses) {
  // In a real app, we'd find the course with the most recent 'lastAccessed' timestamp.
  // For this demo, we'll feature the first course.
  const lastCourse = courses[0];
  const progress = mockUserProgress[lastCourse.id] || { progressPercentage: 0 };

  return `
        <section class="continue-learning-card animate-on-scroll">
            <h2>Continue Learning</h2>
            ${createCourseCardHtml(lastCourse, progress)}
        </section>
    `;
}

/**
 * Creates the HTML for the "My Courses" grid.
 * @param {Array} courses - The user's enrolled courses.
 * @returns {string} The HTML string for the section.
 */
function renderMyCourses(courses) {
  return `
        <section class="my-courses-section">
            <h2>All My Courses</h2>
            <div class="my-courses-grid">
                ${courses
                  .map((course) => {
                    const progress = mockUserProgress[course.id] || {
                      progressPercentage: 0,
                    };
                    return createCourseCardHtml(course, progress);
                  })
                  .join("")}
            </div>
        </section>
    `;
}

/**
 * Creates the HTML for a single course card, including its progress bar.
 * @param {object} course - The course data object.
 * @param {object} progress - The progress data for this course.
 * @returns {string} The HTML string for the card.
 */
function createCourseCardHtml(course, progress) {
  return `
        <div class="course-card animate-on-scroll">
            <a href="/#/course/${course.id}" class="course-card-link-wrapper">
                <div class="course-card-image-container">
                    <img src="${
                      course.imageUrl || "https://via.placeholder.com/400x225"
                    }" alt="${
    course.title
  }" class="course-card-image" loading="lazy">
                </div>
                <div class="course-card-content">
                    <h3 class="course-card-title">${course.title}</h3>
                    <div class="progress-bar">
                        <div class="progress-bar-inner" style="width: ${
                          progress.progressPercentage
                        }%;"></div>
                    </div>
                    <p class="progress-text">${
                      progress.progressPercentage
                    }% Complete</p>
                </div>
            </a>
        </div>
    `;
}

// ===================================================================================
//  INTERACTIVITY & ANIMATIONS
// ===================================================================================

/**
 * Attaches the click listener for the mobile hamburger button to toggle the sidebar.
 */
function initMobileSidebarToggle() {
  const hamburgerBtn = document.getElementById("dashboard-hamburger-btn");
  const sidebar = document.getElementById("dashboard-sidebar");
  if (hamburgerBtn && sidebar) {
    hamburgerBtn.addEventListener("click", () => {
      hamburgerBtn.classList.toggle("is-active");
      sidebar.classList.toggle("is-active");
    });
  }
}

/**
 * Attaches event listeners to dashboard navigation links, including Logout.
 */
function initDashboardNav() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await logout();
        window.location.hash = "/login";
      } catch (error) {
        console.error("Logout failed:", error);
      }
    });
  }
}

/**
 * Initializes scroll animations for elements.
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  animatedElements.forEach((el) => observer.observe(el));
}
