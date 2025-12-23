const functions = require('firebase-functions');
const { db, admin } = require('../utils/admin');

exports.onMessageWrite = functions.firestore
  .document('chats/{chatId}/messages/{msgId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const chatId = context.params.chatId;
    const chatRef = db.collection('chats').doc(chatId);
    const chatDoc = await chatRef.get();
    if (!chatDoc.exists) return null;
    await chatRef.update({ lastMessageAt: admin.firestore.FieldValue.serverTimestamp() });

    const participants = chatDoc.data().participants || [];
    const recipients = participants.filter((id) => id !== message.from);

    // create notification docs for recipients (push will be handled by another function or directly here)
    const writes = recipients.map(uid => {
      return db.collection('notifications').add({
        userId: uid,
        title: message.fromName ? `${message.fromName} sent a message` : 'New message',
        body: message.text ? (message.text.slice(0, 140)) : 'Attachment',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        metadata: { chatId },
        read: false
      });
    });

    await Promise.all(writes);
    return null;
  });
