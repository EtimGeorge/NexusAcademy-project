// /src/app.js - FINAL VERSION WITH BLOG POST ROUTING

import { onAuthStateChanged } from "./services/auth.js";

// ===================================================================================
//  MASTER ROUTE DEFINITIONS
//  This object maps URL paths to the TOP-LEVEL component that should handle them.
// ===================================================================================
const routes = {
  // Public Pages
  "/": { module: "./pages/HomePage/HomePage.js", access: "public" },
  "/login": { module: "./pages/LoginPage/LoginPage.js", access: "public" },
  "/signup": { module: "./pages/SignupPage/SignupPage.js", access: "public" },
  "/blog": { module: "./pages/BlogPage/BlogPage.js", access: "public" },
  "/courses": {
    module: "./pages/CoursesPage/CoursesPage.js",
    access: "public",
  },
  "/why-nexus": {
    module: "./pages/WhyNexusPage/WhyNexusPage.js",
    access: "public",
  },

  // --- Authenticated App Shell ---
  // *** THE CRITICAL CHANGE IS HERE ***
  // Any route that is part of the logged-in experience now points to Dashboard.js.
  // The Dashboard.js component itself will handle the sub-routes.
  "/dashboard": { module: "./pages/Dashboard/Dashboard.js", access: "private" },
  "/profile": { module: "./pages/Dashboard/Dashboard.js", access: "private" },
  "/settings": { module: "./pages/Dashboard/Dashboard.js", access: "private" },
};

// --- ELEMENT REFERENCES ---
const rootElement = document.getElementById("root");
const pageLoader = document.getElementById("page-loader");
let currentUser = null;

// --- LOADER CONTROL FUNCTIONS ---
const showLoader = () => {
  if (pageLoader) pageLoader.classList.remove("hidden");
};
const hideLoader = () => {
  if (pageLoader) pageLoader.classList.add("hidden");
};

// --- ROUTER LOGIC ---
const router = async () => {
  showLoader();

  // The path is read with its original casing, which is important for case-sensitive IDs.
  const path = window.location.hash.slice(1) || "/";

  // --- REDIRECT LOGIC ---
  if (currentUser && (path === "/login" || path === "/signup")) {
    window.location.hash = "/dashboard";
    return;
  }

  // --- DYNAMIC ROUTE MATCHING ---
  let matchedRoute = routes[path];
  let dynamicParams = null;

  if (!matchedRoute) {
    if (path.startsWith("/course/")) {
      const pathParts = path.split("/");
      if (pathParts.length === 3) {
        dynamicParams = { id: pathParts[2] }; // e.g., from /#/course/some-id
        matchedRoute = {
          module: "./pages/CoursePlayer/CoursePlayer.js",
          access: "private",
        };
      }
    }
    // *** THE ONLY CHANGE IS THIS NEW 'ELSE IF' BLOCK ***
    // It checks for the blog post URL pattern.
    else if (path.startsWith("/blog/")) {
      const pathParts = path.split("/");
      if (pathParts.length === 3) {
        dynamicParams = { id: pathParts[2] }; // e.g., from /#/blog/post-1
        matchedRoute = {
          module: "./pages/SinglePostPage/SinglePostPage.js",
          access: "public",
        };
      }
    }
  }

  // --- ACCESS CONTROL & MODULE LOADING ---
  if (!matchedRoute) {
    rootElement.innerHTML = "<h1>404 - Not Found</h1>";
    hideLoader();
    return;
  }

  if (matchedRoute.access === "private" && !currentUser) {
    window.location.hash = "/login";
    return;
  }

  try {
    const pageModule = await import(matchedRoute.module);
    rootElement.innerHTML = "";
    const pageElement = await pageModule.render(dynamicParams);
    rootElement.appendChild(pageElement);
    if (pageModule.init) {
      await pageModule.init(dynamicParams);
    }
  } catch (error) {
    console.error(`Failed to load page for path: ${path}`, error);
    rootElement.innerHTML = "<h1>Error: Page could not be loaded.</h1>";
  } finally {
    hideLoader();
  }
};

// --- APPLICATION INITIALIZATION ---
onAuthStateChanged((user) => {
  if (user) {
    console.log("CURRENTLY LOGGED IN USER UID:", user.uid);
  }

  currentUser = user;
  router();
});

window.addEventListener("hashchange", router);
