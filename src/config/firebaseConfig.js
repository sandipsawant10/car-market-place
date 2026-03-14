// Import the functions you need from the SDKs you need
import  { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import .meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "car-marketplace-ef093.firebaseapp.com",
  projectId: "car-marketplace-ef093",
  storageBucket: "car-marketplace-ef093.firebasestorage.app",
  messagingSenderId: "231737376948",
  appId: "1:231737376948:web:4ac6ef36a43b83ee6217e1",
  measurementId: "G-3TLW5HNXSL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);