// src/firebase/events.js

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

const EVENTS_COLLECTION = "events";

const MAX_EVENT_IMAGES = 5;
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

    publicId:
      result.public_id || null,

    resourceType:
      result.resource_type || "image",

    width:
      result.width || null,

    height:
      result.height || null,

    format:
      result.format || null,
  };
}

/* =========================================================
   CREATE EVENT
========================================================= */

export async function createEvent({
  title,
  date,
  location,
  description,
  imageFiles = [],
}) {
  if (!title?.trim()) {
    throw new Error(
      "कार्यक्रम का नाम आवश्यक है।"
    );
  }

  if (!date) {
    throw new Error(
      "कार्यक्रम की तारीख आवश्यक है।"
    );
  }

  if (!location?.trim()) {
    throw new Error(
      "कार्यक्रम का स्थान आवश्यक है।"
    );
  }

  if (!description?.trim()) {
    throw new Error(
      "कार्यक्रम का विवरण आवश्यक है।"
    );
  }

  if (
    !Array.isArray(imageFiles) ||
    imageFiles.length === 0
  ) {
    throw new Error(
      "कम से कम एक तस्वीर चुनें।"
    );
  }

  if (
    imageFiles.length >
    MAX_EVENT_IMAGES
  ) {
    throw new Error(
      "एक कार्यक्रम में अधिकतम 5 तस्वीरें चुन सकते हैं।"
    );
  }

  /* =======================================================
     UPLOAD ALL EVENT IMAGES TO CLOUDINARY
  ======================================================= */

  const galleryImages = [];

  for (const file of imageFiles) {
    const uploaded =
      await uploadToCloudinary(file);

    galleryImages.push({
      url: uploaded.url,

      publicId:
        uploaded.publicId,

      resourceType:
        uploaded.resourceType,

      width:
        uploaded.width,

      height:
        uploaded.height,

      format:
        uploaded.format,
    });
  }

  /* =======================================================
     FIRESTORE EVENT DOCUMENT
  ======================================================= */

  const eventData = {
    title: title.trim(),

    date,

    location: location.trim(),

    description:
      description.trim(),

    /*
      Public Events component directly
      galleryImages read कर सकता है.
    */
    galleryImages,

    /*
      Compatibility with old code.
    */
    imageUrls:
      galleryImages.map(
        (image) => image.url
      ),

    /*
      First image as cover.
    */
    image:
      galleryImages[0]?.url || "",

    imageUrl:
      galleryImages[0]?.url || "",

    createdAt:
      serverTimestamp(),
  };

  const eventsRef = collection(
    db,
    EVENTS_COLLECTION
  );

  const documentReference =
    await addDoc(
      eventsRef,
      eventData
    );

  return {
    id: documentReference.id,
    ...eventData,
  };
}

/* =========================================================
   GET EVENTS
========================================================= */

export async function getEvents() {
  const eventsRef = collection(
    db,
    EVENTS_COLLECTION
  );

  let snapshot;

  try {
    const eventsQuery = query(
      eventsRef,
      orderBy("createdAt", "desc")
    );

    snapshot = await getDocs(
      eventsQuery
    );
  } catch (error) {
    console.warn(
      "Ordered events query failed. Loading without order:",
      error
    );

    snapshot = await getDocs(
      eventsRef
    );
  }

  return snapshot.docs
    .map((document) => {
      const data =
        document.data();

      return {
        id: document.id,

        ...data,

        galleryImages:
          Array.isArray(
            data.galleryImages
          )
            ? data.galleryImages
            : [],

        image:
          data.image ||
          data.imageUrl ||
          data.imageUrls?.[0] ||
          "",
      };
    })
    .sort((a, b) => {
      const getTime = (value) => {
        if (!value) return 0;

        if (
          typeof value.toMillis ===
          "function"
        ) {
          return value.toMillis();
        }

        return (
          new Date(value).getTime() ||
          0
        );
      };

      return (
        getTime(b.createdAt) -
        getTime(a.createdAt)
      );
    });
}

/* =========================================================
   DELETE EVENT
=========================================================

   IMPORTANT:
   ONLY FIRESTORE DOCUMENT IS DELETED.

   CLOUDINARY IMAGES ARE NOT DELETED.
========================================================= */

export async function deleteEvent(
  eventId
) {
  if (!eventId) {
    throw new Error(
      "Event ID missing."
    );
  }

  await deleteDoc(
    doc(
      db,
      EVENTS_COLLECTION,
      eventId
    )
  );

  return true;
}