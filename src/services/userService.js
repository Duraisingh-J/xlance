// MOCK USER SERVICE
// Simulates Firestore operations locally

let mockProfile = {
    name: "Demo User",
    email: "demo@xlance.com",
    role: [],
    skills: [],
    bio: "",
    onboardingCompleted: false,
    onboarded: false, // Legacy field support
    createdAt: new Date().toISOString(),
};

export const userService = {
    createUserProfile: async (uid, data) => {
        console.log("Mock Create Profile:", data);
        mockProfile = { ...mockProfile, ...data };
        return mockProfile;
    },

    getUserProfile: async (uid) => {
        console.log("Mock Get Profile");
        // Simulate "New User" if no role set
        return mockProfile;
    },

    updateUserProfile: async (uid, data) => {
        console.log("Mock Update Profile:", data);
        mockProfile = { ...mockProfile, ...data };
        // Handle the 'onboarded' flag logic for both fields
        if (data.onboarded || data.onboardingCompleted) {
            mockProfile.onboarded = true;
            mockProfile.onboardingCompleted = true;
        }
        return mockProfile;
    }
};
