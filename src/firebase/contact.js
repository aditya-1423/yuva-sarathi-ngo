import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase.js";

// ==========================================
// CONTACT COLLECTION
// ==========================================

const CONTACT_COLLECTION = "contactMessages";


// ==========================================
// ADD CONTACT MESSAGE
// ==========================================

export const addContactMessage = async (data) => {
  try {
    const docRef = await addDoc(
      collection(db, CONTACT_COLLECTION),
      {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        message: data.message.trim(),
        createdAt: serverTimestamp(),
      }
    );

    return {
      id: docRef.id,
      success: true,
    };
  } catch (error) {
    console.error(
      "Contact message add error:",
      error
    );

    throw error;
  }
};


// ==========================================
// GET CONTACT MESSAGES
// ==========================================

export const getContactMessages = async () => {
  try {
    const q = query(
      collection(db, CONTACT_COLLECTION),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));
  } catch (error) {
    console.error(
      "Contact messages fetch error:",
      error
    );

    throw error;
  }
};


// ==========================================
// DELETE CONTACT MESSAGE
// ==========================================

export const deleteContactMessage = async (id) => {
  try {
    if (!id) {
      throw new Error(
        "Contact message ID नहीं मिला।"
      );
    }

    await deleteDoc(
      doc(
        db,
        CONTACT_COLLECTION,
        id
      )
    );

    return true;
  } catch (error) {
    console.error(
      "Contact message delete error:",
      error
    );

    throw error;
  }
};