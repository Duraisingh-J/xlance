import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export const createUserProfile = async (user, extraData = {}) => {
  if (!user || !user.uid) return null;
  const userRef = doc(db, 'users', user.uid);
  let userSnap;
  try {
    userSnap = await getDoc(userRef);
  } catch (err) {
    // If client is offline or Firestore unavailable, log and return minimal payload
    console.warn('getDoc failed in createUserProfile (continuing):', err && err.message ? err.message : err);
    return null;
  }

  if (!userSnap.exists()) {
    const name = user.displayName || extraData.name || '';
    const email = user.email || '';
    const photoURL = user.photoURL || null;

    const payload = {
      uid: user.uid,
      name,
      email,
      photoURL,
      role: [],
      onboardingCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...extraData,
    };

    try {
      await setDoc(userRef, payload);
    } catch (error) {
      console.error('Error creating user profile:', error);
      // If Firestore is unavailable, don't throw to avoid breaking auth flows; return payload locally
      if (error && (error.code === 'unavailable' || (error.message && error.message.toLowerCase().includes('client is offline')))) {
        console.warn('Firestore unavailable; returning local payload without persisting.');
        return payload;
      }
      throw error;
    }
    return payload;
  }

  return userSnap.data();
};

export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  try {
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (err) {
    console.warn('getUserProfile failed (possibly offline):', err && err.message ? err.message : err);
    return null;
  }
};

export const updateUserProfile = async (uid, data) => {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const payload = { ...data, updatedAt: serverTimestamp() };
  try {
    await updateDoc(userRef, payload);
    return true;
  } catch (err) {
    console.error('Error updating user profile:', err);
    // If offline, log and return false instead of throwing to avoid breaking UI flows
    if (err && (err.code === 'unavailable' || (err.message && err.message.toLowerCase().includes('client is offline')))) {
      console.warn('Firestore unavailable; update skipped.');
      return false;
    }
    throw err;
  }
};
