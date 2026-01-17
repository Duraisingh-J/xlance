import { db } from './firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';

export const projectService = {
    // Get active projects for a freelancer
    getProjectsByFreelancer: async (freelancerId) => {
        try {
            const q = query(
                collection(db, 'projects'),
                where('freelancerId', '==', freelancerId),
                orderBy('updatedAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // Convert dates for UI consistency if needed, though raw firestore timestamp is okay if handled
                    dueDate: data.dueDate?.toDate ? data.dueDate.toDate().toISOString() : data.dueDate,
                };
            });
        } catch (error) {
            console.error("Error fetching projects:", error);
            return [];
        }
    },

    // Update project details (e.g. milestones, progress)
    updateProject: async (projectId, updateData) => {
        try {
            const projectRef = doc(db, 'projects', projectId);
            await updateDoc(projectRef, {
                ...updateData,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating project:", error);
            throw error;
        }
    },

    // Create a new project (usually called when proposal is accepted)
    createProject: async (projectData) => {
        try {
            const docRef = await addDoc(collection(db, 'projects'), {
                ...projectData,
                status: 'Active',
                progress: 0,
                budgetConsumed: 0,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error creating project:", error);
            throw error;
        }
    },

    // Seed a demo project for the user if they have none (Development Helper)
    seedDemoProject: async (freelancerId) => {
        const demoProject = {
            freelancerId,
            title: "E-Commerce Dashboard Redesign",
            clientName: "TechCorp Inc.",
            clientAvatar: "TC",
            clientUserId: "demo_client_1", // Added for messaging
            status: "Active",
            dueDate: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
            budgetTotal: 45000,
            budgetConsumed: 15000,
            progress: 35,
            nextMilestone: "User Profile Integration",
            milestones: [
                { id: 1, title: "UI Design Approval", completed: true },
                { id: 2, title: "Frontend Implementation", completed: false },
                { id: 3, title: "API Integration", completed: false }
            ]
        };
        return await projectService.createProject(demoProject);
    }
};
