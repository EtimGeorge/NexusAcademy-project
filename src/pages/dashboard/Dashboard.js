// /src/pages/Dashboard/Dashboard.js - NEW LAYOUT SHELL & MINI-ROUTER

import { auth } from '../../services/firebase.js';
import { logout } from '../../services/auth.js';

// ===================================================================================
//  DASHBOARD ROUTING
//  This object maps URL paths to the JavaScript modules that render their content.
// ===================================================================================
const dashboardRoutes = {
    '/dashboard': { module: '/src/pages/Dashboard/MyLearning.js' },
    '/profile': { module: '/src/pages/ProfilePage/ProfilePage.js' },
    '/settings': { module: '/src/pages/SettingsPage/SettingsPage.js' }, // Future route
};

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

/**
 * Renders the static shell of the dashboard (the sidebar and main content area).
 * The content itself is loaded by the init() function.
 * @returns {Promise<HTMLElement>} The fully constructed page element.
 */
export async function render() {
    const pageHtml = await (await fetch('/src/pages/Dashboard/Dashboard.html')).text();
    const element = document.createElement('div');
    element.innerHTML = pageHtml;
    return element;
}

/**
 * Initializes the dashboard shell and loads the appropriate content page.
 */
export async function init() {
    const user = auth.currentUser;
    if (!user) {
        window.location.hash = '/login';
        return;
    }

    // Initialize the persistent parts of the UI
    initMobileSidebarToggle();
    renderUserProfile(user);
    initDashboardNav();

    // Determine which dashboard sub-page to load
    const currentPath = window.location.hash.slice(1).split('?')[0] || '/dashboard';
    loadContentForRoute(currentPath);
}


// ===================================================================================
//  DYNAMIC CONTENT LOADER (The "Mini-Router")
// ===================================================================================

/**
 * Loads the correct content module into the main content area based on the path.
 * @param {string} path - The current URL path (e.g., '/profile').
 */
async function loadContentForRoute(path) {
    const contentContainer = document.getElementById('dashboard-content-container');
    if (!contentContainer) return;

    // Find the module associated with the current path. Default to '/dashboard'.
    const route = dashboardRoutes[path] || dashboardRoutes['/dashboard'];
    
    if (route) {
        try {
            contentContainer.innerHTML = `<div class="page-loader-container"><div class="spinner"></div></div>`;
            const pageModule = await import(route.module);
            
            // The render() function from the submodule (e.g., ProfilePage.js) returns the content element
            const contentElement = await pageModule.render(); 
            contentContainer.innerHTML = ''; // Clear the loader
            contentContainer.appendChild(contentElement);
            
            // The init() function from the submodule attaches its specific listeners
            if (pageModule.init) {
                pageModule.init();
            }
        } catch (error) {
            console.error(`Failed to load dashboard content for ${path}:`, error);
            contentContainer.innerHTML = `<h2>Error: Could not load content.</h2>`;
        }
    }
}


// ===================================================================================
//  SIDEBAR UI & INTERACTIVITY (No changes from here down)
// ===================================================================================

function renderUserProfile(user) {
    const avatarDiv = document.getElementById('user-avatar');
    const nameHeader = document.getElementById('user-display-name');
    const emailPara = document.getElementById('user-email');

    if (!avatarDiv || !nameHeader || !emailPara) return;

    nameHeader.textContent = user.displayName || 'Nexus Student';
    emailPara.textContent = user.email;

    if (user.photoURL) {
        avatarDiv.innerHTML = `<img src="${user.photoURL}" alt="User Avatar">`;
    } else {
        const initials = (user.displayName || user.email || 'NS').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        avatarDiv.textContent = initials;
    }
}

function initMobileSidebarToggle() {
    const hamburgerBtn = document.getElementById('dashboard-hamburger-btn');
    const sidebar = document.getElementById('dashboard-sidebar');
    if (hamburgerBtn && sidebar) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('is-active');
            sidebar.classList.toggle('is-active');
        });
    }
}

function initDashboardNav() {
    const navContainer = document.querySelector('.dashboard-nav');
    if (!navContainer) return;

    navContainer.addEventListener('click', async (e) => {
        const targetLink = e.target.closest('a');
        if (!targetLink) return;
        e.preventDefault();
        
        const destination = targetLink.hash;

        if (destination === '#/logout') {
            try {
                await logout();
                window.location.hash = '/login';
            } catch (error) {
                console.error('Logout failed:', error);
            }
            return;
        }

        if (destination && destination !== window.location.hash) {
            window.location.hash = destination;
            // The main app.js router will handle reloading the dashboard, which will then load the correct content.
        }
    });

    // Update the 'active' class based on the current URL
    const currentPath = window.location.hash.slice(1).split('?')[0];
    navContainer.querySelectorAll('.dashboard-nav-link').forEach(link => {
        const linkPath = new URL(link.href).hash.slice(1);
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}