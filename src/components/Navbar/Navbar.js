// /src/components/Navbar/Navbar.js
// /src/components/Navbar/Navbar.js

/**
 * Initializes the functionality for the main navigation bar.
 * This includes handling the mobile hamburger menu toggle.
 * This function should be called from the init() function of any page that uses the navbar.
 */
export function initNavbar() {
    // Find the hamburger button and the navigation links container by their IDs.
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('main-nav-links');

    // It's good practice to check if the elements exist before adding listeners.
    if (hamburgerBtn && navLinks) {
        // Add a click event listener to the hamburger button.
        hamburgerBtn.addEventListener('click', () => {
            // Toggle the 'is-active' class on both the button and the nav container.
            // 1. On the button, this triggers the CSS animation to turn the hamburger into an 'X'.
            // 2. On the nav container, this triggers the CSS to slide the menu into view.
            hamburgerBtn.classList.toggle('is-active');
            navLinks.classList.toggle('is-active');
        });
    }
}