import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

export const userService = {
    // Create User Profile
    createUserProfile: async (uid, data) => {
        try {
            const userRef = doc(db, 'users', uid);

            // Default initial profile structure
            const newProfile = {
                name: data.name || '',
                email: data.email,
                role: data.role || [],
                skills: [],
                bio: "",
                onboardingCompleted: false,
                onboarded: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                connects: {
                    available: 50, // Starter pack
                    totalEarned: 50,
                    lastRefillDate: new Date().toISOString(),
                    history: [{
                        id: Date.now(),
                        type: 'earned',
                        amount: 50,
                        reason: 'Welcome Starter Pack',
                        date: new Date().toISOString()
                    }]
                },
                ...data // Merge provided data
            };

            await setDoc(userRef, newProfile);
            return newProfile;
        } catch (error) {
            console.error("Error creating user profile:", error);
            throw error;
        }
    },

    // Get User Profile
    getUserProfile: async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                // Return null if no profile exists; handling logic lies in the caller (e.g., AuthContext)
                return null;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    },

    // Update User Profile
    updateUserProfile: async (uid, data) => {
        try {
            const userRef = doc(db, 'users', uid);

            // Handle the 'onboarded' flag synchronization
            const updateData = {
                ...data,
                updatedAt: new Date().toISOString()
            };

            if (data.onboarded || data.onboardingCompleted) {
                updateData.onboarded = true;
                updateData.onboardingCompleted = true;
            }

            await updateDoc(userRef, updateData);

            // Return updated profile for local state
            const updatedSnap = await getDoc(userRef);
            return updatedSnap.data();
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    },

    // Connects Management - Get Balance
    getConnectsBalance: async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                return data.connects?.available || 0;
            }
            return 0;
        } catch (error) {
            console.error("Error getting connects balance:", error);
            return 0;
        }
    },

    // Connects Management - Deduct Connects
    deductConnects: async (uid, amount, reason) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) throw new Error('User not found');

            const userData = userSnap.data();
            const currentBalance = userData.connects?.available || 0;

            if (currentBalance < amount) {
                throw new Error('Insufficient connects balance');
            }

            // Prepare the history item
            const historyItem = {
                id: Date.now(),
                type: 'spent',
                amount: amount,
                reason: reason,
                date: new Date().toISOString()
            };

            // Perform update
            // complex object updates in firestore can be tricky with dot notation for nested fields
            // but 'connects.available' works if 'connects' map exists.
            await updateDoc(userRef, {
                'connects.available': increment(-amount),
                'connects.history': arrayUnion(historyItem)
            });

            const updatedSnap = await getDoc(userRef);
            return updatedSnap.data().connects;

        } catch (error) {
            console.error("Error deducting connects:", error);
            throw error;
        }
    },

    // Connects Management - Add Connects
    addConnects: async (uid, amount, reason) => {
        try {
            const userRef = doc(db, 'users', uid);

            const historyItem = {
                id: Date.now(),
                type: 'earned',
                amount: amount,
                reason: reason,
                date: new Date().toISOString()
            };

            await updateDoc(userRef, {
                'connects.available': increment(amount),
                'connects.totalEarned': increment(amount),
                'connects.history': arrayUnion(historyItem)
            });

            const updatedSnap = await getDoc(userRef);
            return updatedSnap.data().connects;
        } catch (error) {
            console.error("Error adding connects:", error);
            throw error;
        }
    },

    // Calculate connects cost based on job budget
    calculateConnectsCost: (jobBudget) => {
        if (jobBudget < 5000) return 2;
        if (jobBudget < 25000) return 4;
        if (jobBudget < 100000) return 6;
        return 8;
    }
};
