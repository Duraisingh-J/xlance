// MOCK AUTH SERVICE
// Replacing Firebase Auth with local simulation due to network issues

const MOCK_USER = {
    uid: "mock-user-123",
    email: "demo@xlance.com",
    displayName: "Demo User",
    photoURL: null,
    emailVerified: true
};

export const authService = {
    // Mock Sign up
    signup: async (email, password) => {
        console.log("Mock Signup:", email);
        localStorage.setItem("xlance_mock_session", "true");
        return { user: { ...MOCK_USER, email } };
    },

    // Mock Login
    login: async (email, password) => {
        console.log("Mock Login:", email);
        if (password === "error") throw new Error("Invalid credentials");
        localStorage.setItem("xlance_mock_session", "true");
        return { user: { ...MOCK_USER, email } };
    },

    // Mock Google Login
    loginWithGoogle: async () => {
        console.log("Mock Google Login");
        localStorage.setItem("xlance_mock_session", "true");
        return { user: MOCK_USER };
    },

    // Mock Logout
    logout: async () => {
        console.log("Mock Logout");
        localStorage.removeItem("xlance_mock_session");
    },

    // Helper to check session
    getCurrentUser: () => {
        return localStorage.getItem("xlance_mock_session") ? MOCK_USER : null;
    }
};
