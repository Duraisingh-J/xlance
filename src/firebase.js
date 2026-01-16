// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeSPoGNdqnL4gN2DrYagx8_cUMh-YrPGo",
  authDomain: "xlance-b4fc6.firebaseapp.com",
  projectId: "xlance-b4fc6",
  storageBucket: "xlance-b4fc6.firebasestorage.app",
  messagingSenderId: "896412795774",
  appId: "1:896412795774:web:db33bdbe9eb868aa56292f",
  measurementId: "G-2PDRM32E0W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Use initializeFirestore to force long polling if WebSockets fail, and connect to specific DB
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, "xlancedb1");
export const storage = getStorage(app);

export { app, auth };
