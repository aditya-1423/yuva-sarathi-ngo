import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase.js";

export const adminLogin = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const adminLogout = () => signOut(auth);

export const sendAdminResetLink = (email) =>
  sendPasswordResetEmail(auth, email);