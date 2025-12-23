const functions = require('firebase-functions');
const { db } = require('../utils/admin');

// Make sure stripe key is set in functions config:
// firebase functions:config:set stripe.secret="sk_test_xxx"
const stripeSecret = functions.config().stripe?.secret;
const stripe = require('stripe')(stripeSecret);

exports.createEscrow = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated','Sign in required');
  const uid = context.auth.uid;
  const { jobId, amount, payment_method_id } = data;
  if (!jobId || !amount) throw new functions.https.HttpsError('invalid-argument','Missing fields');
  // validate job and that uid is job owner, etc.
  // Create PaymentIntent with capture_method manual or automatic per flow
  const pi = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: 'inr',
    payment_method: payment_method_id,
    confirm: true,
    capture_method: 'manual', // hold funds
    metadata: { jobId }
  });

  // create project doc linking payment intent
  const projectRef = db.collection('projects').doc();
  await projectRef.set({
    id: projectRef.id,
    jobId,
    clientId: uid,
    escrow: { paymentIntentId: pi.id, amount },
    status: 'funded',
    createdAt: new Date()
  });

  return { success: true, projectId: projectRef.id, paymentIntentId: pi.id };
});
