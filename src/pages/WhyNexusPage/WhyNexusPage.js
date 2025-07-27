// /src/pages/WhyNexusPage/WhyNexusPage.js

import { initNavbar } from "../../components/Navbar/Navbar.js";

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

/**
 * Renders the Why Nexus Page by fetching its HTML shell and injecting the navbar.
 * @returns {Promise<HTMLElement>} The fully constructed page element.
 */
export async function render() {
  const pageHtml = await (
    await fetch("src/pages/WhyNexusPage/WhyNexusPage.html")
  ).text();
  const element = document.createElement("div");
  element.innerHTML = pageHtml;

  // Fetch and inject the reusable Navbar component into its container
  const navbarContainer = element.querySelector("#navbar-container");
  navbarContainer.innerHTML = await (
    await fetch("src/components/Navbar/Navbar.html")
  ).text();

  return element;
}

/**
 * Initializes all client-side interactivity and animations for the page after it has been rendered.
 */
export function init() {
  // Ensure the animation library is loaded before use.
  if (typeof anime === "undefined") {
    console.error("Anime.js not loaded!");
    return;
  }

  // Make the navbar interactive (e.g., hamburger menu).
  initNavbar();

  // Initialize the animations for the page.
  initHeaderAnimation();
  initScrollAnimations();
}

// ===================================================================================
//  ANIMATION FUNCTIONS
//  These are consistent with the animations on our other pages.
// ===================================================================================

/**
 * Creates the initial "fade in and up" animation for the page header.
 */
function initHeaderAnimation() {
  anime({
    targets: ".animate-header",
    translateY: [20, 0],
    opacity: [0, 1],
    delay: anime.stagger(150),
    duration: 800,
    easing: "easeOutExpo",
  });
}

/**
 * Uses Intersection Observer to efficiently trigger animations on scroll.
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
    {
      threshold: 0.1, // Trigger when 10% of the element is visible.
    }
  );

  animatedElements.forEach((el) => {
    observer.observe(el);
  });
}
