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

import {
  getMembershipApplications,
  approveMembership,
  rejectMembership,
} from "../firebase/volunteer.js";

import "./AdminLogin.css";

const ADMIN_EMAIL = "adityaverma1325@gmail.com";

const MAX_EVENT_IMAGES = 5;

const MAX_FILE_SIZE = 15 * 1024 * 1024;


// =====================================================
// ADMIN LOGIN
// =====================================================

function AdminLogin() {

  // ===================================================
  // LOGIN
  // ===================================================

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null);

  const [error, setError] = useState("");

  const [resetMessage, setResetMessage] = useState("");

  const [loading, setLoading] = useState(false);


  // ===================================================
  // ACTIVE SECTION
  // ===================================================

  const [activeSection, setActiveSection] =
    useState("requests");


  // ===================================================
  // EVENTS
  // ===================================================

  const [eventTitle, setEventTitle] = useState("");

  const [eventDate, setEventDate] = useState("");

  const [eventLocation, setEventLocation] = useState("");

  const [eventDescription, setEventDescription] =
    useState("");

  const [eventImages, setEventImages] = useState([]);

  const [eventLoading, setEventLoading] = useState(false);

  const [eventMessage, setEventMessage] = useState("");

  const [events, setEvents] = useState([]);

  const [eventDeleteLoading, setEventDeleteLoading] =
    useState(null);


  // ===================================================
  // GALLERY
  // ===================================================

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


  // ===================================================
  // MEMBERSHIP REQUESTS
  // ===================================================

  const [membershipApplications, setMembershipApplications] =
    useState([]);

  const [membershipLoading, setMembershipLoading] =
    useState(false);

  const [membershipActionLoading, setMembershipActionLoading] =
    useState(null);

  const [membershipMessage, setMembershipMessage] =
    useState("");


  // ===================================================
  // LOAD EVENTS
  // ===================================================

  async function loadEvents() {

    try {

      const eventList = await getEvents();

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


  // ===================================================
  // LOAD GALLERY
  // ===================================================

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


  // ===================================================
  // LOAD MEMBERSHIP REQUESTS
  // ===================================================

  async function loadMembershipApplications() {

    try {

      setMembershipLoading(true);

      const applications =
        await getMembershipApplications();

      // केवल pending requests
      const pendingApplications =
        applications.filter(
          (application) =>
            application.membershipStatus ===
            "pending"
        );

      setMembershipApplications(
        pendingApplications
      );

    } catch (error) {

      console.error(
        "Membership applications load error:",
        error
      );

      setMembershipMessage(
        "सदस्यता अनुरोध लोड नहीं हो सके।"
      );

    } finally {

      setMembershipLoading(false);

    }
  }


  // ===================================================
  // LOGIN
  // ===================================================

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


      // Load gallery
      try {

        await loadGalleryImages();

      } catch (galleryError) {

        console.error(
          "Gallery loading error:",
          galleryError
        );

      }


      // Load events
      try {

        await loadEvents();

      } catch (eventError) {

        console.error(
          "Events loading error:",
          eventError
        );

      }


      // Load membership requests
      try {

        await loadMembershipApplications();

      } catch (membershipError) {

        console.error(
          "Membership loading error:",
          membershipError
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


  // ===================================================
  // PASSWORD RESET
  // ===================================================

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


  // ===================================================
  // EVENT IMAGE SELECT
  // ===================================================

  function handleEventImagesSelect(event) {

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
          `${file.name} 15 MB से बड़ी है।`
        );

        event.target.value = "";

        return;
      }
    }


    setEventImages(files);

    setEventMessage(
      `${files.length} तस्वीरें चुनी गई हैं।`
    );
  }


  // ===================================================
  // CREATE EVENT
  // ===================================================

  async function handleCreateEvent(event) {

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


      setEventTitle("");

      setEventDate("");

      setEventLocation("");

      setEventDescription("");

      setEventImages([]);

      event.target.reset();


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


  // ===================================================
  // DELETE EVENT
  // ===================================================

  async function handleDeleteEvent(eventId) {

    if (!eventId) {
      return;
    }


    const confirmDelete =
      window.confirm(
        "क्या आप यह पूरा कार्यक्रम हटाना चाहते हैं?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      setEventDeleteLoading(eventId);

      setEventMessage("");

      await deleteEvent(eventId);


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

      setEventDeleteLoading(null);

    }
  }


  // ===================================================
  // GALLERY SELECT
  // ===================================================

  function handleImageSelect(event) {

    const files =
      Array.from(
        event.target.files || []
      );

    setSelectedImages(files);

    setGalleryMessage("");


    if (files.length === 0) {
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


  // ===================================================
  // ADD GALLERY
  // ===================================================

  async function handleAddGalleryImages(event) {

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


  // ===================================================
  // DELETE GALLERY IMAGE
  // ===================================================

  async function handleDeleteGalleryImage(imageId) {

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


  // ===================================================
  // APPROVE MEMBERSHIP
  // ===================================================

  async function handleApproveMembership(
    application
  ) {

    if (!application?.id) {
      return;
    }


    const confirmApprove =
      window.confirm(
        `क्या आप "${application.fullName}" का सदस्यता आवेदन स्वीकार करना चाहते हैं?`
      );


    if (!confirmApprove) {
      return;
    }


    try {

      setMembershipActionLoading(
        application.id
      );

      setMembershipMessage("");


      await approveMembership(
        application.id,
        user?.email || ADMIN_EMAIL
      );


      // तुरंत pending list से हटाओ
      setMembershipApplications(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== application.id
          )
      );


      setMembershipMessage(
        `${application.fullName} का सदस्यता आवेदन स्वीकार कर लिया गया। ✅`
      );

    } catch (error) {

      console.error(
        "Approve membership error:",
        error
      );

      setMembershipMessage(
        error.message ||
        "सदस्यता आवेदन स्वीकार नहीं किया जा सका।"
      );

    } finally {

      setMembershipActionLoading(null);

    }
  }


  // ===================================================
  // REJECT MEMBERSHIP
  // ===================================================

  async function handleRejectMembership(
    application
  ) {

    if (!application?.id) {
      return;
    }


    // सिर्फ confirmation
    const confirmReject =
      window.confirm(
        `क्या आप "${application.fullName}" का सदस्यता आवेदन Reject करना चाहते हैं?`
      );


    if (!confirmReject) {
      return;
    }


    try {

      setMembershipActionLoading(
        application.id
      );

      setMembershipMessage("");


      // Reason नहीं पूछा जाएगा
      await rejectMembership(
        application.id,
        "",
        user?.email || ADMIN_EMAIL
      );


      // तुरंत pending list से हटाओ
      setMembershipApplications(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== application.id
          )
      );


      setMembershipMessage(
        `${application.fullName} का आवेदन Reject कर दिया गया।`
      );

    } catch (error) {

      console.error(
        "Reject membership error:",
        error
      );

      setMembershipMessage(
        error.message ||
        "सदस्यता आवेदन Reject नहीं किया जा सका।"
      );

    } finally {

      setMembershipActionLoading(null);

    }
  }


  // ===================================================
  // LOGOUT
  // ===================================================

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

    setMembershipApplications([]);

    setActiveSection("requests");

    window.location.hash = "";
  }


  // ===================================================
  // ADMIN DASHBOARD
  // ===================================================

  if (user) {

    return (

      <main className="admin-page">

        <section className="admin-card">

          {/* =========================================
              HEADER
          ========================================= */}

          <p className="admin-label">
            YUVA SARATHI NGO
          </p>

          <h1>
            एडमिन डैशबोर्ड
          </h1>

          <p>
            स्वागत है, {user.email}
          </p>


          {/* =========================================
              SECTION NAVIGATION
          ========================================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(180px,1fr))",
              gap: "12px",
              marginTop: "25px",
              marginBottom: "30px",
            }}
          >

            <button
              type="button"
              onClick={() =>
                setActiveSection("requests")
              }
              style={{
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                background:
                  activeSection === "requests"
                    ? "#166534"
                    : "#e5e7eb",
                color:
                  activeSection === "requests"
                    ? "#fff"
                    : "#111827",
              }}
            >
              📋 सदस्यता अनुरोध
              {membershipApplications.length > 0 &&
                ` (${membershipApplications.length})`}
            </button>


            <button
              type="button"
              onClick={() =>
                setActiveSection("events")
              }
              style={{
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                background:
                  activeSection === "events"
                    ? "#166534"
                    : "#e5e7eb",
                color:
                  activeSection === "events"
                    ? "#fff"
                    : "#111827",
              }}
            >
              🎉 कार्यक्रम
            </button>


            <button
              type="button"
              onClick={() =>
                setActiveSection("gallery")
              }
              style={{
                padding: "14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontWeight: "700",
                background:
                  activeSection === "gallery"
                    ? "#166534"
                    : "#e5e7eb",
                color:
                  activeSection === "gallery"
                    ? "#fff"
                    : "#111827",
              }}
            >
              🖼️ Gallery
            </button>

          </div>


          {/* =====================================================
              SECTION 1 — MEMBERSHIP REQUESTS
          ===================================================== */}

          {activeSection === "requests" && (

            <div>

              <h2>
                📋 सदस्यता अनुरोध
              </h2>

              <p
                style={{
                  color: "#666",
                  marginBottom: "20px",
                }}
              >
                यहाँ केवल Pending सदस्यता आवेदन दिखाई देंगे।
              </p>


              {membershipMessage && (

                <p className="event-message">
                  {membershipMessage}
                </p>

              )}


              {membershipLoading ? (

                <p>
                  सदस्यता अनुरोध लोड हो रहे हैं...
                </p>

              ) : membershipApplications.length === 0 ? (

                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    background: "#f9fafb",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <p>
                    📭 अभी कोई Pending सदस्यता अनुरोध नहीं है।
                  </p>
                </div>

              ) : (

                <div>

                  {membershipApplications.map(
                    (application) => (

                      <div
                        key={application.id}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "15px",
                          padding: "20px",
                          marginBottom: "18px",
                          background: "#fff",
                        }}
                      >

                        <h3
                          style={{
                            marginBottom: "15px",
                          }}
                        >
                          {application.fullName}
                        </h3>


                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit,minmax(220px,1fr))",
                            gap: "10px",
                          }}
                        >

                          <p>
                            <strong>
                              WhatsApp:
                            </strong>{" "}
                            {application.whatsappNumber ||
                              "-"}
                          </p>


                          <p>
                            <strong>
                              Email:
                            </strong>{" "}
                            {application.email ||
                              "-"}
                          </p>


                          <p>
                            <strong>
                              उम्र:
                            </strong>{" "}
                            {application.age ||
                              "-"}
                          </p>


                          <p>
                            <strong>
                              लिंग:
                            </strong>{" "}
                            {application.gender ||
                              "-"}
                          </p>


                          <p>
                            <strong>
                              जिला:
                            </strong>{" "}
                            {application.district ||
                              "-"}
                          </p>


                          <p>
                            <strong>
                              गांव / शहर:
                            </strong>{" "}
                            {application.village ||
                              "-"}
                          </p>


                          <p>
                            <strong>
                              व्यवसाय:
                            </strong>{" "}
                            {application.occupation ||
                              "-"}
                          </p>

                        </div>


                        <p
                          style={{
                            marginTop: "12px",
                          }}
                        >
                          <strong>
                            पूरा पता:
                          </strong>{" "}
                          {application.address ||
                            "-"}
                        </p>


                        <p
                          style={{
                            marginTop: "12px",
                          }}
                        >
                          <strong>
                            संस्था से जुड़ने का उद्देश्य:
                          </strong>{" "}
                          {application.reason ||
                            "-"}
                        </p>


                        {/* ACTION BUTTONS */}

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginTop: "20px",
                          }}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              handleApproveMembership(
                                application
                              )
                            }
                            disabled={
                              membershipActionLoading ===
                              application.id
                            }
                            style={{
                              background:
                                "#16a34a",
                              color: "#fff",
                              border: "none",
                              padding:
                                "11px 18px",
                              borderRadius:
                                "8px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "700",
                            }}
                          >

                            {membershipActionLoading ===
                            application.id
                              ? "प्रक्रिया चल रही है..."
                              : "✅ Accept"}

                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleRejectMembership(
                                application
                              )
                            }
                            disabled={
                              membershipActionLoading ===
                              application.id
                            }
                            style={{
                              background:
                                "#dc2626",
                              color: "#fff",
                              border: "none",
                              padding:
                                "11px 18px",
                              borderRadius:
                                "8px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "700",
                            }}
                          >
                            ❌ Reject
                          </button>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

          )}


          {/* =====================================================
              SECTION 2 — EVENTS
          ===================================================== */}

          {activeSection === "events" && (

            <div>

              <h2>
                🎉 कार्यक्रम / Karyakram
              </h2>


              {/* ADD EVENT */}

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
                  value={
                    eventDescription
                  }
                  onChange={(event) =>
                    setEventDescription(
                      event.target.value
                    )
                  }
                  required
                />


                <label>
                  कार्यक्रम की तस्वीरें
                </label>


                <p className="text-sm">
                  अधिकतम 5 तस्वीरें • प्रत्येक image
                  अधिकतम 15 MB
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
                        display:
                          "grid",
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
                              key={`${file.name}-${index}`}
                            >

                              <img
                                src={preview}
                                alt={`Preview ${
                                  index + 1
                                }`}
                                style={{
                                  width:
                                    "100%",
                                  height:
                                    "100px",
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


              {/* EVENT LIST */}

              <h2
                style={{
                  marginTop: "35px",
                }}
              >
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
                          {
                            eventItem.description
                          }
                        </p>


                        {eventItem.galleryImages &&
                          eventItem.galleryImages
                            .length > 0 && (

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


                        <button
                          type="button"
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

            </div>

          )}


          {/* =====================================================
              SECTION 3 — GALLERY
          ===================================================== */}

          {activeSection === "gallery" && (

            <div>

              <h2>
                🖼️ Gallery
              </h2>


              {/* ADD GALLERY */}

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
                  value={
                    imageCaption
                  }
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


              {/* GALLERY LIST */}

              <h2
                style={{
                  marginTop: "35px",
                }}
              >
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


                        <div
                          className="admin-gallery-info"
                        >

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

            </div>

          )}


          {/* =====================================================
              LOGOUT
          ===================================================== */}

          <button
  type="button"
  onClick={handleLogout}
  className="admin-floating-logout"
>
  🚪 लॉग आउट
</button>

        </section>

      </main>

    );
  }


  // =====================================================
  // LOGIN PAGE
  // =====================================================

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