// /src/pages/ProfilePage/ProfilePage.js - FINAL, DE-DUPLICATED, AND CORRECT VERSION

import { auth } from "../../services/firebase.js";

// We get our helper functions ONLY from auth.js
import { updateUserProfile } from "../../services/auth.js";

// The imports for our other services remain the same.
import { getUserProfile, updateUserProfileData } from "../../services/db.js";
import { uploadUserProfileImage } from "../../services/storageService.js";
import {
  getCountries,
  getStatesByCountry,
  getCountryByName,
} from "../../services/countries.js";

let newAvatarFile = null;

// ===================================================================================
//  CORE PAGE LOGIC
// ===================================================================================

export async function render() {
  const response = await fetch("/src/pages/ProfilePage/ProfilePage.html");
  if (!response.ok) throw new Error("Could not fetch ProfilePage.html");
  const html = await response.text();
  const element = document.createElement("div");
  element.innerHTML = html;
  return element;
}

export async function init() {
  const user = auth.currentUser;
  if (!user) return;

  const form = document.getElementById("profile-form");
  const saveBtn = document.getElementById("profile-save-btn");
  const successMessage = document.getElementById("profile-success-message");

  const firestoreProfile = await getUserProfile(user.uid);

  populateForm(user, firestoreProfile);
  initAvatarUploader(user);
  initAddressFields(firestoreProfile);
  initFormSubmission(form, saveBtn, successMessage, user);

  form.addEventListener("input", () => {
    saveBtn.disabled = false;
  });
}

// ===================================================================================
//  UI INITIALIZATION & LOGIC
// ===================================================================================

function populateForm(authUser, firestoreProfile) {
  const profile = firestoreProfile || {};

  document.getElementById("profile-first-name").value = profile.firstName || "";
  document.getElementById("profile-last-name").value = profile.lastName || "";
  document.getElementById("profile-display-name").value =
    authUser.displayName || "";
  document.getElementById("profile-email").value = authUser.email;
  document.getElementById("profile-whatsapp").value =
    profile.whatsappNumber || "";
  document.getElementById("profile-address1").value = profile.address1 || "";
  document.getElementById("profile-country").value = profile.country || "";
  document.getElementById("profile-city").value = profile.city || "";

  document.getElementById("profile-country").dispatchEvent(new Event("change"));

  setTimeout(() => {
    const stateSelect = document.getElementById("profile-state-select");
    const stateManual = document.getElementById("profile-state-manual");
    if (
      profile.state &&
      stateSelect.querySelector(`option[value="${profile.state}"]`)
    ) {
      stateSelect.value = profile.state;
    } else if (profile.state) {
      document.getElementById("toggle-manual-state").click();
      stateManual.value = profile.state;
    }
  }, 100);
}

function initAvatarUploader(user) {
  const preview = document.getElementById("profile-avatar-preview");
  const uploadBtn = document.getElementById("avatar-upload-btn");
  const fileInput = document.getElementById("avatar-upload-input");
  if (!preview || !uploadBtn || !fileInput) return;

  if (user.photoURL) {
    preview.innerHTML = `<img src="${user.photoURL}" alt="Profile Avatar">`;
  } else {
    const initials = (user.displayName || user.email || "NS")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
    preview.textContent = initials;
  }

  uploadBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      newAvatarFile = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.innerHTML = `<img src="${event.target.result}" alt="New Profile Avatar Preview">`;
      };
      reader.readAsDataURL(file);
      document.getElementById("profile-save-btn").disabled = false;
    }
  });
}

function initAddressFields(firestoreProfile) {
  const countrySelect = document.getElementById("profile-country");
  const stateSelect = document.getElementById("profile-state-select");
  const stateManual = document.getElementById("profile-state-manual");
  const toggleLink = document.getElementById("toggle-manual-state");
  const whatsappInput = document.getElementById("profile-whatsapp");
  if (
    !countrySelect ||
    !stateSelect ||
    !stateManual ||
    !toggleLink ||
    !whatsappInput
  )
    return;

  const countries = getCountries();
  countrySelect.innerHTML += countries
    .map((c) => `<option value="${c.name}">${c.name}</option>`)
    .join("");

  // Set initial country value if it exists
  if (firestoreProfile?.country) {
    countrySelect.value = firestoreProfile.country;
  }
  // Trigger change to populate states
  countrySelect.dispatchEvent(new Event("change"));

  countrySelect.addEventListener("change", () => {
    const countryName = countrySelect.value;
    const states = getStatesByCountry(countryName);
    const country = getCountryByName(countryName);
    if (
      country &&
      (whatsappInput.value === "" || whatsappInput.value.startsWith("+"))
    ) {
      whatsappInput.value = `+${country.phone} `;
    }
    if (states.length > 0) {
      stateSelect.disabled = false;
      stateSelect.innerHTML =
        '<option value="">Select a State</option>' +
        states.map((s) => `<option value="${s}">${s}</option>`).join("");
      stateSelect.style.display = "block";
      stateManual.style.display = "none";
      toggleLink.textContent = "Enter Manually";
    } else {
      stateSelect.disabled = true;
      stateSelect.style.display = "none";
      stateManual.style.display = "block";
      toggleLink.textContent = "Select from List";
    }
  });

  toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    const isManual = stateManual.style.display === "block";
    stateManual.style.display = isManual ? "none" : "block";
    stateSelect.style.display = isManual ? "block" : "none";
    toggleLink.textContent = isManual ? "Enter Manually" : "Select from List";
  });
}

function initFormSubmission(form, saveBtn, successMessage, user) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    try {
      let newPhotoURL = user.photoURL;
      if (newAvatarFile) {
        newPhotoURL = await uploadUserProfileImage(user.uid, newAvatarFile);
      }

      const newDisplayName = document.getElementById(
        "profile-display-name"
      ).value;
      await updateUserProfile({
        displayName: newDisplayName,
        photoURL: newPhotoURL,
      });

      const stateSelect = document.getElementById("profile-state-select");
      const stateManual = document.getElementById("profile-state-manual");
      const isStateManual = stateManual.style.display === "block";

      const profileDataForFirestore = {
        firstName: document.getElementById("profile-first-name").value,
        lastName: document.getElementById("profile-last-name").value,
        whatsappNumber: document.getElementById("profile-whatsapp").value,
        address1: document.getElementById("profile-address1").value,
        country: document.getElementById("profile-country").value,
        state: isStateManual ? stateManual.value : stateSelect.value,
        city: document.getElementById("profile-city").value,
        displayName: newDisplayName,
        photoURL: newPhotoURL,
      };

      await updateUserProfileData(user.uid, profileDataForFirestore);

      successMessage.style.display = "block";
      newAvatarFile = null;
      setTimeout(() => {
        successMessage.style.display = "none";
        window.location.hash = "/dashboard"; // Refresh to show updated info
      }, 2000);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please check the console for details.");
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Changes";
    }
  });
}
