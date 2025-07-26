// /src/pages/SinglePostPage/SinglePostPage.js - CORRECTED DATA SOURCE

import { initNavbar } from "../../components/Navbar/Navbar.js";
// *** THE PRIMARY FIX IS HERE ***
// We are now importing the complete and correct list of posts from our single source of truth.
// The old, incomplete, hardcoded 'allBlogPosts' array has been deleted.
import { allBlogPosts } from "../../services/mockData.js";

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

export async function render(params) {
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

  // Now, this 'find' operation will search the COMPLETE list of posts from mockData.js.
  const post = allBlogPosts.find((p) => p.id === postId);

  if (!post) {
    // This error will no longer occur for valid post IDs.
    contentContainer.innerHTML = `<h2>Error: Post not found.</h2>`;
    return;
  }

  // Render the full post content using the found post.
  contentContainer.innerHTML = createPostHtml(post);
  initNavbar();
  initShareButtons();
}

// ===================================================================================
//  HTML TEMPLATE GENERATOR & INTERACTIVITY (No changes from here down)
// ===================================================================================

function createPostHtml(post) {
  const postUrl = window.location.href;
  const shareText = `Check out this article from Nexus Academy: ${post.title}`;

  return `
        <header class="post-header">
            <p class="post-category">${post.category}</p>
            <h1 class="post-title">${post.title}</h1>
            <div class="post-meta">
                <span>Published on ${post.date}</span>
            </div>
        </header>
        <div class="feature-image-container">
            <img src="${post.imageUrl}" alt="${
    post.title
  }" class="feature-image">
        </div>
        <div class="post-body">
            ${post.content}
        </div>
        <div class="share-widget">
            <h4 class="share-widget-title">Share this article:</h4>
            <div class="share-buttons">
                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  postUrl
                )}&text=${encodeURIComponent(
    shareText
  )}" target="_blank" rel="noopener noreferrer" aria-label="Share on X"><svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
                <button id="copy-link-btn" aria-label="Copy link"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
            </div>
        </div>
    `;
}

function initShareButtons() {
  const copyBtn = document.getElementById("copy-link-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          copyBtn.innerHTML =
            '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
          setTimeout(() => {
            copyBtn.innerHTML =
              '<svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';
          }, 2000);
        })
        .catch((err) => console.error("Failed to copy link: ", err));
    });
  }
}
