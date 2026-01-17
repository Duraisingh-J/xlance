// functions/utils/admin.js
const admin = require('firebase-admin');

if (!admin.apps.length) {
  // In production (Cloud Functions) this uses the built-in service account.
  // For local dev using service account JSON, set env GOOGLE_APPLICATION_CREDENTIALS
  admin.initializeApp({
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || undefined,
    // credential: admin.credential.applicationDefault() -> chosen automatically
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
