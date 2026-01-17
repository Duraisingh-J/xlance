const functions = require('firebase-functions');
const { db } = require('../utils/admin');

exports.createJob = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated','Sign in required');
  const uid = context.auth.uid;

  const { title, description, skills = [], budget = null } = data;
  if (!title || !description) throw new functions.https.HttpsError('invalid-argument','Missing fields');

  // ensure user is client
  const userDoc = await db.collection('users').doc(uid).get();
  if (!userDoc.exists) throw new functions.https.HttpsError('failed-precondition','Profile not found');
  const roles = userDoc.data().roles || [];
  if (!roles.includes('client')) throw new functions.https.HttpsError('permission-denied','Only clients can post');

  const jobRef = db.collection('jobs').doc();
  const payload = {
    id: jobRef.id,
    clientId: uid,
    title,
    description,
    skills,
    budget,
    status: 'open',
    createdAt: new Date()
  };
  await jobRef.set(payload);
  return { success: true, jobId: jobRef.id };
});
