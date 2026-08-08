import { useState } from "react";

import {
  adminLogin,
  adminLogout,
  sendAdminResetLink,
} from "../firebase/auth.js";

import { createEvent } from "../firebase/events.js";

import {
  addGalleryImages,
  getGalleryImages,
  deleteGalleryImage,
} from "../firebase/gallery.js";

import "./AdminLogin.css";

const ADMIN_EMAIL = "adityaverma1325@gmail.com";

function AdminLogin() {
  // ==========================================
  // LOGIN STATES
  // ==========================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // EVENT STATES
  // ==========================================

  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const [eventImage, setEventImage] = useState(null);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventMessage, setEventMessage] = useState("");

  // ==========================================
  // GALLERY STATES
  // ==========================================

  const [selectedImages, setSelectedImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [imageCaption, setImageCaption] = useState("");
  const [galleryMessage, setGalleryMessage] = useState("");

  const [galleryImages, setGalleryImages] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // ==========================================
  // LOGIN
  // ==========================================

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setResetMessage("");

    if (
      email.trim().toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {
      setError(
        "केवल अधिकृत एडमिन ही लॉगिन कर सकता है।"
      );
      return;
    }

    try {
      setLoading(true);

      const result = await adminLogin(
        email.trim(),
        password
      );

      try {
        const images = await getGalleryImages();
        setGalleryImages(images);
      } catch (galleryError) {
        console.error(
          "Gallery load error:",
          galleryError
        );
      }

      setUser(result.user);
    } catch (loginError) {
      console.error("Login error:", loginError);

      setError("ईमेल या पासवर्ड गलत है।");
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // PASSWORD RESET
  // ==========================================

  async function handlePasswordReset() {
    const resetEmail = email.trim().toLowerCase();

    if (
      resetEmail !==
      ADMIN_EMAIL.toLowerCase()
    ) {
      setError(
        "पहले अधिकृत एडमिन ईमेल डालें।"
      );
      return;
    }

    try {
      setError("");
      setResetMessage("");

      await sendAdminResetLink(resetEmail);

      setResetMessage(
        "पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।"
      );
    } catch (err) {
      console.error(
        "Password reset error:",
        err
      );

      setError(
        `रीसेट में समस्या आई: ${err.code || "Unknown error"}`
      );
    }
  }

  // ==========================================
  // EVENT COVER IMAGE SELECT
  // ==========================================

  function handleEventImageSelect(event) {
    const file =
      event.target.files?.[0] || null;

    setEventImage(file);
    setEventMessage("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setEventImage(null);

      setEventMessage(
        "कृपया केवल तस्वीर चुनें।"
      );

      event.target.value = "";
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setEventImage(null);

      setEventMessage(
        "Cover image 15 MB से छोटी होनी चाहिए।"
      );

      event.target.value = "";
      return;
    }

    setEventMessage(
      `Cover image चुनी गई: ${file.name}`
    );
  }

  // ==========================================
  // CREATE EVENT
  // ==========================================

  async function handleCreateEvent(event) {
    event.preventDefault();

    setEventMessage("");

    if (!eventImage) {
      setEventMessage(
        "कृपया कार्यक्रम की Cover Image चुनें।"
      );
      return;
    }

    try {
      setEventLoading(true);

      await createEvent({
        title: eventTitle.trim(),
        date: eventDate,
        location: eventLocation.trim(),
        description: eventDescription.trim(),
        imageFile: eventImage,
      });

      // Reset form
      setEventTitle("");
      setEventDate("");
      setEventLocation("");
      setEventDescription("");
      setEventImage(null);

      // File input reset
      event.target.reset();

      setEventMessage(
        "कार्यक्रम और Cover Image सफलतापूर्वक जोड़ दिए गए! 🎉"
      );
    } catch (error) {
      console.error(
        "Create event error:",
        error
      );

      setEventMessage(
        error.message ||
          "कार्यक्रम नहीं जोड़ा जा सका। फिर से कोशिश करें।"
      );
    } finally {
      setEventLoading(false);
    }
  }

  // ==========================================
  // LOAD GALLERY
  // ==========================================

  async function loadGalleryImages() {
    try {
      const images =
        await getGalleryImages();

      setGalleryImages(images);
    } catch (error) {
      console.error(
        "Gallery load error:",
        error
      );

      setGalleryMessage(
        "गैलरी की तस्वीरें लोड नहीं हो सकीं।"
      );
    }
  }

  // ==========================================
  // MULTIPLE IMAGE SELECT
  // ==========================================

  function handleImageSelect(event) {
    const files = Array.from(
      event.target.files || []
    );

    setSelectedImages(files);
    setGalleryMessage("");

    if (files.length === 0) {
      return;
    }

    // Check every image
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setSelectedImages([]);

        setGalleryMessage(
          `${file.name} तस्वीर नहीं है।`
        );

        event.target.value = "";
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        setSelectedImages([]);

        setGalleryMessage(
          `${file.name} 15 MB से बड़ी है।`
        );

        event.target.value = "";
        return;
      }
    }

    setGalleryMessage(
      `${files.length} तस्वीरें चुनी गई हैं।`
    );
  }

  // ==========================================
  // MULTIPLE GALLERY IMAGE UPLOAD
  // ==========================================

  async function handleAddGalleryImages(event) {
    event.preventDefault();

    setGalleryMessage("");

    if (selectedImages.length === 0) {
      setGalleryMessage(
        "पहले तस्वीरें चुनें।"
      );
      return;
    }

    try {
      setGalleryLoading(true);

      const totalImages =
        selectedImages.length;

      await addGalleryImages(
        selectedImages,
        imageCaption
      );

      // Reset
      setSelectedImages([]);
      setImageCaption("");

      event.target.reset();

      // Refresh gallery
      await loadGalleryImages();

      setGalleryMessage(
        `${totalImages} तस्वीरें सफलतापूर्वक अपलोड हो गईं! 🎉`
      );
    } catch (error) {
      console.error(
        "Gallery upload error:",
        error
      );

      setGalleryMessage(
        error.message ||
          "तस्वीरें अपलोड नहीं हो सकीं।"
      );
    } finally {
      setGalleryLoading(false);
    }
  }

  // ==========================================
  // DELETE GALLERY IMAGE
  // ==========================================

  async function handleDeleteGalleryImage(
    imageId
  ) {
    const confirmDelete =
      window.confirm(
        "क्या आप यह तस्वीर हटाना चाहते हैं?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleteLoading(imageId);
      setGalleryMessage("");

      await deleteGalleryImage(imageId);

      setGalleryImages((previous) =>
        previous.filter(
          (image) =>
            image.id !== imageId
        )
      );

      setGalleryMessage(
        "तस्वीर सफलतापूर्वक हटा दी गई।"
      );
    } catch (error) {
      console.error(
        "Delete gallery image error:",
        error
      );

      setGalleryMessage(
        error.message ||
          "तस्वीर हटाई नहीं जा सकी।"
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  async function handleLogout() {
    try {
      await adminLogout();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    setUser(null);
    setGalleryImages([]);
    setSelectedImages([]);

    window.location.hash = "";
  }

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================

  if (user) {
    return (
      <main className="admin-page">
        <section className="admin-card">

          <p className="admin-label">
            YUVA SARATHI NGO
          </p>

          <h1>
            एडमिन डैशबोर्ड
          </h1>

          <p>
            स्वागत है, {user.email}
          </p>

          {/* =================================
              EVENT
          ================================= */}

          <h2>
            नया कार्यक्रम जोड़ें
          </h2>

          <form
            className="event-form"
            onSubmit={handleCreateEvent}
          >

            {/* EVENT TITLE */}

            <input
              type="text"
              placeholder="कार्यक्रम का नाम"
              value={eventTitle}
              onChange={(event) =>
                setEventTitle(
                  event.target.value
                )
              }
              required
            />

            {/* EVENT DATE */}

            <input
              type="date"
              value={eventDate}
              onChange={(event) =>
                setEventDate(
                  event.target.value
                )
              }
              required
            />

            {/* LOCATION */}

            <input
              type="text"
              placeholder="कार्यक्रम का स्थान"
              value={eventLocation}
              onChange={(event) =>
                setEventLocation(
                  event.target.value
                )
              }
              required
            />

            {/* DESCRIPTION */}

            <textarea
              placeholder="कार्यक्रम का विवरण"
              value={eventDescription}
              onChange={(event) =>
                setEventDescription(
                  event.target.value
                )
              }
              required
            />

            {/* COVER IMAGE */}

            <label>
              कार्यक्रम की Cover Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleEventImageSelect
              }
              required
            />

            {eventImage && (
              <p>
                चुनी गई image:{" "}
                <strong>
                  {eventImage.name}
                </strong>
              </p>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={eventLoading}
            >
              {eventLoading
                ? "कार्यक्रम अपलोड हो रहा है..."
                : "कार्यक्रम जोड़ें"}
            </button>

          </form>

          {eventMessage && (
            <p className="event-message">
              {eventMessage}
            </p>
          )}

          {/* =================================
              GALLERY
          ================================= */}

          <h2>
            गैलरी में तस्वीरें जोड़ें
          </h2>

          <form
            className="event-form"
            onSubmit={
              handleAddGalleryImages
            }
          >

            {/* MULTIPLE FILE SELECT */}

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImageSelect
              }
              required
            />

            {selectedImages.length >
              0 && (
              <p>
                <strong>
                  {selectedImages.length}
                </strong>{" "}
                तस्वीरें चुनी गई हैं।
              </p>
            )}

            {/* CAPTION */}

            <input
              type="text"
              placeholder="तस्वीर का विवरण"
              value={imageCaption}
              onChange={(event) =>
                setImageCaption(
                  event.target.value
                )
              }
            />

            {/* UPLOAD */}

            <button
              type="submit"
              disabled={
                galleryLoading
              }
            >
              {galleryLoading
                ? "तस्वीरें अपलोड हो रही हैं..."
                : "तस्वीरें जोड़ें"}
            </button>

          </form>

          {galleryMessage && (
            <p className="event-message">
              {galleryMessage}
            </p>
          )}

          {/* =================================
              GALLERY LIST
          ================================= */}

          <h2>
            गैलरी की तस्वीरें
          </h2>

          <div className="admin-gallery-list">

            {galleryImages.length ===
            0 ? (
              <p>
                अभी कोई तस्वीर नहीं है।
              </p>
            ) : (
              galleryImages.map(
                (image) => (
                  <div
                    key={image.id}
                    className="admin-gallery-item"
                  >

                    <img
                      src={
                        image.imageUrl
                      }
                      alt={
                        image.caption ||
                        "Gallery image"
                      }
                    />

                    <div className="admin-gallery-info">

                      <p>
                        {image.caption ||
                          "संस्था की गतिविधि"}
                      </p>

                      <button
                        type="button"
                        className="delete-gallery-button"
                        onClick={() =>
                          handleDeleteGalleryImage(
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

                  </div>
                )
              )
            )}

          </div>

          {/* =================================
              LOGOUT
          ================================= */}

          <button
            type="button"
            onClick={
              handleLogout
            }
          >
            लॉग आउट
          </button>

        </section>
      </main>
    );
  }

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  return (
    <main className="admin-page">

      <form
        className="admin-card"
        onSubmit={handleLogin}
      >

        <p className="admin-label">
          YUVA SARATHI NGO
        </p>

        <h1>
          एडमिन लॉगिन
        </h1>

        <p className="admin-subtitle">
          वेबसाइट को मैनेज करने के लिए
          लॉगिन करें।
        </p>

        {/* EMAIL */}

        <label>
          ईमेल
        </label>

        <input
          type="email"
          placeholder="एडमिन ईमेल"
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value
            )
          }
          required
        />

        {/* PASSWORD */}

        <label>
          पासवर्ड
        </label>

        <input
          type="password"
          placeholder="पासवर्ड डालें"
          value={password}
          onChange={(event) =>
            setPassword(
              event.target.value
            )
          }
          required
        />

        {/* ERROR */}

        {error && (
          <p className="admin-error">
            {error}
          </p>
        )}

        {/* LOGIN */}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "लॉगिन हो रहा है..."
            : "लॉगिन करें"}
        </button>

        {/* RESET */}

        <button
          type="button"
          className="reset-button"
          onClick={
            handlePasswordReset
          }
        >
          पासवर्ड भूल गए?
          रीसेट करें
        </button>

        {resetMessage && (
          <p className="reset-message">
            {resetMessage}
          </p>
        )}

        {/* BACK */}

        <a
          className="back-home"
          href="#"
        >
          ← वेबसाइट पर वापस जाएँ
        </a>

      </form>

    </main>
  );
}

export default AdminLogin;