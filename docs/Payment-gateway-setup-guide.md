# Nexus Academy: Payment Gateway Setup Guide

## Introduction

This guide provides a complete, step-by-step walkthrough for integrating the Paystack payment gateway with the Nexus Academy web application. The process uses Firebase Cloud Functions to create a secure backend webhook, which is the industry-standard method for verifying payments and preventing fraud.

This ensures that course enrollments are only created in our database after a payment has been successfully and securely confirmed by Paystack's servers.

---

### **Prerequisites**

Before you begin, ensure you have the following:

1.  **Firebase Account:** With your `nexus-academy` project created.
2.  **Paystack Account:** A registered account on [Paystack](https://paystack.com/).
3.  **Node.js & npm:** Installed on your local machine. You can get it from [nodejs.org](https://nodejs.org/).
4.  **Firebase Tools CLI:** The command-line interface for Firebase.

---

## Part 1: Firebase Project Setup

### Step 1.1: Enable Billing (The Blaze Plan)

Firebase Cloud Functions require your project to be on the "Blaze (Pay as you go)" plan. This plan has a generous free tier, and for our current scale, all usage will almost certainly be free.

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your `nexus-academy` project.
3.  In the bottom-left corner, click the **"Upgrade"** button next to the Spark Plan icon.
4.  Select the **"Blaze"** plan and follow the prompts to associate a billing account.

### Step 1.2: Install Firebase Tools CLI

If you haven't already, install the global command-line tools for Firebase.

*   Open your computer's main terminal (not in VS Code) and run:
    ```bash
    npm install -g firebase-tools
    ```

### Step 1.3: Initialize Firebase Functions in Your Project

1.  Open a new terminal **inside your `nexus-academy` project folder** in VS Code.
2.  Log into your Firebase account from the command line:
    ```bash
    firebase login
    ```
3.  Initialize the Firebase features for your project:
    ```bash
    firebase init
    ```
4.  Answer the prompts exactly as follows:
    *   `Are you ready to proceed?` -> **Y**
    *   `Which Firebase features do you want to set up?` -> Navigate with arrow keys, press **Space** to select `Functions`, then press **Enter**.
    *   `Please select an option:` -> **Use an existing project**
    *   Select your `nexus-academy` project.
    *   `What language would you like to use?` -> **JavaScript**
    *   `Do you want to use ESLint...?` -> **n**
    *   `Do you want to install dependencies with npm now?` -> **y**

This will create a `functions` folder in your project, which will contain all our backend code.

---

## Part 2: Paystack Account Setup

1.  Go to your [Paystack Dashboard](https://dashboard.paystack.com/).
2.  Ensure the toggle at the top of the page is set to **"Test Mode"**.
3.  In the left sidebar, navigate to **Settings > API Keys & Webhooks**.
4.  Locate your **Test Keys**:
    *   **Test Public Key** (starts with `pk_test_...`)
    *   **Test Secret Key** (starts with `sk_test_...`)
5.  Copy both keys into a secure temporary location.

---

## Part 3: Client-Side Integration (Frontend)

### Step 3.1: Add Paystack Script to `index.html`

Add the official Paystack inline script to your main HTML file to enable the checkout popup.

*   **File:** `index.html`
*   **Location:** Inside the `<head>` section.
    ```html
    <script src="https://js.paystack.co/v1/inline.js"></script>
    ```

### Step 3.2: Implement the Checkout Trigger

Update your `CourseDetailPage.js` to open the Paystack checkout when the "Enroll Now" button is clicked.

*   **File:** `/src/pages/CourseDetailPage/CourseDetailPage.js`
*   **Action:** Replace the `initEnrollButton` function with the following:
    ```javascript
    // Make sure to import auth at the top of the file:
    // import { auth } from '../../services/firebase.js';

    function initEnrollButton(course) {
        const enrollBtn = document.getElementById('enroll-btn');
        if (!enrollBtn) return;

        enrollBtn.addEventListener('click', () => {
            const user = auth.currentUser;
            if (!user) {
                alert("Please create an account or sign in to enroll.");
                window.location.hash = '/signup';
                return;
            }

            const paystack = new PaystackPop();
            paystack.newTransaction({
                key: 'YOUR_TEST_PUBLIC_KEY', // <-- REPLACE THIS
                email: user.email,
                amount: course.price * 100, // In kobo/cents
                currency: 'NGN',
                ref: `NEXUS-${course.id}-${Date.now()}`,
                metadata: {
                    user_id: user.uid,
                    course_id: course.id,
                    course_title: course.title
                },
                onSuccess: (transaction) => {
                    alert('Payment successful! Your enrollment is being processed.');
                    window.location.hash = '/dashboard';
                },
                onCancel: () => {
                    alert('Payment was cancelled.');
                }
            });
        });
    }
    ```

---

## Part 4: Building the Secure Backend

### Step 4.1: The Webhook Code

This is the secure backend function that will create the enrollment.

*   **File:** `/functions/index.js`
*   **Action:** Replace the entire content of this file.
    ```javascript
    const functions = require("firebase-functions");
    const admin = require("firebase-admin");
    const crypto = require("crypto");

    admin.initializeApp();
    const db = admin.firestore();

    exports.paystackWebhook = functions.https.onRequest(async (req, res) => {
      // Securely read the secret key from the environment
      const secret = functions.config().paystack.secret;

      const hash = crypto.createHmac("sha512", secret)
          .update(JSON.stringify(req.body))
          .digest("hex");

      if (hash !== req.headers["x-paystack-signature"]) {
        console.error("Webhook Error: Invalid signature");
        return res.status(401).send("Invalid signature");
      }

      if (req.body.event !== "charge.success") {
        return res.status(200).send("Event ignored");
      }

      const { user_id, course_id, course_title } = req.body.data.metadata;
      const paymentReference = req.body.data.reference;

      try {
        const enrollmentId = `${user_id}_${course_id}`;
        const enrollmentRef = db.collection("enrollments").doc(enrollmentId);

        await enrollmentRef.set({
          userId: user_id,
          courseId: course_id,
          courseTitle: course_title,
          enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
          paymentProvider: "paystack",
          paymentReference: paymentReference,
          progressPercentage: 0,
        });
        
        return res.status(200).send("Enrollment created successfully.");
      } catch (error) {
        console.error("Error creating enrollment:", error);
        return res.status(500).send("Internal server error.");
      }
    });
    ```

### Step 4.2: Securely Configure the Secret Key

**Never** save your secret key in the code.

1.  Open a terminal inside your `nexus-academy` project folder.
2.  Run the following command, replacing the placeholder with your **Test Secret Key**:
    ```bash
    firebase functions:config:set paystack.secret="sk_test_..."
    ```

### Step 4.3: Deploy the Function

1.  In the same terminal, run the deploy command:
    ```bash
    firebase deploy --only functions
    ```
2.  Wait for the deployment to finish. At the end, it will give you a **Function URL**. Copy this URL.

---

## Part 5: Final Connection

1.  Go back to your Paystack Dashboard **Settings > API Keys & Webhooks**.
2.  Scroll down to the **Webhook URL** section.
3.  In the **Test Webhook URL** field, paste the **Function URL** you copied from the deployment step.
4.  Click **"Save Changes"**.

---

## Part 6: Testing the Full Flow

1.  Navigate to a course detail page on your running application.
2.  Click the "Enroll Now" button.
3.  The Paystack checkout will appear. Use one of Paystack's [official test cards](https://paystack.com/docs/payments/test-payments/) to simulate a payment.
4.  Click "Pay". You should see a success message from Paystack.
5.  Click "Done". You will see our application's "Payment successful!" alert and be redirected to the dashboard.
6.  Go to your **Firestore Database** in the Firebase Console.
7.  Look at the `enrollments` collection. A **new document** should have appeared with the correct `userId` and `courseId`.

Congratulations, you have successfully and securely integrated the payment gateway.