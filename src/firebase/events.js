import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase.js";

const CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


// =====================================
// CREATE EVENT
// =====================================

export async function createEvent({
  title,
  date,
  location,
  description,
  imageFile,
}) {
  if (
    !title ||
    !date ||
    !location ||
    !description
  ) {
    throw new Error(
      "सभी जानकारी भरना जरूरी है।"
    );
  }

  let imageUrl = "";

  // =====================================
  // IMAGE UPLOAD
  // Original image — NO CROP
  // =====================================

  if (imageFile) {

    if (
      !imageFile.type.startsWith("image/")
    ) {
      throw new Error(
        "कृपया केवल तस्वीर चुनें।"
      );
    }

    if (
      imageFile.size >
      15 * 1024 * 1024
    ) {
      throw new Error(
        "Cover image 15 MB से छोटी होनी चाहिए।"
      );
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      imageFile
    );

    formData.append(
      "upload_preset",
      UPLOAD_PRESET
    );

    formData.append(
      "folder",
      "yuva-sarathi-events"
    );

    const response =
      await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

    const uploadedImage =
      await response.json();

    if (!response.ok) {
      throw new Error(
        uploadedImage.error?.message ||
          "Cover image upload नहीं हुई।"
      );
    }

    imageUrl =
      uploadedImage.secure_url;
  }

  // =====================================
  // FIRESTORE
  // =====================================

  return addDoc(
    collection(db, "events"),
    {
      title,
      date,
      location,
      description,
      image: imageUrl,
      createdAt:
        serverTimestamp(),
    }
  );
}


// =====================================
// GET EVENTS
// =====================================

export async function getEvents() {

  const snapshot =
    await getDocs(
      collection(db, "events")
    );

  return snapshot.docs.map(
    (item) => ({
      id: item.id,
      ...item.data(),
    })
  );
}


// =====================================
// DELETE EVENT
// =====================================

export async function deleteEvent(
  eventId
) {

  if (!eventId) {
    throw new Error(
      "Event ID नहीं मिली।"
    );
  }

  await deleteDoc(
    doc(
      db,
      "events",
      eventId
    )
  );
}