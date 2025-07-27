// /src/pages/CoursesPage/CoursesPage.js - FINAL DATA-DRIVEN VERSION

import { initNavbar } from "../../components/Navbar/Navbar.js";

// ===================================================================================
//  MASTER COURSE CATALOG
//  This is our "Single Source of Truth" for all course offerings.
//  It is detailed and structured to be easily filtered and rendered.
// ===================================================================================
const allCourses = [
  // --- Content & Marketing Track ---
  {
    id: "cm-1",
    title: "AI for Content & Marketing Masterclass",
    description:
      "A complete guide to generating viral content ideas, writing compelling copy, and creating stunning visuals with AI.",
    imageUrl:
      "https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Content & Marketing",
    level: "Beginner",
    duration: "8 Hours",
    modules: [
      "Prompt Engineering for Creatives",
      "AI Copywriting",
      "Midjourney Mastery",
      "AI Video Creation",
    ],
  },
  {
    id: "cm-2",
    title: "Midjourney Mastery: From Prompt to Photorealism",
    description:
      "Go beyond basic prompts. Learn advanced techniques for character consistency, style emulation, and creating hyper-realistic images.",
    imageUrl:
      "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Content & Marketing",
    level: "Intermediate",
    duration: "5 Hours",
    modules: [
      "Advanced Prompting",
      "Parameter Control",
      "Style Tuning",
      "Character Sheets",
    ],
  },
  // --- Business & Productivity Track ---
  {
    id: "bp-1",
    title: "AI for Business & Productivity Masterclass",
    description:
      "Automate tedious tasks, analyze data for key insights, and build custom AI agents to streamline your business workflows.",
    imageUrl:
      "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Business & Productivity",
    level: "Beginner",
    duration: "10 Hours",
    modules: [
      "Workflow Automation",
      "Data Analysis with AI",
      "Building Custom GPTs",
      "AI Meeting Assistants",
    ],
  },
  {
    id: "bp-2",
    title: "Agentic Workflows with n8n",
    description:
      "Move beyond simple automation. Learn to build complex, multi-step AI agents that can perform tasks autonomously.",
    imageUrl:
      "https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Business & Productivity",
    level: "Advanced",
    duration: "12 Hours",
    modules: [
      "n8n Fundamentals",
      "API Integration",
      "Vector Databases",
      "Multi-Agent Systems",
    ],
  },
  // --- Academia & Research Track ---
  {
    id: "ar-1",
    title: "AI for Academic Research",
    description:
      "Supercharge your research process. Learn to use AI for literature reviews, data synthesis, and drafting academic papers ethically.",
    imageUrl:
      "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Academia & Research",
    level: "Intermediate",
    duration: "6 Hours",
    modules: [
      "Ethical AI Use",
      "Literature Review Automation",
      "AI-Powered Data Analysis",
      "Academic Writing",
    ],
  },
  // --- Foundations Track ---
  {
    id: "f-1",
    title: "The AI Quickstart",
    description:
      "The essential first step. Go from zero experience to creating your first AI-generated content in just one hour.",
    imageUrl:
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Foundations",
    level: "Beginner",
    duration: "1 Hour",
    modules: [
      "Core Concepts",
      "First Prompts",
      "AI Image Generation",
      "Voice Cloning",
    ],
  },
];

// --- State Management for Filters ---
let currentFilters = {
  category: "All",
  level: "All",
};

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

export async function render() {
  const pageHtml = await (
    await fetch("/src/pages/CoursesPage/CoursesPage.html")
  ).text();
  const element = document.createElement("div");
  element.innerHTML = pageHtml;

  const navbarContainer = element.querySelector("#navbar-container");
  navbarContainer.innerHTML = await (
    await fetch("/src/components/Navbar/Navbar.html")
  ).text();

  // Dynamically render the filter controls based on our course data
  renderFilterControls(element);

  // Perform the initial render of all courses
  renderFilteredCourses(element);

  return element;
}

export function init() {
  if (typeof anime === "undefined")
    return console.error("Anime.js not loaded!");
  initNavbar();
  initHeaderAnimation();
  initFilterListeners(); // Initialize listeners for our new filter buttons
}

// ===================================================================================
//  DYNAMIC RENDERING & FILTERING LOGIC
// ===================================================================================

/**
 * Dynamically creates and injects the filter buttons into the page.
 * @param {HTMLElement} pageElement - The main page element to inject into.
 */
function renderFilterControls(pageElement) {
  const topicContainer = pageElement.querySelector("#topic-filters");
  const levelContainer = pageElement.querySelector("#level-filters");

  // Get unique values from our data
  const categories = ["All", ...new Set(allCourses.map((c) => c.category))];
  const levels = ["All", ...new Set(allCourses.map((c) => c.level))];

  // Create and inject the HTML for the buttons
  topicContainer.innerHTML = categories
    .map(
      (cat) =>
        `<button class="filter-btn ${
          cat === "All" ? "active" : ""
        }" data-filter-type="category" data-filter-value="${cat}">${cat}</button>`
    )
    .join("");

  levelContainer.innerHTML = levels
    .map(
      (lvl) =>
        `<button class="filter-btn ${
          lvl === "All" ? "active" : ""
        }" data-filter-type="level" data-filter-value="${lvl}">${lvl}</button>`
    )
    .join("");
}

/**
 * Filters the master course list based on currentFilters and updates the DOM.
 * @param {HTMLElement} [pageElement=document] - The element to search within for the grid.
 */
function renderFilteredCourses(pageElement = document) {
  const coursesGrid = pageElement.querySelector("#courses-grid");
  if (!coursesGrid) return;

  let filteredCourses = [...allCourses];

  // Apply category filter
  if (currentFilters.category !== "All") {
    filteredCourses = filteredCourses.filter(
      (c) => c.category === currentFilters.category
    );
  }
  // Apply level filter
  if (currentFilters.level !== "All") {
    filteredCourses = filteredCourses.filter(
      (c) => c.level === currentFilters.level
    );
  }

  if (filteredCourses.length > 0) {
    coursesGrid.innerHTML = filteredCourses.map(createCourseCardHtml).join("");
  } else {
    coursesGrid.innerHTML = `<p>No courses match your selected filters.</p>`;
  }

  // Re-initialize scroll animations for the newly rendered cards
  initScrollAnimations();
}

/**
 * Attaches click event listeners to the filter buttons.
 */
function initFilterListeners() {
  const filterControls = document.querySelector(".filter-controls");
  if (!filterControls) return;

  filterControls.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-btn")) {
      const type = e.target.dataset.filterType;
      const value = e.target.dataset.filterValue;

      // Update the state
      currentFilters[type] = value;

      // Re-render the courses
      renderFilteredCourses();

      // Update the 'active' class on the buttons
      document
        .querySelectorAll(`.filter-btn[data-filter-type="${type}"]`)
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
    }
  });
}

// ===================================================================================
//  HTML TEMPLATE GENERATOR
// ===================================================================================
function createCourseCardHtml(course) {
  return `
        <div class="course-card animate-on-scroll">
            <div class="course-card-image-container">
                <img src="${course.imageUrl}" alt="${course.title}" class="course-card-image" loading="lazy">
            </div>
            <div class="course-card-content">
                <div class="course-card-tags">
                    <span>${course.level}</span>
                    <span>${course.duration}</span>
                </div>
                <h3 class="course-card-title">${course.title}</h3>
                <p class="course-card-description">${course.description}</p>
                <a href="#/course/${course.id}" class="btn btn-primary">View Course</a>
            </div>
        </div>
    `;
}

// ===================================================================================
//  ANIMATION FUNCTIONS
// ===================================================================================
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
