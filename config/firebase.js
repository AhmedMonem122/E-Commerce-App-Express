const admin = require("firebase-admin");
const firebaseAdminConfig = require("./firebaseConfig");

// Check if the default app is already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
} else {
  admin.app(); // Reuse the default app
}

module.exports = admin; // Export the initialized app
