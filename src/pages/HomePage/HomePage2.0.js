// /src/pages/HomePage/HomePage.js - NEXUS 2.0 VERSION

// The render function fetches our new, more complex HTML.
export async function render() {
  try {
    const response = await fetch("src/pages/HomePage/HomePage.html");
    if (!response.ok) throw new Error("Could not fetch HomePage.html");
    const html = await response.text();
    const element = document.createElement("div");
    element.innerHTML = html;
    return element;
  } catch (error) {
    console.error("Error rendering HomePage:", error);
    return document.createElement("div");
  }
}

// The new init() function will orchestrate our animations.
export function init() {
  // Check if the anime library is available
  if (typeof anime === "undefined") {
    console.error("Anime.js not loaded!");
    return;
  }

  // 1. Animate the hero section elements on page load
  initHeroAnimation();

  // 2. Set up animations that trigger as the user scrolls down the page
  initScrollAnimations();
}

/**
 * Creates the initial "fade in and up" animation for the hero section.
 */
function initHeroAnimation() {
  // Using a timeline allows us to sequence animations easily.
  const tl = anime.timeline({
    easing: "easeOutExpo",
  });

  tl.add({
    targets: ".hero-title",
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 800,
  })
    .add(
      {
        targets: ".hero-subtitle",
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
      },
      "-=400"
    ) // Starts 400ms before the previous animation ends
    .add(
      {
        targets: ".hero .btn",
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 500,
      },
      "-=300"
    ); // Starts 300ms before the previous animation ends
}

/**
 * Uses the Intersection Observer API to trigger animations when elements scroll into view.
 * This is much more efficient than listening to every scroll event.
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // If the element is on screen
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Optional: stop observing the element once it's visible
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of the element is visible
    }
  );

  animatedElements.forEach((el) => {
    observer.observe(el);
  });
}
