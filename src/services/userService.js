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
    connects: {
        available: 50,              // Starter pack
        totalEarned: 50,            // Lifetime earned
        lastRefillDate: new Date().toISOString(),
        history: [
            {
                id: 1,
                type: 'earned',
                amount: 50,
                reason: 'Welcome Starter Pack',
                date: new Date().toISOString()
            }
        ]
    }
};

export const userService = {
    createUserProfile: async (uid, data) => {
        console.log("Mock Create Profile:", data);
        mockProfile = {
            ...mockProfile,
            ...data,
            // Always initialize with 50 connects for new users
            connects: {
                available: 50,
                totalEarned: 50,
                lastRefillDate: new Date().toISOString(),
                history: [{
                    id: Date.now(),
                    type: 'earned',
                    amount: 50,
                    reason: 'Welcome Starter Pack',
                    date: new Date().toISOString()
                }]
            }
        };
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
    },

    // Connects Management Functions
    getConnectsBalance: async (uid) => {
        return mockProfile.connects?.available || 0;
    },

    deductConnects: async (uid, amount, reason) => {
        const currentBalance = mockProfile.connects?.available || 0;

        if (currentBalance < amount) {
            throw new Error('Insufficient connects balance');
        }

        mockProfile.connects.available -= amount;
        mockProfile.connects.history.unshift({
            id: Date.now(),
            type: 'spent',
            amount: amount,
            reason: reason,
            date: new Date().toISOString()
        });

        console.log(`Deducted ${amount} connects. New balance: ${mockProfile.connects.available}`);
        return mockProfile.connects;
    },

    addConnects: async (uid, amount, reason) => {
        if (!mockProfile.connects) {
            mockProfile.connects = {
                available: 0,
                totalEarned: 0,
                lastRefillDate: new Date().toISOString(),
                history: []
            };
        }

        mockProfile.connects.available += amount;
        mockProfile.connects.totalEarned += amount;
        mockProfile.connects.history.unshift({
            id: Date.now(),
            type: 'earned',
            amount: amount,
            reason: reason,
            date: new Date().toISOString()
        });

        console.log(`Added ${amount} connects. New balance: ${mockProfile.connects.available}`);
        return mockProfile.connects;
    },

    // Calculate connects cost based on job budget
    calculateConnectsCost: (jobBudget) => {
        if (jobBudget < 5000) return 2;
        if (jobBudget < 25000) return 4;
        if (jobBudget < 100000) return 6;
        return 8;
    }
};
