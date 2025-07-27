// /src/pages/SignupPage/SignupPage.js - FINAL ROBUST VERSION

import { signupWithEmail, loginWithGoogle } from "../../services/auth.js";
import { createUserProfile } from "../../services/db.js";

// The render function creates a container for our dynamic content.
export function render() {
  const pageContainer = document.createElement("div");
  pageContainer.id = "signup-page-container";
  return pageContainer;
}

// The init function handles everything: fetching HTML, rendering, and attaching listeners.
export async function init() {
  const pageContainer = document.getElementById("signup-page-container");
  if (!pageContainer) return;

  try {
    // Step 1: Fetch the HTML for the page.
    const response = await fetch("src/pages/SignupPage/SignupPage.html");
    if (!response.ok) throw new Error("Could not fetch SignupPage.html");
    const html = await response.text();

    // Step 2: Inject the HTML into our container.
    pageContainer.innerHTML = html;

    // Step 3: Now that HTML exists, find elements and attach listeners.
    const signupForm = document.getElementById("signup-form");
    const googleSignupBtn = document.getElementById("google-signup-btn");

    if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = signupForm.email.value;
        const password = signupForm.password.value;
        const confirmPassword = signupForm["confirm-password"].value;

        if (password !== confirmPassword) {
          showError("Passwords do not match.");
          return;
        }

        try {
          const userCredential = await signupWithEmail(email, password);
          await createUserProfile(userCredential.user);
          // Redirect is handled automatically by app.js
        } catch (error) {
          showError(getFriendlyErrorMessage(error.code));
        }
      });
    }

    if (googleSignupBtn) {
      googleSignupBtn.addEventListener("click", async () => {
        try {
          const userCredential = await loginWithGoogle();
          await createUserProfile(userCredential.user);
          // Redirect is handled automatically by app.js
        } catch (error) {
          showError(getFriendlyErrorMessage(error.code));
        }
      });
    }
  } catch (error) {
    console.error("Failed to initialize SignupPage:", error);
    pageContainer.innerHTML =
      "<h2>Error: Could not load the sign-up page.</h2>";
  }
}

// Helper function to display errors in the red banner.
function showError(message) {
  const errorMessageDiv = document.getElementById("error-message");
  if (errorMessageDiv) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = "block";
  }
}

// Helper function to provide user-friendly error messages.
function getFriendlyErrorMessage(errorCode) {
  console.log("Firebase Auth Error Code:", errorCode);
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email address is already taken. Please sign in or use a different email.";
    case "auth/weak-password":
      return "The password is too weak. It must be at least 6 characters long.";
    case "auth/popup-closed-by-user":
      return "The sign-up process was cancelled. Please try again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}
