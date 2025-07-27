// /src/pages/CoursePlayer/CoursePlayer.js - NEXUS "DIGITAL CLASSROOM" VERSION

import { getCourseDetailsById } from "../../services/courseData.js";

// --- Module-level variables (same as your file) ---
let course = null;
let lessons = [];
let currentLessonId = null;

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

export async function render() {
  // This now fetches our new, more complex HTML shell.
  const pageHtml = await (
    await fetch("/src/pages/CoursePlayer/CoursePlayer.html")
  ).text();
  const element = document.createElement("div");
  element.innerHTML = pageHtml;
  // The main container ID has been updated in the new HTML.
  element.id = "course-player-container";
  return element;
}

export async function init(params) {
  // The data fetching and processing logic is the same as your working version.
  const courseId = params?.id;
  if (!courseId) {
    document.getElementById("course-player-container").innerHTML =
      "<h1>Error: Course ID is missing.</h1>";
    return;
  }

  course = getCourseDetailsById(courseId);

  if (!course) {
    document.getElementById("course-player-container").innerHTML =
      "<h1>Error: Course data could not be found.</h1>";
    return;
  }

  lessons = course.modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lessonTitle, lessonIndex) => ({
      id: `${course.id}-m${moduleIndex}-l${lessonIndex}`,
      title: lessonTitle,
      moduleTitle: module.title,
      videoURL: "https://www.youtube.com/embed/S_p3-g_c3vo", // Placeholder
      textContentHTML: `<p>Full text content for "${lessonTitle}" will appear here.</p>`,
    }))
  );

  currentLessonId = lessons.length > 0 ? lessons[0].id : null;

  // This function now renders the new UI structure.
  renderFullUI();
  // This function now attaches listeners for both the lesson list AND the mobile toggle.
  attachEventListeners();
}

// ===================================================================================
//  UI RENDERING & INTERACTIVITY
// ===================================================================================

/**
 * Renders the full UI into the new HTML structure.
 */
function renderFullUI() {
  const courseTitleEl = document.getElementById("sidebar-course-title");
  const lessonListContainer = document.getElementById("lesson-list-container");

  if (courseTitleEl) {
    courseTitleEl.textContent = course.title;
  }

  if (lessonListContainer) {
    lessonListContainer.innerHTML = course.modules
      .map(
        (module) => `
            <h3 class="module-title">${module.title}</h3>
            <ul class="lesson-list">
                ${module.lessons
                  .map((lessonTitle) => {
                    const lessonObj = lessons.find(
                      (l) =>
                        l.title === lessonTitle &&
                        l.moduleTitle === module.title
                    );
                    return `
                        <li class="lesson-list-item" data-lesson-id="${lessonObj.id}">
                            <a href="#">
                                <span class="lesson-icon">●</span>
                                ${lessonTitle}
                            </a>
                        </li>
                    `;
                  })
                  .join("")}
            </ul>
        `
      )
      .join("");
  }

  // Render the initial lesson content and attach all event listeners.
  updateMainContent();
}

/**
 * Updates only the main content area (video and text).
 * (This is the same efficient logic from your file).
 */
function updateMainContent() {
  const mainContent = document.getElementById("lesson-main-content");
  const activeLesson = lessons.find((l) => l.id === currentLessonId);

  if (!mainContent) return;

  if (activeLesson) {
    mainContent.innerHTML = `
            <h3>${activeLesson.title}</h3>
            <div class="video-container">
                <iframe src="${activeLesson.videoURL}" title="${activeLesson.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="lesson-content-text">
                ${activeLesson.textContentHTML}
            </div>
        `;
  } else {
    mainContent.innerHTML = `<h3>Select a lesson to get started.</h3>`;
  }

  document.querySelectorAll(".lesson-list-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.lessonId === currentLessonId);
  });
}

/**
 * Attaches all necessary event listeners for the page.
 */
function attachEventListeners() {
  const lessonListContainer = document.getElementById("lesson-list-container");
  const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
  const sidebar = document.getElementById("lesson-sidebar");

  // Listener for the lesson list (same as your file)
  if (lessonListContainer) {
    lessonListContainer.addEventListener("click", (e) => {
      const clickedLi = e.target.closest(".lesson-list-item");
      if (clickedLi && clickedLi.dataset.lessonId) {
        e.preventDefault();
        const newLessonId = clickedLi.dataset.lessonId;
        if (newLessonId !== currentLessonId) {
          currentLessonId = newLessonId;
          updateMainContent();
          // On mobile, close the sidebar after selecting a new lesson
          if (sidebar.classList.contains("is-active")) {
            sidebar.classList.remove("is-active");
            sidebarToggleBtn.classList.remove("is-active");
          }
        }
      }
    });
  }

  // Listener for the mobile sidebar toggle button
  if (sidebarToggleBtn && sidebar) {
    sidebarToggleBtn.addEventListener("click", () => {
      sidebarToggleBtn.classList.toggle("is-active");
      sidebar.classList.toggle("is-active");
    });
  }
}
