// /src/pages/BlogPage/BlogPage.js - FINAL ENHANCED VERSION

import { initNavbar } from "../../components/Navbar/Navbar.js";
// NEW: We now import data from our single source of truth, mockData.js
import { allBlogPosts } from "../../services/mockData.js";

// NEW: We create a temporary data source for the popular courses widget.
const popularCourses = [
  {
    title: "AI for Content & Marketing",
    link: "/#/signup",
    imageUrl:
      "https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1",
  },
  {
    title: "The Agentic Architect Program",
    link: "/#/signup",
    imageUrl:
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1",
  },
];

// NEW: A state variable to manage our filters
let currentFilters = {
  category: "All Posts",
  searchTerm: "",
};

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

export async function render() {
  // This part of the logic flow is identical to your working version.
  const pageHtml = await (
    await fetch("src/pages/BlogPage/BlogPage.html")
  ).text();
  const element = document.createElement("div");
  element.innerHTML = pageHtml;

  const navbarContainer = element.querySelector("#navbar-container");
  navbarContainer.innerHTML = await (
    await fetch("src/components/Navbar/Navbar.html")
  ).text();

  // MODIFIED: We now call a central function to do the initial render of posts.
  const postsGrid = element.querySelector("#blog-posts-grid");
  const featuredContainer = element.querySelector("#featured-post-container");

  // Renders the initial state of the blog (all posts)
  renderAllPosts(postsGrid, featuredContainer);

  // NEW: We also populate the new popular courses widget.
  const popularCoursesList = element.querySelector("#popular-courses-list");
  popularCoursesList.innerHTML = popularCourses
    .map(createPopularCourseHtml)
    .join("");

  return element;
}

export function init() {
  if (typeof anime === "undefined")
    return console.error("Anime.js not loaded!");

  initNavbar();
  initHeaderAnimation();
  initScrollAnimations();
  // NEW: We initialize the new interactive widgets.
  initFiltering();
  initSearch();
  initNewsletterForm();
}

// ===================================================================================
//  MODIFIED & NEW LOGIC
// ===================================================================================

/**
 * NEW: A central function to filter and render posts based on the current state.
 */
function renderFilteredPosts() {
  const postsGrid = document.querySelector("#blog-posts-grid");
  if (!postsGrid) return;

  // 1. Start with all non-featured posts.
  let filteredPosts = allBlogPosts.filter((post) => !post.isFeatured);

  // 2. Apply the category filter.
  if (currentFilters.category !== "All Posts") {
    filteredPosts = filteredPosts.filter(
      (post) => post.category === currentFilters.category
    );
  }

  // 3. Apply the search term filter.
  if (currentFilters.searchTerm) {
    const searchTermLower = currentFilters.searchTerm.toLowerCase();
    filteredPosts = filteredPosts.filter((post) =>
      post.title.toLowerCase().includes(searchTermLower)
    );
  }

  // 4. Render the results.
  if (filteredPosts.length > 0) {
    postsGrid.innerHTML = filteredPosts.map(createBlogPostCardHtml).join("");
  } else {
    postsGrid.innerHTML = `<p>No posts found matching your criteria.</p>`;
  }

  // 5. Re-run scroll animations for the new items.
  initScrollAnimations();
}

/**
 * MODIFIED: This function now only handles the initial render.
 */
function renderAllPosts(postsGrid, featuredContainer) {
  const standardPosts = allBlogPosts.filter((post) => !post.isFeatured);
  postsGrid.innerHTML = standardPosts
    .map((post) => createBlogPostCardHtml(post))
    .join("");

  const featuredPost = allBlogPosts.find((post) => post.isFeatured);
  if (featuredPost) {
    // MODIFIED: We now use the standard blog card for the featured post for consistency.
    featuredContainer.innerHTML = createBlogPostCardHtml(featuredPost);
  }
}

/**
 * NEW: Initializes the category filtering functionality.
 */
function initFiltering() {
  const categoryList = document.getElementById("category-list");
  if (!categoryList) return;

  categoryList.addEventListener("click", (e) => {
    e.preventDefault();
    const target = e.target.closest("a");
    if (target && target.dataset.category) {
      currentFilters.category = target.dataset.category;
      renderFilteredPosts();

      // Update active class
      categoryList
        .querySelectorAll("a")
        .forEach((a) => a.classList.remove("active"));
      target.classList.add("active");
    }
  });
}

/**
 * NEW: Initializes the search bar functionality.
 */
function initSearch() {
  const searchInput = document.getElementById("blog-search-input");
  if (!searchInput) return;

  // We use 'keyup' to make the search feel instant.
  searchInput.addEventListener("keyup", (e) => {
    currentFilters.searchTerm = e.target.value;
    renderFilteredPosts();
  });
}

/**
 * NEW: Initializes the newsletter form.
 */
function initNewsletterForm() {
  const newsletterForm = document.getElementById("newsletter-form");
  if (!newsletterForm) return;

  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletter-email");
    alert(`Thank you for subscribing with ${emailInput.value}!`);
    emailInput.value = ""; // Clear the input
  });
}

// ===================================================================================
//  HTML TEMPLATE GENERATORS
// ===================================================================================

/**
 * MODIFIED: This function is the same as your working version.
 */
function createBlogPostCardHtml(post) {
  return `
        <a href="${post.link}" class="blog-card animate-on-scroll">
            <div class="blog-card-image-container">
                <img src="${post.imageUrl}" alt="${post.title}" class="blog-card-image" loading="lazy">
            </div>
            <div class="blog-card-content">
                <p class="blog-card-category">${post.category}</p>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-date">${post.date}</p>
            </div>
        </a>
    `;
}

/**
 * NEW: A template function for the popular courses in the sidebar.
 */
function createPopularCourseHtml(course) {
  return `
        <li class="popular-course-item">
            <a href="${course.link}">
                <img src="${course.imageUrl}" alt="${course.title}">
                <div class="popular-course-item-info">
                    <h4>${course.title}</h4>
                </div>
            </a>
        </li>
    `;
}

// ===================================================================================
//  ANIMATION FUNCTIONS (Same as your working version)
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
          const delay = (entry.target.dataset.delay || 0) * 100;
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  animatedElements.forEach((el, index) => {
    el.dataset.delay = index % 5;
    observer.observe(el);
  });
}
