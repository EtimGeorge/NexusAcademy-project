// /src/pages/HomePage/HomePage.js

// We import the initNavbar function from our reusable Navbar component.
import { initNavbar } from "../../components/Navbar/Navbar.js";

// ===================================================================================
//  CONTENT AREA
//  All text and image data is stored here. To change a course title or testimonial,
//  you only need to edit it in this section.
// ===================================================================================

const featuredCourses = [
  {
    title: "AI for Content & Marketing",
    description:
      "Learn to generate viral content ideas, write compelling copy, and create stunning visuals with AI.",
    price: "Starts at $299",
    flexibility: "Self-Paced",
    imageUrl:
      "https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    link: "#/signup",
  },
  {
    title: "AI for Business & Productivity",
    description:
      "Automate tedious tasks, analyze data for key insights, and build custom AI agents to streamline your workflows.",
    price: "Starts at $399",
    flexibility: "Self-Paced",
    imageUrl:
      "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    link: "#/signup",
  },
  {
    title: "The Agentic Architect Program",
    description:
      "Go beyond using tools. Learn to architect and build your own multi-step AI agents using APIs and vector databases.",
    price: "Starts at $999",
    flexibility: "Cohort-Based",
    imageUrl:
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    link: "#/signup",
  },
];

const whyNexusFeatures = [
  {
    title: "24/7 Personalized Support",
    description:
      "No human teacher can offer this. Our AI Tutor provides instant, context-aware answers whenever you're stuck.",
  },
  {
    title: "Learn by Doing",
    description:
      "The interactive exercises on WhatsApp and the AI Playground on the site make the learning active, not passive.",
  },
  {
    title: "Blended Learning",
    description:
      "You combine the best of self-paced online courses with the feel of a live, interactive bootcamp.",
  },
];

const testimonials = [
  {
    name: "Aisha (The Creator)",
    role: "Social Media Manager",
    quote:
      "Nexus Academy completely changed my workflow. I'm creating higher quality content in half the time. The AI tutor is a game-changer!",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "David (The Upskiller)",
    role: "Marketing Professional",
    quote:
      "I was able to build an automation agent that saves my team 10 hours a week. This course paid for itself in the first month. Incredible ROI.",
    image:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  {
    name: "Sam (The Builder)",
    role: "Developer",
    quote:
      "I finally understand how to think about and build with LLMs. The Agentic Architect program was exactly the deep-dive I needed.",
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
];

const blogPosts = [
  {
    category: "Tool Spotlight",
    title: "Kling vs Runway: Which AI Video Tool is Right for You?",
    date: "July 22, 2024",
    link: "#",
  },
  {
    category: "Workflow Wednesday",
    title: "How to Build a Custom GPT to Analyze Customer Feedback",
    date: "July 17, 2024",
    link: "#",
  },
  {
    category: "Future Forward",
    title: "The 'AI Skills Gap' is Here. Here's How to Get Ahead.",
    date: "July 15, 2024",
    link: "#",
  },
];

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

/**
 * Renders the entire Home Page by fetching HTML shells and populating them with dynamic data.
 * @returns {Promise<HTMLElement>} A promise that resolves with the fully constructed page element.
 */
export async function render() {
  const pageHtml = await (
    await fetch("src/pages/HomePage/HomePage.html")
  ).text();
  const element = document.createElement("div");
  element.innerHTML = pageHtml;

  // Fetch and inject the Navbar HTML into its container
  const navbarContainer = element.querySelector("#navbar-container");
  navbarContainer.innerHTML = await (
    await fetch("src/components/Navbar/Navbar.html")
  ).text();

  // Inject the dynamically generated content into the correct containers
  element.querySelector(".courses-grid").innerHTML = featuredCourses
    .map(createCourseCardHtml)
    .join("");
  element.querySelector(".features-grid").innerHTML = whyNexusFeatures
    .map(createFeatureCardHtml)
    .join("");
  element.querySelector(".testimonials-grid").innerHTML = testimonials
    .map(createTestimonialCardHtml)
    .join("");
  element.querySelector(".blog-grid").innerHTML = blogPosts
    .map(createBlogPostCardHtml)
    .join("");

  return element;
}

/**
 * Initializes all client-side interactivity for the Home Page after it has been rendered.
 */
export function init() {
  // Check if the anime library is available before trying to use it.
  if (typeof anime === "undefined") {
    console.error("Anime.js animation library is not loaded!");
    return;
  }
  // Make the navbar interactive (e.g., hamburger menu).
  initNavbar();
  // Start the animation sequences.
  initHeroAnimation();
  initScrollAnimations();
}

// ===================================================================================
//  HTML TEMPLATE GENERATORS
//  These functions take a data object and return an HTML string.
// ===================================================================================

function createCourseCardHtml(course) {
  return `
        <div class="course-card animate-on-scroll">
            <div class="course-card-image-container">
                <img src="${course.imageUrl}" alt="${course.title}" class="course-card-image" loading="lazy">
            </div>
            <div class="course-card-content">
                <h3 class="course-card-title">${course.title}</h3>
                <p class="course-card-description">${course.description}</p>
                <div class="course-card-details">
                    <p>${course.price}</p>
                    <span>${course.flexibility}</span>
                </div>
                <a href="${course.link}" class="btn btn-primary">Learn More</a>
            </div>
        </div>
    `;
}

function createFeatureCardHtml(feature) {
  return `<div class="feature-card animate-on-scroll"><h3>${feature.title}</h3><p>${feature.description}</p></div>`;
}

function createTestimonialCardHtml(testimonial) {
  return `
        <div class="testimonial-card animate-on-scroll">
            <p class="testimonial-quote">"${testimonial.quote}"</p>
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.name}" class="author-image">
                <div>
                    <p class="author-name">${testimonial.name}</p>
                    <p class="author-title">${testimonial.role}</p>
                </div>
            </div>
        </div>
    `;
}

function createBlogPostCardHtml(post) {
  return `
        <a href="${post.link}" class="blog-post-card animate-on-scroll">
            <div class="blog-post-card-content">
                <p class="blog-post-card-category">${post.category}</p>
                <h3 class="blog-post-card-title">${post.title}</h3>
                <p class="blog-post-card-date">${post.date}</p>
            </div>
        </a>
    `;
}

// ===================================================================================
//  ANIMATION FUNCTIONS
// ===================================================================================

/**
 * Uses Anime.js timeline and staggering for a sophisticated hero animation.
 */
function initHeroAnimation() {
  anime({
    targets: ".animate-hero",
    translateY: [20, 0], // Animate from 20px below to its final position
    opacity: [0, 1], // Fade in
    delay: anime.stagger(150, { start: 300 }), // Stagger each element's start time by 150ms
    duration: 800,
    easing: "easeOutExpo", // A smooth easing function
  });
}

/**
 * Uses Intersection Observer to efficiently trigger animations on scroll.
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  // The observer calls a function whenever a target element enters or leaves the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // If the element is intersecting (i.e., on screen)
        if (entry.isIntersecting) {
          // Add the 'is-visible' class, which our CSS uses to trigger the animation.
          entry.target.classList.add("is-visible");
          // Stop observing the element once it has been animated to save resources.
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // Trigger the animation when 10% of the element is visible.
    }
  );

  // Tell the observer to watch each of our designated elements.
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
}
