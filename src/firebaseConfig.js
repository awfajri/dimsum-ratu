// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Config dari firebase
const firebaseConfig = {
  apiKey: "AIzaSyDK-4d91mk8SyuPGa1sD-310jf191HS1Tk",
  authDomain: "dimsum-ratu-shop.firebaseapp.com",
  projectId: "dimsum-ratu-shop",
  storageBucket: "dimsum-ratu-shop.firebasestorage.app",
  messagingSenderId: "858705999456",
  appId: "1:858705999456:web:7ecbdf4740814581fe3505",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Database Firestore
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
