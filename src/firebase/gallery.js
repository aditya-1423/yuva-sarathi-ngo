// src/firebase/gallery.js

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "./firebase.js";

import {
  CLOUDINARY_UPLOAD_URL,
  CLOUDINARY_UPLOAD_PRESET,
} from "../config/cloudinary.js";

const GALLERY_COLLECTION = "gallery";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

/* =========================================================
   CLOUDINARY UPLOAD
========================================================= */

async function uploadToCloudinary(file) {
  if (!file) {
    throw new Error("Image file missing.");
  }

  if (!file.type?.startsWith("image/")) {
    throw new Error(
      `${file.name} एक valid image नहीं है।`
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `${file.name} 15 MB से बड़ी है।`
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append(
    "upload_preset",
    CLOUDINARY_UPLOAD_PRESET
  );

  const response = await fetch(
    CLOUDINARY_UPLOAD_URL,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
        "Cloudinary upload failed."
    );
  }

  if (!result.secure_url) {
    throw new Error(
      "Cloudinary image URL नहीं मिला।"
    );
  }

  return {
    url: result.secure_url,
    publicId: result.public_id || null,
    resourceType:
      result.resource_type || "image",
    width: result.width || null,
    height: result.height || null,
    format: result.format || null,
  };
}

/* =========================================================
   ADD GALLERY IMAGES
========================================================= */

export async function addGalleryImages(
  files,
  caption = ""
) {
  if (!Array.isArray(files) || files.length === 0) {
    throw new Error(
      "कम से कम एक तस्वीर चुनें।"
    );
  }

  const galleryRef = collection(
    db,
    GALLERY_COLLECTION
  );

  const uploadedImages = [];

  for (const file of files) {
    const cloudinaryImage =
      await uploadToCloudinary(file);

    const documentData = {
      imageUrl: cloudinaryImage.url,

      cloudinaryPublicId:
        cloudinaryImage.publicId,

      resourceType:
        cloudinaryImage.resourceType,

      width: cloudinaryImage.width,
      height: cloudinaryImage.height,
      format: cloudinaryImage.format,

      caption:
        caption?.trim() ||
        "संस्था की गतिविधि",

      createdAt: serverTimestamp(),
    };

    const documentReference =
      await addDoc(
        galleryRef,
        documentData
      );

    uploadedImages.push({
      id: documentReference.id,
      ...documentData,
    });
  }

  return uploadedImages;
}

/* =========================================================
   GET GALLERY IMAGES
========================================================= */

export async function getGalleryImages() {
  const galleryRef = collection(
    db,
    GALLERY_COLLECTION
  );

  let snapshot;

  try {
    const galleryQuery = query(
      galleryRef,
      orderBy("createdAt", "desc")
    );

    snapshot = await getDocs(
      galleryQuery
    );
  } catch (error) {
    console.warn(
      "Ordered gallery query failed. Loading without order:",
      error
    );

    snapshot = await getDocs(
      galleryRef
    );
  }

  return snapshot.docs
    .map((document) => ({
      id: document.id,
      ...document.data(),
    }))
    .filter(
      (item) =>
        item.imageUrl ||
        item.image ||
        item.photo
    )
    .map((item) => ({
      ...item,

      imageUrl:
        item.imageUrl ||
        item.image ||
        item.photo ||
        "",
    }));
}

/* =========================================================
   DELETE GALLERY IMAGE
=========================================================

   IMPORTANT:
   This deletes ONLY the Firestore document.

   Cloudinary image is intentionally NOT deleted.
========================================================= */

export async function deleteGalleryImage(
  imageId
) {
  if (!imageId) {
    throw new Error(
      "Gallery image ID missing."
    );
  }

  await deleteDoc(
    doc(
      db,
      GALLERY_COLLECTION,
      imageId
    )
  );

  return true;
}