import { useEffect, useState } from "react";

import {
  addGalleryImages,
  getGalleryImages,
  deleteGalleryImage,
} from "../../firebase/gallery.js";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

function Gallery() {
  const [galleryImages, setGalleryImages] =
    useState([]);

  const [selectedImages, setSelectedImages] =
    useState([]);

  const [caption, setCaption] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteLoading, setDeleteLoading] =
    useState(null);

  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD GALLERY
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function loadGallery() {
      try {
        const data = await getGalleryImages();

        if (!cancelled) {
          setGalleryImages(
            Array.isArray(data) ? data : []
          );
        }
      } catch (error) {
        console.error(
          "Gallery load error:",
          error
        );

        if (!cancelled) {
          setMessage(
            error?.message ||
              "गैलरी की तस्वीरें लोड नहीं हो सकीं।"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGallery();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // IMAGE SELECT
  // ==========================================

  function handleImageSelect(event) {
    const files = Array.from(
      event.target.files || []
    );

    setMessage("");

    if (files.length === 0) {
      setSelectedImages([]);
      return;
    }

    for (const file of files) {
      if (
        !file.type ||
        !file.type.startsWith("image/")
      ) {
        setSelectedImages([]);

        setMessage(
          `${file.name} तस्वीर नहीं है।`
        );

        event.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setSelectedImages([]);

        setMessage(
          `${file.name} 15 MB से बड़ी है।`
        );

        event.target.value = "";
        return;
      }
    }

    setSelectedImages(files);

    setMessage(
      `${files.length} तस्वीरें चुनी गई हैं।`
    );
  }

  // ==========================================
  // UPLOAD GALLERY IMAGES
  // ==========================================

  async function handleUpload(event) {
    event.preventDefault();

    setMessage("");

    if (selectedImages.length === 0) {
      setMessage("पहले तस्वीरें चुनें।");
      return;
    }

    try {
      setUploading(true);

      const totalImages =
        selectedImages.length;

      await addGalleryImages(
        selectedImages,
        caption.trim()
      );

      setSelectedImages([]);
      setCaption("");

      event.target.reset();

      const updatedImages =
        await getGalleryImages();

      setGalleryImages(
        Array.isArray(updatedImages)
          ? updatedImages
          : []
      );

      setMessage(
        `${totalImages} तस्वीरें सफलतापूर्वक अपलोड हो गईं! 🎉`
      );
    } catch (error) {
      console.error(
        "Gallery upload error:",
        error
      );

      setMessage(
        error?.message ||
          "तस्वीरें अपलोड नहीं हो सकीं।"
      );
    } finally {
      setUploading(false);
    }
  }

  // ==========================================
  // DELETE IMAGE
  // ==========================================

  async function handleDelete(imageId) {
    if (!imageId) {
      return;
    }

    const confirmed = window.confirm(
      "क्या आप यह तस्वीर हटाना चाहते हैं?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(imageId);
      setMessage("");

      await deleteGalleryImage(imageId);

      setGalleryImages((previousImages) =>
        previousImages.filter(
          (image) => image.id !== imageId
        )
      );

      setMessage(
        "तस्वीर सफलतापूर्वक हटा दी गई।"
      );
    } catch (error) {
      console.error(
        "Delete gallery image error:",
        error
      );

      setMessage(
        error?.message ||
          "तस्वीर हटाई नहीं जा सकी।"
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <section className="admin-section">
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="admin-section-header">
        <div>
          <h2>🖼️ Gallery</h2>

          <p>
            संस्था की गतिविधियों की तस्वीरें यहाँ
            जोड़ें और हटाएँ।
          </p>
        </div>

        <span className="admin-count">
          {galleryImages.length}
        </span>
      </div>

      {/* ======================================
          MESSAGE
      ====================================== */}

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      {/* ======================================
          UPLOAD FORM
      ====================================== */}

      <form
        className="admin-form"
        onSubmit={handleUpload}
      >
        {/* IMAGE INPUT */}

        <div className="form-group">
          <label>
            तस्वीरें चुनें
          </label>

          <p className="form-help">
            प्रत्येक image अधिकतम 15 MB
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            required
          />
        </div>

        {/* SELECTED IMAGE PREVIEW */}

        {selectedImages.length > 0 && (
          <div className="selected-images">
            <h4>
              चुनी गई तस्वीरें (
              {selectedImages.length})
            </h4>

            <div className="image-preview-grid">
              {selectedImages.map(
                (file, index) => {
                  const preview =
                    URL.createObjectURL(file);

                  return (
                    <div
                      className="image-preview"
                      key={`${file.name}-${file.lastModified}-${index}`}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                      />

                      <span>
                        Image {index + 1}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* CAPTION */}

        <div className="form-group">
          <label>
            तस्वीर का विवरण
          </label>

          <input
            type="text"
            placeholder="जैसे - संस्था का वृक्षारोपण अभियान"
            value={caption}
            onChange={(event) =>
              setCaption(event.target.value)
            }
          />
        </div>

        {/* SUBMIT */}

        <button
          type="submit"
          className="primary-button"
          disabled={uploading}
        >
          {uploading
            ? "तस्वीरें अपलोड हो रही हैं..."
            : "➕ तस्वीरें जोड़ें"}
        </button>
      </form>

      {/* ======================================
          GALLERY LIST
      ====================================== */}

      <div className="admin-list-section">
        <h2>
          गैलरी की तस्वीरें
        </h2>

        {loading ? (
          <div className="admin-empty">
            <p>
              गैलरी लोड हो रही है...
            </p>
          </div>
        ) : galleryImages.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">
              🖼️
            </div>

            <h3>
              अभी कोई तस्वीर नहीं है।
            </h3>

            <p>
              ऊपर से तस्वीरें अपलोड करें।
            </p>
          </div>
        ) : (
          <div className="gallery-admin-grid">
            {galleryImages.map((image) => (
              <article
                key={image.id}
                className="gallery-admin-card"
              >
                {/* IMAGE */}

                <img
                  src={
                    image.imageUrl ||
                    image.image ||
                    image.photo ||
                    ""
                  }
                  alt={
                    image.caption ||
                    "Gallery image"
                  }
                  className="gallery-admin-image"
                />

                {/* CONTENT */}

                <div className="gallery-admin-content">
                  <p>
                    {image.caption ||
                      "संस्था की गतिविधि"}
                  </p>

                  {/* DELETE */}

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(
                        image.id
                      )
                    }
                    disabled={
                      deleteLoading ===
                      image.id
                    }
                  >
                    {deleteLoading ===
                    image.id
                      ? "हटा रहे हैं..."
                      : "🗑️ तस्वीर हटाएँ"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Gallery;