// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBD9xzr8PZAIdGkuKuCOpl1tjZojDV7_f8",
  authDomain: "we-are-geniuses-v0.firebaseapp.com",
  projectId: "we-are-geniuses-v0",
  storageBucket: "we-are-geniuses-v0.appspot.com",
  messagingSenderId: "536016842800",
  appId: "1:536016842800:web:c60bca820b6c407018fdf5",
  measurementId: "G-6T6J17WBML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app; 