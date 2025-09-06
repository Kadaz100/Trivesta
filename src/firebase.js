// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKj5KvB2th9RMmMV5IZ0CS7d_K5EVTx2M",
  authDomain: "cryptoinvest-dab36.firebaseapp.com",
  projectId: "cryptoinvest-dab36",
  storageBucket: "cryptoinvest-dab36.firebasestorage.app",
  messagingSenderId: "402435838063",
  appId: "1:402435838063:web:a07ef1292f95de2ef7fd9a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
