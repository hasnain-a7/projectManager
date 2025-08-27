// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBf5Oxux_tMIO8-6_ZAUcMl7dsKLC4F82A",
  authDomain: "mytasktracker-685e1.firebaseapp.com",
  projectId: "mytasktracker-685e1",
  storageBucket: "mytasktracker-685e1.firebasestorage.app",
  messagingSenderId: "111670973064",
  appId: "1:111670973064:web:887e7ced80966265c9453d",
  measurementId: "G-DWVCXY7JC8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
