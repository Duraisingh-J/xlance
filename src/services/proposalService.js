import { db } from './firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { userService } from './userService';

export const proposalService = {
  // Create a new proposal
  createProposal: async (proposalData) => {
    try {
      // 1. Deduct connects first (optimistic check)
      // Default cost is 4, or calculate based on job budget if available
      const connectsCost = 4;
      await userService.deductConnects(proposalData.freelancerId, connectsCost, `Proposal for: ${proposalData.jobTitle}`);

      // 2. Create Proposal Document
      const docRef = await addDoc(collection(db, 'proposals'), {
        ...proposalData,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error creating proposal:", error);
      throw error;
    }
  },

  // Get proposals for a specific job (Client view)
  getProposalsByJob: async (jobId) => {
    try {
      const q = query(
        collection(db, 'proposals'),
        where('jobId', '==', jobId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching job proposals:", error);
      return [];
    }
  },

  // Get proposals made by a freelancer (Freelancer view)
  getProposalsByFreelancer: async (freelancerId) => {
    try {
      const q = query(
        collection(db, 'proposals'),
        where('freelancerId', '==', freelancerId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching freelancer proposals:", error);
      return [];
    }
  }
};