import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, doc, getDoc, query, where, orderBy, serverTimestamp, onSnapshot } from 'firebase/firestore';

export const jobService = {
  // Create a new job post
  createJob: async (jobData) => {
    try {
      const docRef = await addDoc(collection(db, 'jobs'), {
        ...jobData,
        createdAt: serverTimestamp(),
        status: 'open',
        proposalsCount: 0
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating job:", error);
      throw error;
    }
  },

  // Get all open jobs (One-time fetch)
  getOpenJobs: async () => {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('status', '==', 'open'),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching open jobs:", error);
      return [];
    }
  },

  // Subscribe to open jobs (Real-time updates)
  subscribeToOpenJobs: (callback) => {
    console.log("Subscribing to open jobs...");
    const q = query(
      collection(db, 'jobs'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      console.log("Snapshot received! Docs count:", snapshot.docs.length);
      const jobs = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Job Doc:", doc.id, data);
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
        };
      });
      callback(jobs);
    }, (error) => {
      console.error("Error subscribing to open jobs:", error);
      callback([]);
    });
  },

  // Get jobs posted by a specific client
  getClientJobs: async (clientId) => {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching client jobs:", error);
      return [];
    }
  },

  // Get single job details
  getJobById: async (jobId) => {
    try {
      const docRef = doc(db, 'jobs', jobId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting job by ID:", error);
      throw error;
    }
  }
};
