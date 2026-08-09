import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "./firebase.js";


// ==========================================
// ADMIN LOGIN
// ==========================================

export async function adminLogin(email, password) {
  const result = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  console.log("Firebase login successful:", result.user);

  return result;
}


// ==========================================
// ADMIN LOGOUT
// ==========================================

export async function adminLogout() {
  await signOut(auth);

  console.log("Admin logged out");
}


// ==========================================
// PASSWORD RESET
// ==========================================

export async function sendAdminResetLink(email) {
  return await sendPasswordResetEmail(
    auth,
    email.trim()
  );
}