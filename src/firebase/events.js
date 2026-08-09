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
// CONSTANTS
// =====================================

const MAX_IMAGE_SIZE =
  15 * 1024 * 1024; // 15 MB per image

const MAX_GALLERY_IMAGES = 5;


// =====================================
// CLOUDINARY IMAGE UPLOAD
// =====================================

async function uploadImageToCloudinary(
  file,
  folder
) {

  if (!file) {
    throw new Error(
      "Image file नहीं मिली।"
    );
  }


  // IMAGE TYPE CHECK

  if (
    !file.type ||
    !file.type.startsWith("image/")
  ) {

    throw new Error(
      `${file.name} image नहीं है।`
    );

  }


  // INDIVIDUAL IMAGE SIZE

  if (
    file.size >
    MAX_IMAGE_SIZE
  ) {

    throw new Error(
      `${file.name} 15 MB से बड़ी है।`
    );

  }


  const formData =
    new FormData();


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
    folder
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
        `${file.name} upload नहीं हुई।`
    );

  }


  if (
    !uploadedImage.secure_url
  ) {

    throw new Error(
      `${file.name} का Cloudinary URL नहीं मिला।`
    );

  }


  return uploadedImage.secure_url;
}


// =====================================
// CREATE EVENT
// =====================================

export async function createEvent({

  title,

  date,

  location,

  description,

  imageFile,

  // Multiple gallery images
  imageFiles,

  // Alternative name support
  galleryImages,

}) {

  // =====================================
  // BASIC VALIDATION
  // =====================================

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


  // =====================================
  // COVER IMAGE
  // =====================================

  let imageUrl = "";


  if (imageFile) {

    imageUrl =
      await uploadImageToCloudinary(
        imageFile,
        "yuva-sarathi-events"
      );

  }


  // =====================================
  // GALLERY IMAGES
  // =====================================

  let filesToUpload = [];


  // imageFiles आने पर

  if (imageFiles) {

    filesToUpload =
      Array.from(
        imageFiles
      );

  }

  // galleryImages आने पर

  else if (galleryImages) {

    filesToUpload =
      Array.from(
        galleryImages
      );

  }


  // =====================================
  // MAX 5 IMAGES
  // =====================================

  if (
    filesToUpload.length >
    MAX_GALLERY_IMAGES
  ) {

    throw new Error(
      "एक कार्य के साथ अधिकतम 5 तस्वीरें ही जोड़ सकते हैं।"
    );

  }


  // =====================================
  // CHECK ALL FILES BEFORE UPLOAD
  // =====================================

  for (
    const file of filesToUpload
  ) {

    if (
      !file.type ||
      !file.type.startsWith(
        "image/"
      )
    ) {

      throw new Error(
        `${file.name} image नहीं है।`
      );

    }


    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {

      throw new Error(
        `${file.name} 15 MB से बड़ी है।`
      );

    }

  }


  // =====================================
  // UPLOAD GALLERY IMAGES
  // =====================================

  const galleryImageUrls = [];


  for (
    const file of filesToUpload
  ) {

    const uploadedUrl =
      await uploadImageToCloudinary(
        file,
        "yuva-sarathi-events"
      );


    galleryImageUrls.push(
      uploadedUrl
    );

  }


  // =====================================
  // FIRESTORE
  // =====================================

  const eventData = {

    title:
      title.trim(),

    date,

    location:
      location.trim(),

    description:
      description.trim(),

    // OLD COVER IMAGE FIELD
    image:
      imageUrl,

    // NEW MULTIPLE IMAGE FIELD
    galleryImages:
      galleryImageUrls,

    // Number of gallery images
    galleryImageCount:
      galleryImageUrls.length,

    createdAt:
      serverTimestamp(),

  };


  // =====================================
  // SAVE EVENT
  // =====================================

  return addDoc(
    collection(
      db,
      "events"
    ),
    eventData
  );

}


// =====================================
// GET EVENTS
// =====================================

export async function getEvents() {

  const snapshot =
    await getDocs(
      collection(
        db,
        "events"
      )
    );


  return snapshot.docs.map(
    (item) => {

      const data =
        item.data();


      return {

        id:
          item.id,

        ...data,

        // =================================
        // SAFETY
        // =================================
        // अगर पुराना event है जिसमें
        // galleryImages नहीं है,
        // तो empty array देगा।

        galleryImages:
          Array.isArray(
            data.galleryImages
          )
            ? data.galleryImages
            : [],

      };

    }
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


  // =====================================
  // DELETE FIRESTORE EVENT
  // =====================================

  await deleteDoc(
    doc(
      db,
      "events",
      eventId
    )
  );

}