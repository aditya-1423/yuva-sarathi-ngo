const CLOUDINARY_CLOUD_NAME = "pruphodc";

const CLOUDINARY_UPLOAD_PRESET = "yuva_gallery";

const CLOUDINARY_UPLOAD_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error("Image file required.");
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

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
};

export const uploadMultipleToCloudinary = async (
  files
) => {
  if (!Array.isArray(files)) {
    return [];
  }

  const results = [];

  for (const file of files) {
    const uploaded =
      await uploadToCloudinary(file);

    results.push(uploaded);
  }

  return results;
};