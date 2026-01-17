import { userService } from './userService';

export const proposalService = {
  createProposal: async (proposalData) => {
    console.log("Mock Create Proposal:", proposalData);

    // Deduct connects logic
    try {
      // Default cost is 4, or calculate based on job budget if available
      const connectsCost = 4;
      await userService.deductConnects(proposalData.freelancerId, connectsCost, `Proposal submission`);
    } catch (error) {
      console.error("Failed to deduct connects:", error);
      throw error; // Re-throw to prevent proposal creation if deduction fails
    }

    return "mock-proposal-id-" + Date.now();
  },

  getProposalsByJob: async (jobId) => {
    return [];
  },

  getProposalsByFreelancer: async (freelancerId) => {
    return [
      {
        id: "prop-1",
        jobId: "job-1",
        jobTitle: "Senior React Developer",
        bidAmount: 60000,
        status: "pending",
        createdAt: { seconds: Date.now() / 1000 }
      }
    ];
  }
};