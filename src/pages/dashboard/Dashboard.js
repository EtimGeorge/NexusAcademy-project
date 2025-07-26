// /src/pages/Dashboard/Dashboard.js - FINAL CORRECTED VERSION

// *** THE FIX IS HERE ***
// We now use two separate imports to get the correct tools from the correct files.
import { auth } from '../../services/firebase.js'; // Get the main auth object from firebase.js
import { logout } from '../../services/auth.js';      // Get the logout function from auth.js

// We still import our other necessary functions and components
import { getEnrolledCourses } from '../../services/db.js';
import { createCourseCard } from '../../components/CourseCard/CourseCard.js';

// The render() function is now correct because 'auth.currentUser' will work.
export function render() {
    const user = auth.currentUser;
    const dashboardElement = document.createElement('div');
    dashboardElement.innerHTML = `
        <div class="container">
            <h1>Dashboard</h1>
            <!-- We can now safely use user.displayName for a better welcome message -->
            <p>Welcome back, ${user?.displayName || user?.email || 'Guest'}!</p>
            <button id="logout-btn" class="btn-secondary-link">Logout</button>
            <div id="courses-section">
                <h2>My Courses</h2>
                <div id="courses-grid" class="courses-grid-container">
                    <p id="loading-message">Loading your courses...</p>
                </div>
            </div>
        </div>
        <style>
            .courses-grid-container {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 1.5rem;
                margin-top: 1rem;
            }
            #courses-section {
                margin-top: 2rem;
            }
            .btn-secondary-link {
                display: inline-block; padding: 0.75rem 1.5rem; background-color: var(--background-color);
                color: var(--text-color); border: 1px solid var(--border-color); font-weight: 700;
                border-radius: 6px; cursor: pointer; margin-top: 1rem;
            }
        </style>
    `;
    return dashboardElement;
}

// The init() function does not need to change. It will now work correctly.
export async function init() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await logout();
            } catch (error) {
                console.error('Logout failed:', error);
            }
        });
    }

    const coursesGrid = document.getElementById('courses-grid');
    const loadingMessage = document.getElementById('loading-message');
    const user = auth.currentUser;

    if (user && coursesGrid) {
        const enrolledCourses = await getEnrolledCourses(user.uid);
        
        if(loadingMessage) {
            loadingMessage.remove();
        }

        if (enrolledCourses && enrolledCourses.length > 0) {
            enrolledCourses.forEach(course => {
                const courseCardElement = createCourseCard(course);
                coursesGrid.appendChild(courseCardElement);
            });
        } else {
            coursesGrid.innerHTML = '<p>You are not yet enrolled in any courses. <a href="/#/courses">Explore Courses</a></p>';
        }
    }
}