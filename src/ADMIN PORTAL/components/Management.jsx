import { useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase/firebase.js";

import {
  deleteEvent,
  getEvents,
} from "../../firebase/events.js";

import {
  deleteGalleryImage,
  getGalleryImages,
} from "../../firebase/gallery.js";


// =====================================================
// MANAGEMENT CENTER
// =====================================================

function Management() {
  const [activeTab, setActiveTab] = useState("members");

  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [gallery, setGallery] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [deletingId, setDeletingId] = useState("");

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // =====================================================
  // LOAD DATA
  // =====================================================

  async function loadManagementData(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setMessage("");

      // -----------------------------------------------
      // MEMBERS
      // -----------------------------------------------

      const memberSnapshot = await getDocs(
        collection(db, "memberships")
      );

      const memberData = memberSnapshot.docs.map(
        (item) => ({
          id: item.id,
          ...item.data(),
        })
      );


      // -----------------------------------------------
      // EVENTS
      // -----------------------------------------------

      const eventData = await getEvents();


      // -----------------------------------------------
      // GALLERY
      // -----------------------------------------------

      const galleryData = await getGalleryImages();


      // -----------------------------------------------
      // UPDATE STATE
      // -----------------------------------------------

      setMembers(memberData);
      setEvents(eventData || []);
      setGallery(galleryData || []);

    } catch (err) {
      console.error(
        "Management load error:",
        err
      );

      setError(
        err?.message ||
        "Management data load नहीं हो सका।"
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    let active = true;

    async function fetchInitialData() {
      try {
        // ---------------------------------------------
        // MEMBERS
        // ---------------------------------------------

        const memberSnapshot = await getDocs(
          collection(db, "memberships")
        );

        if (!active) return;

        const memberData =
          memberSnapshot.docs.map(
            (item) => ({
              id: item.id,
              ...item.data(),
            })
          );


        // ---------------------------------------------
        // EVENTS
        // ---------------------------------------------

        const eventData =
          await getEvents();

        if (!active) return;


        // ---------------------------------------------
        // GALLERY
        // ---------------------------------------------

        const galleryData =
          await getGalleryImages();

        if (!active) return;


        // ---------------------------------------------
        // SET DATA
        // ---------------------------------------------

        setMembers(
          memberData
        );

        setEvents(
          eventData || []
        );

        setGallery(
          galleryData || []
        );

      } catch (err) {
        if (!active) return;

        console.error(
          "Management initial load error:",
          err
        );

        setError(
          err?.message ||
          "Management data load नहीं हो सका।"
        );

      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchInitialData();

    return () => {
      active = false;
    };
  }, []);


  // =====================================================
  // DELETE MEMBER
  // =====================================================

  async function removeMember(memberId) {
    if (!memberId) {
      return;
    }

    const confirmDelete =
      window.confirm(
        "क्या आप इस सदस्यता आवेदन को स्थायी रूप से हटाना चाहते हैं?\n\nयह कार्रवाई वापस नहीं की जा सकती।"
      );

    if (!confirmDelete) {
      return;
    }


    try {
      setDeletingId(memberId);
      setError("");
      setMessage("");


      await deleteDoc(
        doc(
          db,
          "memberships",
          memberId
        )
      );


      // Remove from screen immediately
      setMembers(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== memberId
          )
      );


      setMessage(
        "सदस्यता आवेदन सफलतापूर्वक हटा दिया गया।"
      );

    } catch (err) {
      console.error(
        "Member delete error:",
        err
      );

      setError(
        err?.message ||
        "सदस्य को हटाया नहीं जा सका।"
      );

    } finally {
      setDeletingId("");
    }
  }


  // =====================================================
  // DELETE EVENT
  // =====================================================

  async function removeEvent(eventId) {
    if (!eventId) {
      return;
    }

    const confirmDelete =
      window.confirm(
        "क्या आप इस कार्यक्रम को हटाना चाहते हैं?\n\nकार्यक्रम और उससे जुड़ी जानकारी हट जाएगी।"
      );

    if (!confirmDelete) {
      return;
    }


    try {
      setDeletingId(eventId);
      setError("");
      setMessage("");


      await deleteEvent(
        eventId
      );


      setEvents(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== eventId
          )
      );


      setMessage(
        "कार्यक्रम सफलतापूर्वक हटा दिया गया।"
      );

    } catch (err) {
      console.error(
        "Event delete error:",
        err
      );

      setError(
        err?.message ||
        "कार्यक्रम हटाया नहीं जा सका।"
      );

    } finally {
      setDeletingId("");
    }
  }


  // =====================================================
  // DELETE GALLERY IMAGE
  // =====================================================

  async function removeGalleryImage(imageId) {
    if (!imageId) {
      return;
    }

    const confirmDelete =
      window.confirm(
        "क्या आप इस तस्वीर को हटाना चाहते हैं?\n\nयह कार्रवाई वापस नहीं की जा सकती।"
      );

    if (!confirmDelete) {
      return;
    }


    try {
      setDeletingId(imageId);
      setError("");
      setMessage("");


      await deleteGalleryImage(
        imageId
      );


      setGallery(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== imageId
          )
      );


      setMessage(
        "तस्वीर सफलतापूर्वक हटा दी गई।"
      );

    } catch (err) {
      console.error(
        "Gallery delete error:",
        err
      );

      setError(
        err?.message ||
        "तस्वीर हटाई नहीं जा सकी।"
      );

    } finally {
      setDeletingId("");
    }
  }


  // =====================================================
  // SEARCH
  // =====================================================

  const searchText =
    search
      .trim()
      .toLowerCase();


  const filteredMembers =
    members.filter(
      (member) => {
        if (!searchText) {
          return true;
        }

        return (
          String(
            member.fullName || ""
          )
            .toLowerCase()
            .includes(searchText) ||

          String(
            member.whatsappNumber || ""
          )
            .toLowerCase()
            .includes(searchText) ||

          String(
            member.district || ""
          )
            .toLowerCase()
            .includes(searchText)
        );
      }
    );


  const filteredEvents =
    events.filter(
      (event) => {
        if (!searchText) {
          return true;
        }

        return (
          String(
            event.title || ""
          )
            .toLowerCase()
            .includes(searchText) ||

          String(
            event.location || ""
          )
            .toLowerCase()
            .includes(searchText)
        );
      }
    );


  const filteredGallery =
    gallery.filter(
      (image) => {
        if (!searchText) {
          return true;
        }

        return String(
          image.caption ||
          image.title ||
          ""
        )
          .toLowerCase()
          .includes(searchText);
      }
    );


  // =====================================================
  // STATUS
  // =====================================================

  function getStatus(status) {
    if (status === "approved") {
      return (
        <span className="management-status approved">
          स्वीकृत
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="management-status rejected">
          अस्वीकृत
        </span>
      );
    }

    return (
      <span className="management-status pending">
        लंबित
      </span>
    );
  }


  // =====================================================
  // CHANGE TAB
  // =====================================================

  function changeTab(tab) {
    setActiveTab(tab);
    setSearch("");
    setMessage("");
    setError("");
  }


  // =====================================================
  // REFRESH
  // =====================================================

  async function handleRefresh() {
    await loadManagementData(true);
  }


  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="management-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="management-header">

        <div>

          <span className="panel-eyebrow">
            ADMIN MANAGEMENT
          </span>

          <h1>
            Management Center
          </h1>

          <p>
            संस्था के सदस्य, कार्यक्रम और
            गैलरी सामग्री यहां से manage करें।
          </p>

        </div>


        <div className="management-header-icon">
          ⚙️
        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="management-summary">

        {/* MEMBERS */}

        <div className="management-summary-card">

          <span>
            👥
          </span>

          <div>

            <strong>
              {members.length}
            </strong>

            <small>
              सदस्य आवेदन
            </small>

          </div>

        </div>


        {/* EVENTS */}

        <div className="management-summary-card">

          <span>
            🎉
          </span>

          <div>

            <strong>
              {events.length}
            </strong>

            <small>
              कार्यक्रम
            </small>

          </div>

        </div>


        {/* GALLERY */}

        <div className="management-summary-card">

          <span>
            🖼️
          </span>

          <div>

            <strong>
              {gallery.length}
            </strong>

            <small>
              गैलरी तस्वीरें
            </small>

          </div>

        </div>

      </div>


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {message && (
        <div className="management-message success">
          ✅ {message}
        </div>
      )}


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="management-message error">
          ⚠️ {error}
        </div>
      )}


      {/* =================================================
          MAIN PANEL
      ================================================= */}

      <div className="management-panel">


        {/* =================================================
            TABS
        ================================================= */}

        <div className="management-tabs">

          <button
            type="button"
            className={
              activeTab === "members"
                ? "management-tab active"
                : "management-tab"
            }
            onClick={() =>
              changeTab("members")
            }
          >
            👥 Members
          </button>


          <button
            type="button"
            className={
              activeTab === "events"
                ? "management-tab active"
                : "management-tab"
            }
            onClick={() =>
              changeTab("events")
            }
          >
            🎉 Events
          </button>


          <button
            type="button"
            className={
              activeTab === "gallery"
                ? "management-tab active"
                : "management-tab"
            }
            onClick={() =>
              changeTab("gallery")
            }
          >
            🖼️ Gallery
          </button>

        </div>


        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="management-toolbar">

          <div className="management-search">

            <span>
              🔎
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder={
                activeTab === "members"
                  ? "नाम, WhatsApp या जिला खोजें..."
                  : activeTab === "events"
                  ? "कार्यक्रम या स्थान खोजें..."
                  : "तस्वीर का caption खोजें..."
              }
            />

          </div>


          <button
            type="button"
            className="management-refresh"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing
              ? "⟳ Loading..."
              : "↻ Refresh"}
          </button>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="management-loading">

            <div className="loading-spinner"></div>

            <p>
              Management data लोड हो रहा है...
            </p>

          </div>

        ) : (

          <>
            {/* =================================================
                MEMBERS
            ================================================= */}

            {activeTab === "members" && (

              <div className="management-table-wrapper">

                {filteredMembers.length === 0 ? (

                  <div className="management-empty">

                    <div>
                      👥
                    </div>

                    <h3>
                      कोई सदस्य आवेदन नहीं मिला
                    </h3>

                    <p>
                      अभी कोई matching record उपलब्ध नहीं है।
                    </p>

                  </div>

                ) : (

                  <table className="management-table">

                    <thead>

                      <tr>
                        <th>
                          नाम
                        </th>

                        <th>
                          WhatsApp
                        </th>

                        <th>
                          जिला
                        </th>

                        <th>
                          उम्र
                        </th>

                        <th>
                          स्थिति
                        </th>

                        <th>
                          Action
                        </th>
                      </tr>

                    </thead>


                    <tbody>

                      {filteredMembers.map(
                        (member) => (

                          <tr
                            key={member.id}
                          >

                            <td>
                              <strong>
                                {member.fullName ||
                                  "नाम उपलब्ध नहीं"}
                              </strong>
                            </td>


                            <td>
                              {member.whatsappNumber ||
                                "-"}
                            </td>


                            <td>
                              {member.district ||
                                "-"}
                            </td>


                            <td>
                              {member.age ||
                                "-"}
                            </td>


                            <td>
                              {getStatus(
                                member.membershipStatus
                              )}
                            </td>


                            <td>

                              <button
                                type="button"
                                className="management-delete-button"
                                disabled={
                                  deletingId ===
                                  member.id
                                }
                                onClick={() =>
                                  removeMember(
                                    member.id
                                  )
                                }
                              >
                                {deletingId ===
                                member.id
                                  ? "हटा रहा..."
                                  : "🗑️ Remove"}
                              </button>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                )}

              </div>

            )}


            {/* =================================================
                EVENTS
            ================================================= */}

            {activeTab === "events" && (

              <div className="management-event-grid">

                {filteredEvents.length === 0 ? (

                  <div className="management-empty">

                    <div>
                      🎉
                    </div>

                    <h3>
                      कोई कार्यक्रम नहीं मिला
                    </h3>

                    <p>
                      अभी कोई कार्यक्रम उपलब्ध नहीं है।
                    </p>

                  </div>

                ) : (

                  filteredEvents.map(
                    (event) => (

                      <div
                        className="management-event-card"
                        key={event.id}
                      >

                        {/* EVENT IMAGE */}

                        <div className="management-event-image">

                          {event.image ? (

                            <img
                              src={event.image}
                              alt={
                                event.title ||
                                "कार्यक्रम"
                              }
                            />

                          ) : (

                            <div className="no-image">
                              🎉
                            </div>

                          )}

                        </div>


                        {/* EVENT CONTENT */}

                        <div className="management-event-content">

                          <span>
                            {event.date ||
                              "तारीख उपलब्ध नहीं"}
                          </span>


                          <h3>
                            {event.title ||
                              "कार्यक्रम"}
                          </h3>


                          <p>
                            📍{" "}
                            {event.location ||
                              "स्थान उपलब्ध नहीं"}
                          </p>


                          <button
                            type="button"
                            className="management-delete-button full"
                            disabled={
                              deletingId ===
                              event.id
                            }
                            onClick={() =>
                              removeEvent(
                                event.id
                              )
                            }
                          >
                            {deletingId ===
                            event.id
                              ? "हटा रहा..."
                              : "🗑️ कार्यक्रम Remove करें"}
                          </button>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            )}


            {/* =================================================
                GALLERY
            ================================================= */}

            {activeTab === "gallery" && (

              <div className="management-gallery-grid">

                {filteredGallery.length === 0 ? (

                  <div className="management-empty">

                    <div>
                      🖼️
                    </div>

                    <h3>
                      कोई तस्वीर नहीं मिली
                    </h3>

                    <p>
                      अभी कोई gallery image उपलब्ध नहीं है।
                    </p>

                  </div>

                ) : (

                  filteredGallery.map(
                    (image) => (

                      <div
                        className="management-gallery-card"
                        key={image.id}
                      >

                        {/* IMAGE */}

                        <div className="management-gallery-image">

                          <img
                            src={
                              image.imageUrl ||
                              image.image ||
                              image.photo ||
                              ""
                            }
                            alt={
                              image.caption ||
                              "Gallery"
                            }
                          />

                        </div>


                        {/* CONTENT */}

                        <div className="management-gallery-content">

                          <p>
                            {image.caption ||
                              image.title ||
                              "संस्था की गतिविधि"}
                          </p>


                          <button
                            type="button"
                            className="management-delete-button full"
                            disabled={
                              deletingId ===
                              image.id
                            }
                            onClick={() =>
                              removeGalleryImage(
                                image.id
                              )
                            }
                          >
                            {deletingId ===
                            image.id
                              ? "हटा रहा..."
                              : "🗑️ Photo Remove करें"}
                          </button>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            )}

          </>

        )}

      </div>


      {/* =================================================
          FOOTER INFO
      ================================================= */}

      <div className="admin-panel management-info-panel">

        <div>

          <span className="panel-eyebrow">
            ADMIN CONTROL
          </span>

          <h2>
            सुरक्षित Management Center
          </h2>

          <p>
            यहां से सदस्य आवेदन, कार्यक्रम और
            संस्था की gallery photos को manage किया जा सकता है।
          </p>

        </div>

        <div className="management-info-icon">
          🛡️
        </div>

      </div>

    </section>
  );
}


export default Management;