// /src/pages/CoursePlayer/CoursePlayer.js - NEW ROBUST VERSION

import { getCourseById, getCourseLessons } from '../../services/db.js';

// --- Module-level variables to hold our state ---
let course = null;
let lessons = [];
let currentLessonId = null;
let pageContainer = null;

// The render function is minimal. It creates a container for our dynamic content.
export function render() {
    const element = document.createElement('div');
    element.id = "course-player-container";
    element.innerHTML = `<div class="page-loader-container"><div class="spinner"></div></div>`;
    return element;
}

// The init function is the main entry point for the page's logic.
export async function init(params) {
    pageContainer = document.getElementById('course-player-container');
    if (!pageContainer) return;

    const courseId = params?.id;

    // *** CRITICAL DEBUGGING STEP ***
    console.log("Course Player init() called with params:", params);
    console.log("Attempting to fetch course with ID:", courseId);

    if (!courseId) {
        pageContainer.innerHTML = '<h1>Error: Course ID is missing.</h1>';
        return;
    }

    try {
        // Fetch all data in parallel.
        [course, lessons] = await Promise.all([
            getCourseById(courseId),
            getCourseLessons(courseId)
        ]);

        if (!course) {
            // This is the error you were seeing.
            pageContainer.innerHTML = '<h1>Error: Course data could not be found.</h1>';
            return;
        }

        // Set the default lesson and render the full UI for the first time.
        currentLessonId = lessons.length > 0 ? lessons[0].id : null;
        renderFullUI();
    } catch (error) {
        console.error("Failed to initialize Course Player:", error);
        pageContainer.innerHTML = '<h1>Error: Could not load course content.</h1>';
    }
}

// This function builds the entire page structure ONCE.
function renderFullUI() {
    if (!pageContainer) return;
    
    pageContainer.innerHTML = `
        <link rel="stylesheet" href="/src/pages/CoursePlayer/CoursePlayer.css">
        <div class="course-player-layout">
            <aside class="lesson-sidebar">
                <h2 class="course-title"><a href="/#/dashboard">← Dashboard</a></h2>
                <h3 class="module-title">${course.title || 'Course Content'}</h3>
                <ul id="lesson-list-ul" class="lesson-list">
                    ${lessons.map(lesson => `
                        <li class="lesson-list-item" data-lesson-id="${lesson.id}">
                            <a href="#">${lesson.title}</a>
                        </li>
                    `).join('')}
                </ul>
            </aside>
            <main id="lesson-main-content" class="lesson-main-content">
                <!-- Main content will be rendered here -->
            </main>
        </div>
    `;
    
    // After the main structure is built, render the content for the active lesson.
    updateMainContent();
    attachEventListeners();
}

// This function ONLY updates the main content area, which is more efficient.
function updateMainContent() {
    const mainContent = document.getElementById('lesson-main-content');
    const activeLesson = lessons.find(l => l.id === currentLessonId);

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

    // Update the 'active' class on the sidebar list.
    document.querySelectorAll('.lesson-list-item').forEach(item => {
        if (item.dataset.lessonId === currentLessonId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// This function attaches click listeners to the sidebar.
function attachEventListeners() {
    const lessonList = document.getElementById('lesson-list-ul');
    if (!lessonList) return;

    lessonList.addEventListener('click', (e) => {
        // Use event delegation to find the clicked <li> element.
        const clickedLi = e.target.closest('.lesson-list-item');
        if (clickedLi && clickedLi.dataset.lessonId) {
            e.preventDefault();
            const newLessonId = clickedLi.dataset.lessonId;
            if (newLessonId !== currentLessonId) {
                currentLessonId = newLessonId;
                // Only update the main content, don't re-render everything.
                updateMainContent();
            }
        }
    });
}