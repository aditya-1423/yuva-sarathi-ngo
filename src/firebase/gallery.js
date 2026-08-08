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


// ==============================
// MULTIPLE IMAGE UPLOAD
// ==============================

export async function addGalleryImages(
  files,
  caption
) {
  if (!files || files.length === 0) {
    throw new Error(
      "कम से कम एक तस्वीर चुनें।"
    );
  }

  const fileArray =
    Array.from(files);

  // पहले सभी files check
  for (const file of fileArray) {
    if (!file.type.startsWith("image/")) {
      throw new Error(
        `${file.name} image नहीं है।`
      );
    }

    if (file.size > 15 * 1024 * 1024) {
      throw new Error(
        `${file.name} 15 MB से बड़ी है।`
      );
    }
  }

  // एक-एक करके upload
  for (const file of fileArray) {
    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "upload_preset",
      UPLOAD_PRESET
    );

    formData.append(
      "folder",
      "yuva-sarathi-gallery"
    );

    const response = await fetch(
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
          "तस्वीर upload नहीं हुई।"
      );
    }

    // Firestore में image की जानकारी
    await addDoc(
      collection(db, "gallery"),
      {
        imageUrl:
          uploadedImage.secure_url,

        caption:
          caption?.trim() ||
          "संस्था की गतिविधि",

        createdAt:
          serverTimestamp(),
      }
    );
  }
}


// ==============================
// GET GALLERY IMAGES
// ==============================

export async function getGalleryImages() {
  const snapshot =
    await getDocs(
      collection(db, "gallery")
    );

  return snapshot.docs.map(
    (item) => ({
      id: item.id,
      ...item.data(),
    })
  );
}


// ==============================
// DELETE GALLERY IMAGE
// ==============================

export async function deleteGalleryImage(
  imageId
) {
  if (!imageId) {
    throw new Error(
      "तस्वीर की ID नहीं मिली।"
    );
  }

  await deleteDoc(
    doc(
      db,
      "gallery",
      imageId
    )
  );
}