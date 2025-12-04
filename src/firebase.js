// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeSPoGNdqnL4gN2DrYagx8_cUMh-YrPGo",
  authDomain: "xlance-b4fc6.firebaseapp.com",
  projectId: "xlance-b4fc6",
  storageBucket: "xlance-b4fc6.appspot.com",
  messagingSenderId: "896412795774",
  appId: "1:896412795774:web:db33bdbe9eb868aa56292f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
