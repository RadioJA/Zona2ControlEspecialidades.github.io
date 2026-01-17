// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANWiW1T5QgDrEobpoiAkieXiC7y1x4mwo",
  authDomain: "zona2especialidades.firebaseapp.com",
  projectId: "zona2especialidades",
  storageBucket: "zona2especialidades.firebasestorage.app",
  messagingSenderId: "722326439939",
  appId: "1:722326439939:web:5f1b8711a76496a67c6636"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

module.exports = db;
