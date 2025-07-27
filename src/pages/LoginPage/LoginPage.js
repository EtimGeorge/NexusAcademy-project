// /src/pages/LoginPage/LoginPage.js - FINAL ROBUST VERSION

import { loginWithEmail, loginWithGoogle } from "../../services/auth.js";

// The render function is now very simple. It just creates a container for us to work with.
export function render() {
  const pageContainer = document.createElement("div");
  pageContainer.id = "login-page-container";
  return pageContainer;
}

// The init function is now async and handles everything: fetching, rendering, and attaching listeners.
export async function init() {
  const pageContainer = document.getElementById("login-page-container");
  if (!pageContainer) return;

  try {
    // --- Step 1: Fetch the HTML for the page ---
    const response = await fetch("src/pages/LoginPage/LoginPage.html");
    if (!response.ok) throw new Error("Could not fetch LoginPage.html");
    const html = await response.text();

    // --- Step 2: Inject the HTML into our container ---
    pageContainer.innerHTML = html;

    // --- Step 3: Now that the HTML exists, find the elements and attach listeners ---
    const loginForm = document.getElementById("login-form");
    const googleLoginBtn = document.getElementById("google-login-btn");

    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        try {
          await loginWithEmail(email, password);
        } catch (error) {
          showError(getFriendlyErrorMessage(error.code));
        }
      });
    }

    if (googleLoginBtn) {
      googleLoginBtn.addEventListener("click", async () => {
        try {
          await loginWithGoogle();
        } catch (error) {
          showError(getFriendlyErrorMessage(error.code));
        }
      });
    }
  } catch (error) {
    console.error("Failed to initialize LoginPage:", error);
    pageContainer.innerHTML = "<h2>Error: Could not load the login page.</h2>";
  }
}

// --- Helper functions remain the same ---

function showError(message) {
  const errorMessageDiv = document.getElementById("error-message");
  if (errorMessageDiv) {
    errorMessageDiv.textContent = message; // Corrected typo from previous version
    errorMessageDiv.style.display = "block";
  }
}

function getFriendlyErrorMessage(errorCode) {
  console.log("Firebase Auth Error Code:", errorCode);
  switch (errorCode) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
      return "Invalid email or password. Please check your credentials and try again.";
    case "auth/too-many-requests":
      return "Access to this account has been temporarily disabled due to many failed login attempts. Please reset your password or try again later.";
    default:
      console.error("Unhandled Auth Error Code:", errorCode);
      return "An unexpected error occurred. Please try again later.";
  }
}
