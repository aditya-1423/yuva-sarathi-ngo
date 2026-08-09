import { useState } from "react";

import {
  adminLogin,
  adminLogout,
  sendAdminResetLink,
} from "../firebase/auth.js";

import {
  createEvent,
  getEvents,
  deleteEvent,
} from "../firebase/events.js";

import {
  addGalleryImages,
  getGalleryImages,
  deleteGalleryImage,
} from "../firebase/gallery.js";

import "./AdminLogin.css";

const ADMIN_EMAIL =
  "adityaverma1325@gmail.com";

const MAX_EVENT_IMAGES = 5;

const MAX_FILE_SIZE =
  15 * 1024 * 1024;


// =====================================
// ADMIN LOGIN
// =====================================

function AdminLogin() {

  // =====================================
  // LOGIN STATE
  // =====================================

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [user, setUser] =
    useState(null);

  const [error, setError] =
    useState("");

  const [resetMessage, setResetMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // =====================================
  // EVENT STATE
  // =====================================

  const [eventTitle, setEventTitle] =
    useState("");

  const [eventDate, setEventDate] =
    useState("");

  const [eventLocation, setEventLocation] =
    useState("");

  const [eventDescription, setEventDescription] =
    useState("");

  const [eventImages, setEventImages] =
    useState([]);

  const [eventLoading, setEventLoading] =
    useState(false);

  const [eventMessage, setEventMessage] =
    useState("");

  // Existing events
  const [events, setEvents] =
    useState([]);

  // Event delete loading
  const [eventDeleteLoading, setEventDeleteLoading] =
    useState(null);


  // =====================================
  // GALLERY STATE
  // =====================================

  const [selectedImages, setSelectedImages] =
    useState([]);

  const [galleryLoading, setGalleryLoading] =
    useState(false);

  const [imageCaption, setImageCaption] =
    useState("");

  const [galleryMessage, setGalleryMessage] =
    useState("");

  const [galleryImages, setGalleryImages] =
    useState([]);

  const [deleteLoading, setDeleteLoading] =
    useState(null);


  // =====================================
  // LOAD EVENTS
  // =====================================

  async function loadEvents() {

    try {

      const eventList =
        await getEvents();

      setEvents(eventList);

    } catch (error) {

      console.error(
        "Events load error:",
        error
      );

      setEventMessage(
        "कार्यक्रम लोड नहीं हो सके।"
      );
    }
  }


  // =====================================
  // LOGIN
  // =====================================

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

      const result =
        await adminLogin(
          email.trim(),
          password
        );


      // ================================
      // LOAD GALLERY
      // ================================

      try {

        const images =
          await getGalleryImages();

        setGalleryImages(images);

      } catch (galleryError) {

        console.error(
          "Gallery load error:",
          galleryError
        );

      }


      // ================================
      // LOAD EVENTS
      // ================================

      try {

        const eventList =
          await getEvents();

        setEvents(eventList);

      } catch (eventError) {

        console.error(
          "Events load error:",
          eventError
        );

      }


      setUser(result.user);

    } catch (loginError) {

      console.error(
        "Login error:",
        loginError
      );

      setError(
        "ईमेल या पासवर्ड गलत है।"
      );

    } finally {

      setLoading(false);

    }
  }


  // =====================================
  // RESET PASSWORD
  // =====================================

  async function handlePasswordReset() {

    const resetEmail =
      email.trim().toLowerCase();

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

      await sendAdminResetLink(
        resetEmail
      );

      setResetMessage(
        "पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।"
      );

    } catch (err) {

      console.error(
        "Password reset error:",
        err
      );

      setError(
        `रीसेट में समस्या आई: ${
          err.code ||
          "Unknown error"
        }`
      );
    }
  }


  // =====================================
  // EVENT IMAGE SELECT
  // MAX 5 / EACH 15MB
  // =====================================

  function handleEventImagesSelect(
    event
  ) {

    const files =
      Array.from(
        event.target.files || []
      );

    setEventMessage("");

    if (files.length === 0) {

      setEventImages([]);

      return;
    }

    if (
      files.length >
      MAX_EVENT_IMAGES
    ) {

      setEventImages([]);

      setEventMessage(
        "एक कार्यक्रम में अधिकतम 5 तस्वीरें ही चुन सकते हैं।"
      );

      event.target.value = "";

      return;
    }

    for (const file of files) {

      if (
        !file.type ||
        !file.type.startsWith("image/")
      ) {

        setEventImages([]);

        setEventMessage(
          `${file.name} image नहीं है।`
        );

        event.target.value = "";

        return;
      }

      if (
        file.size >
        MAX_FILE_SIZE
      ) {

        setEventImages([]);

        setEventMessage(
          `${file.name} 15 MB से बड़ी है। हर image की limit 15 MB है।`
        );

        event.target.value = "";

        return;
      }
    }

    setEventImages(files);

    setEventMessage(
      `${files.length} तस्वीरें चुनी गई हैं। हर image 15 MB के अंदर है।`
    );
  }


  // =====================================
  // CREATE EVENT
  // =====================================

  async function handleCreateEvent(
    event
  ) {

    event.preventDefault();

    setEventMessage("");

    if (
      eventImages.length === 0
    ) {

      setEventMessage(
        "कृपया कम से कम 1 कार्यक्रम की तस्वीर चुनें।"
      );

      return;
    }

    try {

      setEventLoading(true);

      await createEvent({

        title:
          eventTitle.trim(),

        date:
          eventDate,

        location:
          eventLocation.trim(),

        description:
          eventDescription.trim(),

        imageFiles:
          eventImages,

      });


      // Clear form

      setEventTitle("");
      setEventDate("");
      setEventLocation("");
      setEventDescription("");
      setEventImages([]);

      event.target.reset();


      // Reload event list

      await loadEvents();


      setEventMessage(
        "कार्यक्रम और उसकी सभी तस्वीरें सफलतापूर्वक जोड़ दी गईं! 🎉"
      );

    } catch (error) {

      console.error(
        "Create event error:",
        error
      );

      setEventMessage(
        error.message ||
        "कार्यक्रम नहीं जोड़ा जा सका।"
      );

    } finally {

      setEventLoading(false);

    }
  }


  // =====================================
  // DELETE EVENT
  // =====================================

  async function handleDeleteEvent(
    eventId
  ) {

    if (!eventId) {
      return;
    }


    const confirmDelete =
      window.confirm(
        "क्या आप यह पूरा कार्यक्रम हटाना चाहते हैं?\n\nइससे कार्यक्रम Firestore से हट जाएगा।"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      setEventDeleteLoading(
        eventId
      );

      setEventMessage("");


      // Delete from Firestore

      await deleteEvent(
        eventId
      );


      // Remove from screen immediately

      setEvents(
        (previousEvents) =>
          previousEvents.filter(
            (eventItem) =>
              eventItem.id !== eventId
          )
      );


      setEventMessage(
        "कार्यक्रम सफलतापूर्वक हटा दिया गया।"
      );

    } catch (error) {

      console.error(
        "Delete event error:",
        error
      );

      setEventMessage(
        error.message ||
        "कार्यक्रम हटाया नहीं जा सका।"
      );

    } finally {

      setEventDeleteLoading(
        null
      );

    }
  }


  // =====================================
  // LOAD GALLERY
  // =====================================

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


  // =====================================
  // GALLERY SELECT
  // =====================================

  function handleImageSelect(
    event
  ) {

    const files =
      Array.from(
        event.target.files || []
      );

    setSelectedImages(files);
    setGalleryMessage("");

    if (
      files.length === 0
    ) {

      return;
    }


    for (const file of files) {

      if (
        !file.type ||
        !file.type.startsWith("image/")
      ) {

        setSelectedImages([]);

        setGalleryMessage(
          `${file.name} तस्वीर नहीं है।`
        );

        event.target.value = "";

        return;
      }


      if (
        file.size >
        MAX_FILE_SIZE
      ) {

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


  // =====================================
  // ADD GALLERY
  // =====================================

  async function handleAddGalleryImages(
    event
  ) {

    event.preventDefault();

    setGalleryMessage("");

    if (
      selectedImages.length === 0
    ) {

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


      setSelectedImages([]);
      setImageCaption("");


      event.target.reset();


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


  // =====================================
  // DELETE GALLERY
  // =====================================

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

      setDeleteLoading(
        imageId
      );

      setGalleryMessage("");


      await deleteGalleryImage(
        imageId
      );


      setGalleryImages(
        (previous) =>
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


  // =====================================
  // LOGOUT
  // =====================================

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

    setEventImages([]);

    setEvents([]);

    window.location.hash = "";
  }


  // =====================================
  // ADMIN DASHBOARD
  // =====================================

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
              ADD EVENT
          ================================= */}

          <h2>
            नया कार्यक्रम जोड़ें
          </h2>


          <form
            className="event-form"
            onSubmit={
              handleCreateEvent
            }
          >

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


            {/* EVENT IMAGES */}

            <label>
              कार्यक्रम की तस्वीरें
            </label>


            <p className="text-sm">
              अधिकतम 5 तस्वीरें •
              प्रत्येक image अधिकतम 15 MB
            </p>


            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleEventImagesSelect
              }
              required
            />


            {/* SELECTED EVENT IMAGES */}

            {eventImages.length > 0 && (

              <div>

                <p>

                  <strong>
                    {eventImages.length}
                  </strong>{" "}
                  तस्वीरें चुनी गई हैं।

                </p>


                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit,minmax(100px,1fr))",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >

                  {eventImages.map(
                    (file, index) => {

                      const preview =
                        URL.createObjectURL(
                          file
                        );


                      return (

                        <div
                          key={
                            `${file.name}-${index}`
                          }
                        >

                          <img
                            src={preview}
                            alt={`Preview ${
                              index + 1
                            }`}
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit:
                                "cover",
                              borderRadius:
                                "10px",
                            }}
                          />


                          <small>

                            {index === 0
                              ? "Cover"
                              : `Image ${
                                  index + 1
                                }`}

                          </small>

                        </div>

                      );

                    }
                  )}

                </div>

              </div>

            )}


            <button
              type="submit"
              disabled={
                eventLoading
              }
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
              EVENT LIST + DELETE
          ================================= */}

          <h2>
            जोड़े गए कार्यक्रम
          </h2>


          <div className="admin-event-list">

            {events.length === 0 ? (

              <p>
                अभी कोई कार्यक्रम नहीं है।
              </p>

            ) : (

              events.map(
                (eventItem) => (

                  <div
                    key={
                      eventItem.id
                    }
                    className="admin-event-item"
                    style={{
                      border:
                        "1px solid #ddd",
                      borderRadius:
                        "12px",
                      padding:
                        "15px",
                      marginBottom:
                        "15px",
                    }}
                  >

                    {/* COVER IMAGE */}

                    {eventItem.image && (

                      <img
                        src={
                          eventItem.image
                        }
                        alt={
                          eventItem.title ||
                          "कार्यक्रम"
                        }
                        style={{
                          width:
                            "100%",
                          maxHeight:
                            "220px",
                          objectFit:
                            "cover",
                          borderRadius:
                            "10px",
                          marginBottom:
                            "10px",
                        }}
                      />

                    )}


                    {/* EVENT DETAILS */}

                    <h3>
                      {eventItem.title}
                    </h3>


                    <p>
                      <strong>
                        तारीख:
                      </strong>{" "}
                      {eventItem.date}
                    </p>


                    <p>
                      <strong>
                        स्थान:
                      </strong>{" "}
                      {eventItem.location}
                    </p>


                    <p>
                      <strong>
                        विवरण:
                      </strong>{" "}
                      {eventItem.description}
                    </p>


                    {/* IMAGE COUNT */}

                    {eventItem.galleryImages &&
                      eventItem.galleryImages.length >
                        0 && (

                        <p>
                          📷{" "}
                          {
                            eventItem
                              .galleryImages
                              .length
                          }{" "}
                          तस्वीरें
                        </p>

                      )}


                    {/* DELETE EVENT BUTTON */}

                    <button
                      type="button"
                      className="delete-gallery-button"
                      onClick={() =>
                        handleDeleteEvent(
                          eventItem.id
                        )
                      }
                      disabled={
                        eventDeleteLoading ===
                        eventItem.id
                      }
                      style={{
                        marginTop:
                          "10px",
                        background:
                          "#dc2626",
                        color:
                          "#fff",
                        border:
                          "none",
                        padding:
                          "10px 15px",
                        borderRadius:
                          "8px",
                        cursor:
                          "pointer",
                      }}
                    >

                      {eventDeleteLoading ===
                      eventItem.id

                        ? "कार्यक्रम हटा रहे हैं..."

                        : "🗑️ कार्यक्रम हटाएँ"}

                    </button>

                  </div>

                )
              )

            )}

          </div>


          {/* =================================
              GALLERY ADD
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

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImageSelect
              }
              required
            />


            {selectedImages.length > 0 && (

              <p>

                <strong>
                  {selectedImages.length}
                </strong>{" "}
                तस्वीरें चुनी गई हैं।

              </p>

            )}


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

            {galleryImages.length === 0 ? (

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


  // =====================================
  // LOGIN PAGE
  // =====================================

  return (

    <main className="admin-page">

      <form
        className="admin-card"
        onSubmit={
          handleLogin
        }
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


        {error && (

          <p className="admin-error">
            {error}
          </p>

        )}


        <button
          type="submit"
          disabled={loading}
        >

          {loading
            ? "लॉगिन हो रहा है..."
            : "लॉगिन करें"}

        </button>


        <button
          type="button"
          className="reset-button"
          onClick={
            handlePasswordReset
          }
        >
          पासवर्ड भूल गए? रीसेट करें
        </button>


        {resetMessage && (

          <p className="reset-message">
            {resetMessage}
          </p>

        )}


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