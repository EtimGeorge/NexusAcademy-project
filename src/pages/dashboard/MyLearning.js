// /src/pages/Dashboard/MyLearning.js

import { auth } from "../../services/firebase.js";
import { getEnrolledCourses } from "../../services/db.js";

// This mock data is moved here from the old Dashboard.js
const mockUserProgress = {
  "0081JItLJETHm6mWSVF7": {
    progressPercentage: 66,
    lastAccessedLesson: "The Universal Prompt Formula",
  },
};

export async function render() {
  // This component renders the main content for the "My Learning" page.
  const user = auth.currentUser;
  if (!user) return document.createElement("div"); // Should not happen, but as a safeguard

  const enrolledCourses = await getEnrolledCourses(user.uid);
  const element = document.createElement("div");

  if (enrolledCourses.length === 0) {
    element.innerHTML = `<h2>My Learning</h2><p>You are not yet enrolled in any courses. <a href="/#/courses" style="color: var(--primary-color);">Explore our courses</a> to get started.</p>`;
    return element;
  }

  const continueLearningHtml = renderContinueLearning(enrolledCourses);
  const myCoursesHtml = renderMyCourses(enrolledCourses);

  element.innerHTML = `
        ${continueLearningHtml}
        ${myCoursesHtml}
    `;
  return element;
}

export function init() {
  // We need to re-run scroll animations every time this content is loaded.
  initScrollAnimations();
}

// --- All the helper functions from the old Dashboard.js are now here ---

function renderContinueLearning(courses) {
  const lastCourse = courses[0];
  const progress = mockUserProgress[lastCourse.id] || { progressPercentage: 0 };
  return `
        <section class="continue-learning-card animate-on-scroll">
            <h2>Continue Learning</h2>
            ${createCourseCardHtml(lastCourse, progress)}
        </section>
    `;
}

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
