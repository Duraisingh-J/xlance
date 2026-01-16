// MOCK JOB SERVICE
export const jobService = {
  createJob: async (jobData) => {
    console.log("Mock Create Job:", jobData);
    return "mock-job-id-" + Date.now();
  },

  getOpenJobs: async () => {
    return [
      {
        id: "job-1",
        title: "Senior React Developer",
        description: "Need an expert in React/Next.js for a fintech project.",
        budgetMin: 50000,
        budgetMax: 150000,
        skills: ["React", "Node.js"],
        client: { name: "FinTech Corp" },
        createdAt: { seconds: Date.now() / 1000 }
      },
      {
        id: "job-2",
        title: "Logo Designer Needed",
        description: "Modern minimalist logo for a startup.",
        budgetMin: 5000,
        budgetMax: 15000,
        skills: ["Design", "Figma"],
        client: { name: "Startup Inc" },
        createdAt: { seconds: Date.now() / 1000 }
      }
    ];
  },

  getClientJobs: async (clientId) => {
    return [
      {
        id: "job-1",
        title: "Senior React Developer",
        budgetMin: 50000,
        budgetMax: 150000,
        status: "Open"
      }
    ];
  },

  getJobById: async (jobId) => {
    return {
      id: jobId,
      title: "Senior React Developer",
      description: "This is a detailed description of the mock job.",
      budgetMin: 50000,
      budgetMax: 150000,
      skills: ["React", "Node.js"],
      client: { name: "FinTech Corp" },
      clientId: "mock-client-id",
      createdAt: { seconds: Date.now() / 1000 }
    };
  }
};
