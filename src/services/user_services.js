import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const createUserProfile = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        uid: user.uid,
        email,
        displayName,
        photoURL,
        createdAt,
        role: null, // Role will be set after onboarding
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  return userRef;
};

export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  return userSnap.exists() ? userSnap.data() : null;
};

export const updateUserProfile = async (uid, data) => {
    if (!uid) return;
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, data, { merge: true });
};
