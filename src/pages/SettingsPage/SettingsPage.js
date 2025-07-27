// /src/pages/SettingsPage/SettingsPage.js - COMPREHENSIVE VERSION

import { auth } from "../../services/firebase.js";
// We will add these functions to auth.js in the next step
import {
  reauthenticateUser,
  updateUserPassword,
  deleteUserAccount,
} from "../../services/auth.js";

import { deleteUserProfile } from "../../services/db.js";

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

/**
 * Renders the initial HTML shell for the settings page.
 * @returns {Promise<HTMLElement>} The fully constructed page element.
 */
export async function render() {
  const response = await fetch("/src/pages/SettingsPage/SettingsPage.html");
  if (!response.ok) throw new Error("Could not fetch SettingsPage.html");
  const html = await response.text();
  const element = document.createElement("div");
  element.innerHTML = html;
  return element;
}

/**
 * Initializes all functionality for the settings page after it's rendered.
 */
export function init() {
  const user = auth.currentUser;
  if (!user) return;

  // Initialize each interactive widget on the page
  initChangePasswordForm();
  initPaymentManagement();
  initPreferences();
  initDangerZone(user);
}

// ===================================================================================
//  WIDGET INITIALIZATION FUNCTIONS
// ===================================================================================

/**
 * Handles the logic for the "Change Password" form.
 */
function initChangePasswordForm() {
  const form = document.getElementById("change-password-form");
  if (!form) return;

  // NEW: Hide the change password form entirely if the user is not a password user.
  const providerId = auth.currentUser.providerData[0].providerId;
  if (providerId !== "password") {
    form.innerHTML =
      "<p>Password management is not available for accounts created with Google.</p>";
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currentPassword = form["current-password"].value;
    const newPassword = form["new-password"].value;
    const confirmPassword = form["confirm-new-password"].value;

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    try {
      // For security, Firebase requires the user to re-authenticate before changing a password.
      await reauthenticateUser(currentPassword);
      // If re-authentication is successful, we can update the password.
      await updateUserPassword(newPassword);

      alert("Password updated successfully!");
      form.reset(); // Clear the form fields
    } catch (error) {
      console.error("Password change failed:", error);
      if (error.code === "auth/wrong-password") {
        alert("The current password you entered is incorrect.");
      } else {
        alert("Failed to update password. Please try again.");
      }
    }
  });
}

/**
 * Handles logic for the "Payment Methods" card.
 */
function initPaymentManagement() {
  const manageBillingBtn = document.getElementById("manage-billing-btn");
  if (manageBillingBtn) {
    manageBillingBtn.addEventListener("click", () => {
      // In a real application, this would redirect to the user's
      // secure billing portal hosted by Paystack/Stripe.
      alert("Redirecting to our secure payment portal...");
      // window.location.href = 'https://billing.paystack.com/...'; // Example
    });
  }
}

/**
 * Handles logic for the "Preferences" card.
 */
function initPreferences() {
  const currencySelect = document.getElementById("currency-select");
  if (currencySelect) {
    currencySelect.addEventListener("change", (e) => {
      const newCurrency = e.target.value;
      // In a real app, we would save this preference to the user's profile in Firestore
      // and update a global state to change prices on other pages.
      console.log(`User currency preference changed to: ${newCurrency}`);
      alert(`Currency preference set to ${newCurrency}.`);
    });
  }
}

/**
 * *** THIS IS THE CRITICAL UPGRADE ***
 * Handles the logic for the "Danger Zone" using a secure modal dialog.
 * @param {object} user - The current Firebase user object.
 */
function initDangerZone(user) {
  const deleteBtn = document.getElementById("delete-account-btn");
  const modal = document.getElementById("delete-account-modal");
  if (!deleteBtn || !modal) return;

  const confirmInput = document.getElementById("delete-confirm-input");
  const confirmBtn = document.getElementById("modal-confirm-btn");
  const cancelBtn = document.getElementById("modal-cancel-btn");

  // --- Step 1: Show the modal when the main "Delete Account" button is clicked ---
  deleteBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    // A small delay to allow the display change, then trigger the fade-in animation
    setTimeout(() => modal.classList.add("is-visible"), 10);
  });

  // --- Step 2: Handle the modal's internal logic ---
  const closeModal = () => {
    modal.classList.remove("is-visible");
    // Wait for the fade-out animation to finish before hiding the element
    setTimeout(() => {
      modal.style.display = "none";
      confirmInput.value = ""; // Reset the input field
      confirmBtn.disabled = true; // Reset the confirm button
    }, 300);
  };

  cancelBtn.addEventListener("click", closeModal);

  // Enable the confirm button only when the user types 'DELETE'
  confirmInput.addEventListener("input", () => {
    confirmBtn.disabled = confirmInput.value !== "DELETE";
  });

  // --- Step 3: Handle the final confirmation click ---
  confirmBtn.addEventListener("click", async () => {
    // This click is a direct user action, so the popup will not be blocked.
    try {
      const providerId = user.providerData[0].providerId;

      // Re-authenticate the user
      if (providerId === "password") {
        const currentPassword = prompt(
          "For your security, please enter your current password to confirm."
        );
        if (!currentPassword) return; // User cancelled the password prompt
        await reauthenticateUser(currentPassword);
      } else {
        await reauthenticateUser(); // This will trigger the Google popup
      }

      // --- If re-authentication is successful, proceed ---
      alert("Re-authentication successful. Deleting account data...");

      // Delete Firestore data first
      await deleteUserProfile(user.uid);

      // Delete the Auth account last
      await deleteUserAccount();

      alert("Your account has been successfully deleted.");
      window.location.hash = "/login";
    } catch (error) {
      console.error("Account deletion failed:", error);
      // Provide specific feedback to the user
      if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Account deletion cancelled.");
      } else if (
        error.code === "auth/cancelled-popup-request" ||
        error.code === "auth/popup-closed-by-user"
      ) {
        alert("Re-authentication was cancelled. Account deletion cancelled.");
      } else {
        alert("An error occurred during re-authentication. Please try again.");
      }
      closeModal(); // Close the modal on failure
    }
  });
}
