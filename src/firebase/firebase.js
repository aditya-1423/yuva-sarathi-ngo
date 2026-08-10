import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDejInMqoFIygsEDfiCkal2mlzRZ176YZ0",
  authDomain: "yuva-sarathi-ngo.firebaseapp.com",
  projectId: "yuva-sarathi-ngo",
  storageBucket: "yuva-sarathi-ngo.firebasestorage.app",
  messagingSenderId: "1093367270878",
  appId: "1:1093367270878:web:df76edb54db1942232214f",
  measurementId: "G-J550JSDWJG"
};

const app = initializeApp(firebaseConfig);

export { app };

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);