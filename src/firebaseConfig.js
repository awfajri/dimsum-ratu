// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Config dari firebase
const firebaseConfig = {};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Database Firestore
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
