// /functions/index.js

// Import the necessary Firebase modules
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const crypto = require("crypto");

// Initialize the Firebase Admin SDK. This gives our function powerful access to our Firebase project.
admin.initializeApp();
const db = admin.firestore();

// ===================================================================================
//  PAYSTACK WEBHOOK HANDLER
// ===================================================================================
// This is an HTTP-triggered Cloud Function. It creates a unique, secure URL that only we and Paystack will know.
exports.paystackWebhook = functions.https.onRequest(async (req, res) => {
  // --- Step 1: Verify the Webhook Signature for Security ---
  // This ensures the request is genuinely from Paystack and not a malicious actor.
  // ** IMPORTANT: You must get your Test Secret Key from the Paystack Dashboard. **
  const secret = "YOUR_PAYSTACK_TEST_SECRET_KEY"; // REPLACE THIS!

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    console.error("Webhook Error: Invalid signature");
    res.status(401).send("Invalid signature");
    return;
  }

  // --- Step 2: Check the Event Type ---
  // We only care about successful charges.
  if (req.body.event !== "charge.success") {
    console.log(`Ignoring event: ${req.body.event}`);
    res.status(200).send("Event ignored");
    return;
  }

  // --- Step 3: Extract the Data ---
  // Get the important data from the webhook payload sent by Paystack.
  const { user_id, course_id, course_title } = req.body.data.metadata;
  const paymentReference = req.body.data.reference;

  console.log(
    `Processing successful payment for user ${user_id} on course ${course_id}`
  );

  // --- Step 4: Create the Enrollment in Firestore ---
  // This is the core logic. We create the official enrollment document.
  try {
    const enrollmentId = `${user_id}_${course_id}`;
    const enrollmentRef = db.collection("enrollments").doc(enrollmentId);

    await enrollmentRef.set({
      userId: user_id,
      courseId: course_id,
      courseTitle: course_title, // Storing the title for convenience
      enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
      paymentProvider: "paystack",
      paymentReference: paymentReference,
      progressPercentage: 0, // Initialize progress
    });

    console.log(`Successfully created enrollment: ${enrollmentId}`);
    // Respond to Paystack with a success message.
    res.status(200).send("Enrollment created successfully.");
  } catch (error) {
    console.error("Error creating enrollment in Firestore:", error);
    // Let Paystack know something went wrong on our end.
    res.status(500).send("Internal server error.");
  }
});
