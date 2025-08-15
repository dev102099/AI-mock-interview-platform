// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBdmNQK_jJ7xYYJPkeiWfVoJPPEtIM821U",
    authDomain: "interview-buddy-b2cf1.firebaseapp.com",
    projectId: "interview-buddy-b2cf1",
    storageBucket: "interview-buddy-b2cf1.firebasestorage.app",
    messagingSenderId: "440177793372",
    appId: "1:440177793372:web:2363c7b1271dce2f0d0999",
    measurementId: "G-YD7NGPG5JS"
};

// Initialize Firebase
const app =!getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
