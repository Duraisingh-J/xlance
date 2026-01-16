// MOCK PROPOSAL SERVICE
export const proposalService = {
  createProposal: async (proposalData) => {
    console.log("Mock Create Proposal:", proposalData);
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