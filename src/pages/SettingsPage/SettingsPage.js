// /src/pages/SettingsPage/SettingsPage.js - COMPREHENSIVE VERSION

import { auth } from "../../services/firebase.js";
// We will add these functions to auth.js in the next step
import {
  reauthenticateUser,
  updateUserPassword,
  deleteUserAccount,
} from "../../services/auth.js";

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
  initDangerZone();
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
 * Handles the logic for the "Danger Zone" functionalities.
 */
function initDangerZone() {
  const deleteBtn = document.getElementById("delete-account-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", async () => {
      // This is a destructive action, so we use multiple confirmation steps.
      const confirmation1 = prompt(
        "This action is irreversible. To confirm, please type 'DELETE' in the box below."
      );
      if (confirmation1 !== "DELETE") {
        alert("Deletion cancelled.");
        return;
      }

      const currentPassword = prompt(
        "For your security, please enter your current password to confirm account deletion."
      );
      if (!currentPassword) {
        alert("Password not provided. Deletion cancelled.");
        return;
      }

      try {
        // First, re-authenticate the user to ensure they are the legitimate owner.
        await reauthenticateUser(currentPassword);
        // If successful, proceed with deletion.
        await deleteUserAccount();

        alert(
          "Your account has been successfully deleted. You will now be logged out."
        );
        window.location.hash = "/login"; // Redirect to login page
      } catch (error) {
        console.error("Account deletion failed:", error);
        if (error.code === "auth/wrong-password") {
          alert("Incorrect password. Account deletion cancelled.");
        } else {
          alert("An error occurred while trying to delete your account.");
        }
      }
    });
  }
}
