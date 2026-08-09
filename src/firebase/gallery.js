import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import {
  db,
  storage,
} from "./firebase.js";


// =====================================================
// SETTINGS
// =====================================================

const GALLERY_COLLECTION = "gallery";

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1920;

// JPEG quality
const IMAGE_QUALITY = 0.78;


// =====================================================
// COMPRESS IMAGE
// =====================================================

async function compressImage(file) {
  if (!file || !file.type.startsWith("image/")) {
    throw new Error("Valid image file नहीं है।");
  }

  return new Promise((resolve, reject) => {
    const image = new Image();

    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      try {
        let width = image.naturalWidth;
        let height = image.naturalHeight;

        // ---------------------------------------------
        // Resize if image is too large
        // ---------------------------------------------

        const widthRatio = MAX_WIDTH / width;
        const heightRatio = MAX_HEIGHT / height;

        const ratio = Math.min(
          1,
          widthRatio,
          heightRatio
        );

        width = Math.round(width * ratio);
        height = Math.round(height * ratio);

        // ---------------------------------------------
        // Canvas
        // ---------------------------------------------

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          URL.revokeObjectURL(objectUrl);

          reject(
            new Error(
              "Image compression शुरू नहीं हो सकी।"
            )
          );

          return;
        }

        // White background
        // Useful for PNG images with transparency
        context.fillStyle = "#ffffff";

        context.fillRect(
          0,
          0,
          width,
          height
        );

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        // ---------------------------------------------
        // Convert to JPEG
        // ---------------------------------------------

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);

            if (!blob) {
              reject(
                new Error(
                  "Image compression failed."
                )
              );

              return;
            }

            const originalName =
              file.name
                .replace(/\.[^/.]+$/, "")
                .replace(/[^a-zA-Z0-9-_]/g, "_");

            const compressedFile =
              new File(
                [
                  blob,
                ],
                `${originalName}.jpg`,
                {
                  type: "image/jpeg",
                  lastModified:
                    Date.now(),
                }
              );

            resolve(
              compressedFile
            );
          },
          "image/jpeg",
          IMAGE_QUALITY
        );
      } catch (error) {
        URL.revokeObjectURL(objectUrl);

        reject(error);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      reject(
        new Error(
          `Image "${file.name}" पढ़ी नहीं जा सकी।`
        )
      );
    };

    image.src = objectUrl;
  });
}


// =====================================================
// ADD GALLERY IMAGES
// =====================================================

export async function addGalleryImages(
  files,
  caption = ""
) {
  if (!files || files.length === 0) {
    throw new Error(
      "कम से कम एक तस्वीर चुनें।"
    );
  }

  const uploadedImages = [];

  try {
    // -----------------------------------------------
    // Upload each image
    // -----------------------------------------------

    for (
      let index = 0;
      index < files.length;
      index += 1
    ) {
      const originalFile = files[index];

      if (
        !originalFile ||
        !originalFile.type.startsWith("image/")
      ) {
        throw new Error(
          `${originalFile?.name || "File"} image नहीं है।`
        );
      }

      // =============================================
      // COMPRESS BEFORE UPLOAD
      // =============================================

      const compressedFile =
        await compressImage(
          originalFile
        );

      // =============================================
      // UNIQUE FILE NAME
      // =============================================

      const timestamp =
        Date.now();

      const random =
        Math.random()
          .toString(36)
          .substring(2, 10);

      const fileName =
        `gallery_${timestamp}_${random}_${index}.jpg`;

      // =============================================
      // STORAGE PATH
      // =============================================

      const storagePath =
        `gallery/${fileName}`;

      const storageRef =
        ref(
          storage,
          storagePath
        );

      // =============================================
      // UPLOAD COMPRESSED IMAGE
      // =============================================

      await uploadBytes(
        storageRef,
        compressedFile,
        {
          contentType:
            "image/jpeg",

          cacheControl:
            "public,max-age=31536000,immutable",
        }
      );

      // =============================================
      // GET URL
      // =============================================

      const imageUrl =
        await getDownloadURL(
          storageRef
        );

      // =============================================
      // FIRESTORE DOCUMENT
      // =============================================

      const documentData = {
        imageUrl,
        image: imageUrl,
        photo: imageUrl,

        caption:
          caption.trim() ||
          "संस्था की गतिविधि",

        title:
          caption.trim() ||
          "संस्था की गतिविधि",

        storagePath,

        originalName:
          originalFile.name,

        originalSize:
          originalFile.size,

        compressedSize:
          compressedFile.size,

        createdAt:
          serverTimestamp(),
      };

      const documentReference =
        await addDoc(
          collection(
            db,
            GALLERY_COLLECTION
          ),
          documentData
        );

      uploadedImages.push({
        id:
          documentReference.id,

        ...documentData,
      });
    }

    return uploadedImages;

  } catch (error) {
    console.error(
      "Gallery upload error:",
      error
    );

    throw error;
  }
}


// =====================================================
// GET GALLERY IMAGES
// =====================================================

export async function getGalleryImages() {
  try {
    const galleryRef =
      collection(
        db,
        GALLERY_COLLECTION
      );

    const snapshot =
      await getDocs(
        galleryRef
      );

    const images =
      snapshot.docs
        .map((document) => {
          const data =
            document.data();

          return {
            id:
              document.id,

            imageUrl:
              data.imageUrl ||
              data.image ||
              data.photo ||
              "",

            image:
              data.imageUrl ||
              data.image ||
              data.photo ||
              "",

            caption:
              data.caption ||
              data.title ||
              "संस्था की गतिविधि",

            title:
              data.title ||
              data.caption ||
              "संस्था की गतिविधि",

            storagePath:
              data.storagePath ||
              "",

            originalName:
              data.originalName ||
              "",

            originalSize:
              data.originalSize ||
              0,

            compressedSize:
              data.compressedSize ||
              0,

            createdAt:
              data.createdAt ||
              null,
          };
        })
        .filter(
          (item) =>
            item.imageUrl
        );

    // =============================================
    // NEWEST FIRST
    // =============================================

    images.sort(
      (a, b) => {
        const getTime =
          (value) => {
            if (!value) {
              return 0;
            }

            if (
              typeof value.toMillis ===
              "function"
            ) {
              return value.toMillis();
            }

            if (
              value instanceof Date
            ) {
              return value.getTime();
            }

            const time =
              new Date(
                value
              ).getTime();

            return Number.isNaN(
              time
            )
              ? 0
              : time;
          };

        return (
          getTime(
            b.createdAt
          ) -
          getTime(
            a.createdAt
          )
        );
      }
    );

    return images;

  } catch (error) {
    console.error(
      "Get gallery images error:",
      error
    );

    throw error;
  }
}


// =====================================================
// DELETE GALLERY IMAGE
// =====================================================

export async function deleteGalleryImage(
  imageId
) {
  if (!imageId) {
    throw new Error(
      "Image ID नहीं मिला।"
    );
  }

  try {
    // =============================================
    // GET DOCUMENT
    // =============================================

    const imageReference =
      doc(
        db,
        GALLERY_COLLECTION,
        imageId
      );

    const snapshot =
      await getDocs(
        collection(
          db,
          GALLERY_COLLECTION
        )
      );

    const matchingDocument =
      snapshot.docs.find(
        (item) =>
          item.id === imageId
      );

    // =============================================
    // DELETE STORAGE FILE
    // =============================================

    if (
      matchingDocument
    ) {
      const data =
        matchingDocument.data();

      if (
        data.storagePath
      ) {
        try {
          const storageReference =
            ref(
              storage,
              data.storagePath
            );

          await deleteObject(
            storageReference
          );

        } catch (storageError) {
          console.warn(
            "Storage delete warning:",
            storageError
          );
        }
      }
    }

    // =============================================
    // DELETE FIRESTORE DOCUMENT
    // =============================================

    await deleteDoc(
      imageReference
    );

    return true;

  } catch (error) {
    console.error(
      "Delete gallery image error:",
      error
    );

    throw error;
  }
}