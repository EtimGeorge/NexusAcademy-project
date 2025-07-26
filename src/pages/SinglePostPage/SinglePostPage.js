// /src/pages/SinglePostPage/SinglePostPage.js - FINAL, ROBUST, AND CORRECTED

import { initNavbar } from "../../components/Navbar/Navbar.js";
import { allBlogPosts } from "../../services/mockData.js";

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

export async function render(params) {
  // This render function correctly uses the HTML you provided as a shell.
  const pageContainer = document.createElement("div");
  const shellHtml = await (
    await fetch("/src/pages/SinglePostPage/SinglePostPage.html")
  ).text();
  pageContainer.innerHTML = shellHtml;

  const navbarContainer = pageContainer.querySelector("#navbar-container");
  navbarContainer.innerHTML = await (
    await fetch("/src/components/Navbar/Navbar.html")
  ).text();

  return pageContainer;
}

export async function init(params) {
  const postId = params?.id;
  const contentContainer = document.getElementById("post-content-container");

  if (!postId || !contentContainer) {
    contentContainer.innerHTML = `<h2>Error: Post ID not found.</h2>`;
    return;
  }

  const post = allBlogPosts.find((p) => p.id === postId);

  if (!post) {
    contentContainer.innerHTML = `<h2>Error: Post not found.</h2>`;
    return;
  }

  // --- MODIFIED LOGIC FLOW ---
  // 1. Render the static article content first.
  contentContainer.innerHTML = createPostHtml(post);

  // 2. Now that the main content is on the page, initialize all interactive parts.
  initNavbar();
  initLikeButton(); // Safely initialize the Like button
  initShareFunctionality(post); // Safely initialize the Share functionality
}

// ===================================================================================
//  INTERACTIVITY INITIALIZATION
// ===================================================================================

/**
 * Initializes the Like button functionality (Phase 1: UI only).
 * It finds the elements in the DOM and attaches listeners.
 */
function initLikeButton() {
  const likeBtn = document.getElementById("like-btn");
  const likeCountSpan = document.getElementById("like-count");

  // This check prevents crashes if the HTML is missing.
  if (!likeBtn || !likeCountSpan) return;

  let isLiked = false;
  let likeCount = Math.floor(Math.random() * 100);
  likeCountSpan.textContent = likeCount;

  likeBtn.addEventListener("click", () => {
    isLiked = !isLiked;
    likeCount = isLiked ? likeCount + 1 : likeCount - 1;
    likeBtn.classList.toggle("liked", isLiked);
    likeCountSpan.textContent = likeCount;
  });
}

/**
 * Initializes Share functionality by checking browser support and building the correct UI.
 * This function is now robust and will not crash.
 * @param {object} post - The post data object.
 */
function initShareFunctionality(post) {
  const shareWidget = document.querySelector(".share-widget");
  if (!shareWidget) return; // Safely exit if the main widget container isn't found

  const postUrl = window.location.href;
  const shareText = `Check out this article from Nexus Academy: ${post.title}`;

  // --- The Modern Way: Web Share API (for mobile) ---
  if (navigator.share) {
    // If the API is supported, create the mobile share button dynamically.
    const mobileShareButton = document.createElement("button");
    mobileShareButton.className = "btn btn-primary mobile-share-button";
    mobileShareButton.textContent = "Share";
    shareWidget.appendChild(mobileShareButton);

    mobileShareButton.addEventListener("click", async () => {
      try {
        await navigator.share({
          title: post.title,
          text: shareText,
          url: postUrl,
        });
      } catch (err) {
        console.error("Error using Web Share API:", err);
      }
    });
  }
  // --- The Fallback Way: Manual Links (for desktop) ---
  else {
    // If the API is not supported, create the desktop icons dynamically.
    const desktopShareHtml = `
            <h4 class="share-widget-title">Share:</h4>
            <div class="share-buttons">
                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  postUrl
                )}&text=${encodeURIComponent(
      shareText
    )}" target="_blank" rel="noopener noreferrer" class="share-twitter" aria-label="Share on X"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  postUrl
                )}" target="_blank" rel="noopener noreferrer" class="share-facebook" aria-label="Share on Facebook"><svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z"/></svg></a>
                <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  postUrl
                )}" target="_blank" rel="noopener noreferrer" class="share-linkedin" aria-label="Share on LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM6 9H2V21h4V9zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg></a>
                <button id="copy-link-btn" aria-label="Copy link"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
            </div>
        `;
    shareWidget.innerHTML = desktopShareHtml;

    // Now that the button exists in the DOM, we can safely attach the listener.
    const copyBtn = document.getElementById("copy-link-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(postUrl).then(() => {
          copyBtn.innerHTML =
            '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
          setTimeout(() => {
            copyBtn.innerHTML =
              '<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
          }, 2000);
        });
      });
    }
  }
}

// ===================================================================================
//  HTML TEMPLATE GENERATOR - THIS IS NOW SIMPLIFIED
// ===================================================================================

function createPostHtml(post) {
  // This function now ONLY creates the article content.
  // The interactive widgets are handled by the init functions.
  return `
        <header class="post-header">
            <p class="post-category">${post.category}</p>
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta">
                <span>Published on ${post.date}</span>
            </div>
        </header>
        <div class="feature-image-container">
            <img src="${post.imageUrl}" alt="${post.title}" class="feature-image">
        </div>
        <div class="post-body">
            ${post.content}
        </div>
    `;
}
