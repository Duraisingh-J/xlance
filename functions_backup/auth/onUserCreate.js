const functions = require('firebase-functions');
const { db } = require('../utils/admin');

exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;
  const payload = {
    uid,
    email: email || '',
    name: displayName || '',
    photoURL: photoURL || null,
    roles: [],
    onboardingCompleted: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp ? admin.firestore.FieldValue.serverTimestamp() : new Date(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp ? admin.firestore.FieldValue.serverTimestamp() : new Date()
  };

  await db.collection('users').doc(uid).set(payload, { merge: true });
  return { success: true };
});
