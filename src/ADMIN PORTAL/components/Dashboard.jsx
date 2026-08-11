import { useEffect, useState } from "react";

import { getEvents } from "../../firebase/events.js";

import {
  getGalleryImages,
} from "../../firebase/gallery.js";

import {
  getMembershipApplications,
} from "../../firebase/volunteer.js";

import {
  getContactMessages,
  deleteContactMessage,
} from "../../firebase/contact.js";


function Dashboard({
  setActiveSection,
}) {

  // ==========================================
  // DASHBOARD STATS
  // ==========================================

  const [stats, setStats] = useState({
    memberships: 0,
    events: 0,
    gallery: 0,
    contacts: 0,
  });


  // ==========================================
  // CONTACT MESSAGES
  // ==========================================

  const [contactMessages, setContactMessages] =
    useState([]);


  // ==========================================
  // LOADING
  // ==========================================

  const [loading, setLoading] =
    useState(true);


  // ==========================================
  // DELETE LOADING
  // ==========================================

  const [deletingId, setDeletingId] =
    useState(null);


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {

    let mounted = true;


    async function loadDashboard() {

      try {

        const [
          eventsData,
          galleryData,
          membershipData,
          contactData,
        ] = await Promise.all([

          // EVENTS
          getEvents().catch((error) => {

            console.error(
              "Events count error:",
              error
            );

            return [];
          }),


          // GALLERY
          getGalleryImages().catch((error) => {

            console.error(
              "Gallery count error:",
              error
            );

            return [];
          }),


          // MEMBERSHIPS
          getMembershipApplications().catch(
            (error) => {

              console.error(
                "Membership count error:",
                error
              );

              return [];
            }
          ),


          // CONTACT MESSAGES
          getContactMessages().catch(
            (error) => {

              console.error(
                "Contact messages count error:",
                error
              );

              return [];
            }
          ),

        ]);


        if (!mounted) {
          return;
        }


        // ======================================
        // SAFE ARRAYS
        // ======================================

        const events =
          Array.isArray(eventsData)
            ? eventsData
            : [];


        const gallery =
          Array.isArray(galleryData)
            ? galleryData
            : [];


        const memberships =
          Array.isArray(membershipData)
            ? membershipData
            : [];


        const contacts =
          Array.isArray(contactData)
            ? contactData
            : [];


        // ======================================
        // PENDING MEMBERSHIPS
        // ======================================

        const pendingMemberships =
          memberships.filter(
            (item) =>
              item?.membershipStatus ===
              "pending"
          );


        // ======================================
        // SAVE CONTACT DATA
        // ======================================

        setContactMessages(contacts);


        // ======================================
        // SET STATS
        // ======================================

        setStats({

          memberships:
            pendingMemberships.length,

          events:
            events.length,

          gallery:
            gallery.length,

          contacts:
            contacts.length,

        });

      } catch (error) {

        console.error(
          "Dashboard data load error:",
          error
        );

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    }


    loadDashboard();


    return () => {

      mounted = false;

    };

  }, []);


  // ==========================================
  // OPEN SECTION
  // ==========================================

  function openSection(section) {

    if (
      typeof setActiveSection !==
      "function"
    ) {

      console.error(
        "setActiveSection function नहीं मिली।"
      );

      return;
    }


    setActiveSection(section);

  }


  // ==========================================
  // KEYBOARD CARD
  // ==========================================

  function handleCardKeyDown(
    event,
    section
  ) {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();

      openSection(section);

    }

  }


  // ==========================================
  // DELETE CONTACT MESSAGE
  // ==========================================

  async function handleDeleteContact(id) {

    if (!id) {
      return;
    }


    const confirmed =
      window.confirm(
        "क्या आप यह contact message delete करना चाहते हैं?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(id);


      await deleteContactMessage(id);


      // Remove from UI
      setContactMessages(
        (prev) =>
          prev.filter(
            (item) =>
              item.id !== id
          )
      );


      // Update count
      setStats(
        (prev) => ({
          ...prev,
          contacts:
            Math.max(
              0,
              prev.contacts - 1
            ),
        })
      );


    } catch (error) {

      console.error(
        "Contact message delete failed:",
        error
      );


      alert(
        "Message delete नहीं हो पाया। कृपया दोबारा कोशिश करें।"
      );

    } finally {

      setDeletingId(null);

    }

  }


  // ==========================================
  // FORMAT DATE
  // ==========================================

  function formatDate(timestamp) {

    if (!timestamp) {
      return "अभी";
    }


    try {

      if (
        typeof timestamp.toDate ===
        "function"
      ) {

        return timestamp
          .toDate()
          .toLocaleString("hi-IN");

      }


      return new Date(
        timestamp
      ).toLocaleString("hi-IN");

    } catch {

      return "अभी";

    }

  }


  // ==========================================
  // RETURN
  // ==========================================

  return (

    <section className="admin-dashboard">


      {/* ======================================
          HERO
      ====================================== */}

      <div className="dashboard-hero">

        <div className="dashboard-hero-content">

          <span className="dashboard-eyebrow">
            ADMIN CONTROL PANEL
          </span>


          <h1>
            Dashboard
          </h1>


          <p>
            युवा सारथी सेवा संस्था छत्तीसगढ़
            के प्रशासनिक नियंत्रण केंद्र में
            आपका स्वागत है।
          </p>

        </div>

      </div>



      {/* ======================================
          LOADING
      ====================================== */}

      {loading ? (

        <div className="admin-loading">

          <div className="loading-spinner"></div>

          <span>
            Dashboard लोड हो रहा है...
          </span>

        </div>

      ) : (

        <div className="dashboard-stats">


          {/* ==================================
              MEMBERSHIP
          ================================== */}

          <div
            className="stat-card"
            onClick={() =>
              openSection("membership")
            }
            onKeyDown={(event) =>
              handleCardKeyDown(
                event,
                "membership"
              )
            }
            role="button"
            tabIndex={0}
          >

            <div className="stat-card-top">

              <div className="stat-icon">
                👥
              </div>

              <span className="stat-badge">
                REQUESTS
              </span>

            </div>


            <h3>
              सदस्यता आवेदन
            </h3>


            <strong>
              {stats.memberships}
            </strong>


            <p>
              Pending सदस्यता आवेदन
            </p>

          </div>



          {/* ==================================
              EVENTS
          ================================== */}

          <div
            className="stat-card"
            onClick={() =>
              openSection("events")
            }
            onKeyDown={(event) =>
              handleCardKeyDown(
                event,
                "events"
              )
            }
            role="button"
            tabIndex={0}
          >

            <div className="stat-card-top">

              <div className="stat-icon events">
                🎉
              </div>

              <span className="stat-badge">
                EVENTS
              </span>

            </div>


            <h3>
              कार्यक्रम
            </h3>


            <strong>
              {stats.events}
            </strong>


            <p>
              कुल कार्यक्रम
            </p>

          </div>



          {/* ==================================
              GALLERY
          ================================== */}

          <div
            className="stat-card"
            onClick={() =>
              openSection("gallery")
            }
            onKeyDown={(event) =>
              handleCardKeyDown(
                event,
                "gallery"
              )
            }
            role="button"
            tabIndex={0}
          >

            <div className="stat-card-top">

              <div className="stat-icon gallery">
                🖼️
              </div>

              <span className="stat-badge">
                GALLERY
              </span>

            </div>


            <h3>
              Gallery Images
            </h3>


            <strong>
              {stats.gallery}
            </strong>


            <p>
              कुल गैलरी तस्वीरें
            </p>

          </div>



          {/* ==================================
              CONTACT
          ================================== */}

          <div
            className="stat-card"
            onClick={() =>
              openSection("contact")
            }
            onKeyDown={(event) =>
              handleCardKeyDown(
                event,
                "contact"
              )
            }
            role="button"
            tabIndex={0}
          >

            <div className="stat-card-top">

              <div className="stat-icon">
                📩
              </div>

              <span className="stat-badge">
                MESSAGES
              </span>

            </div>


            <h3>
              संपर्क संदेश
            </h3>


            <strong>
              {stats.contacts}
            </strong>


            <p>
              प्राप्त contact messages
            </p>

          </div>

        </div>

      )}



      {/* ======================================
          QUICK ACTIONS
      ====================================== */}

      <div className="admin-panel">

        <div className="panel-header">

          <div>

            <span className="panel-eyebrow">
              MANAGEMENT
            </span>


            <h2>
              Quick Actions
            </h2>

          </div>


          <div className="panel-icon">
            ⚡
          </div>

        </div>



        <div className="quick-actions-grid">


          {/* MANAGEMENT */}

          <button
            type="button"
            className="quick-action-card management-action"
            onClick={() =>
              openSection("management")
            }
          >

            <div className="quick-action-icon">
              ⚙️
            </div>


            <div>

              <h3>
                Management
              </h3>


              <p>
                Members, Events और Gallery
                manage करें।
              </p>

            </div>


            <span className="quick-arrow">
              →
            </span>

          </button>



          {/* EVENTS */}

          <button
            type="button"
            className="quick-action-card"
            onClick={() =>
              openSection("events")
            }
          >

            <div className="quick-action-icon">
              🎉
            </div>


            <div>

              <h3>
                Events
              </h3>


              <p>
                संस्था के कार्यक्रम
                manage करें।
              </p>

            </div>


            <span className="quick-arrow">
              →
            </span>

          </button>



          {/* GALLERY */}

          <button
            type="button"
            className="quick-action-card"
            onClick={() =>
              openSection("gallery")
            }
          >

            <div className="quick-action-icon">
              🖼️
            </div>


            <div>

              <h3>
                Gallery
              </h3>


              <p>
                संस्था की तस्वीरें
                manage करें।
              </p>

            </div>


            <span className="quick-arrow">
              →
            </span>

          </button>



          {/* CONTACT */}

          <button
            type="button"
            className="quick-action-card"
            onClick={() =>
              openSection("contact")
            }
          >

            <div className="quick-action-icon">
              📩
            </div>


            <div>

              <h3>
                Contact Messages
              </h3>


              <p>
                लोगों के भेजे हुए संदेश
                देखें और manage करें।
              </p>

            </div>


            <span className="quick-arrow">
              →
            </span>

          </button>

        </div>

      </div>



      {/* ======================================
          CONTACT MESSAGES
      ====================================== */}

      <div className="admin-panel">

        <div className="panel-header">

          <div>

            <span className="panel-eyebrow">
              CONTACT
            </span>


            <h2>
              नवीनतम संदेश
            </h2>

          </div>


          <div className="panel-icon">
            📩
          </div>

        </div>



        {contactMessages.length === 0 ? (

          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >

            अभी कोई contact message नहीं है।

          </div>

        ) : (

          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >

            {contactMessages
              .slice(0, 5)
              .map((item) => (

                <div
                  key={item.id}
                  style={{
                    border:
                      "1px solid #e5e7eb",
                    borderRadius:
                      "16px",
                    padding: "20px",
                    background:
                      "#ffffff",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: "15px",
                      alignItems:
                        "flex-start",
                    }}
                  >

                    <div>

                      <h3
                        style={{
                          margin: 0,
                          fontSize:
                            "18px",
                          fontWeight:
                            "700",
                        }}
                      >
                        {item.name}
                      </h3>


                      <p
                        style={{
                          margin:
                            "6px 0",
                          color:
                            "#6b7280",
                        }}
                      >
                        📧 {item.email}
                      </p>


                      <p
                        style={{
                          margin:
                            "6px 0",
                          color:
                            "#6b7280",
                        }}
                      >
                        📱 {item.phone}
                      </p>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteContact(
                          item.id
                        )
                      }
                      disabled={
                        deletingId ===
                        item.id
                      }
                      style={{
                        border: "none",
                        borderRadius:
                          "10px",
                        padding:
                          "9px 14px",
                        background:
                          "#fee2e2",
                        color:
                          "#dc2626",
                        fontWeight:
                          "600",
                        cursor:
                          "pointer",
                      }}
                    >

                      {deletingId ===
                      item.id
                        ? "Deleting..."
                        : "🗑️ Delete"}

                    </button>

                  </div>


                  <div
                    style={{
                      marginTop:
                        "14px",
                      padding:
                        "14px",
                      background:
                        "#f9fafb",
                      borderRadius:
                        "12px",
                      lineHeight:
                        "1.7",
                    }}
                  >

                    {item.message}

                  </div>


                  <p
                    style={{
                      marginTop:
                        "12px",
                      fontSize:
                        "13px",
                      color:
                        "#9ca3af",
                    }}
                  >

                    {formatDate(
                      item.createdAt
                    )}

                  </p>

                </div>

              ))}

          </div>

        )}

      </div>



      {/* ======================================
          NGO INFORMATION
      ====================================== */}

      <div className="admin-panel ngo-info-panel">

        <div className="ngo-info-left">

          <h2>
            युवा सारथी सेवा संस्था छत्तीसगढ़
          </h2>


          <p>
            शिक्षा, स्वास्थ्य, स्वच्छता,
            पर्यावरण संरक्षण, सामाजिक समानता
            एवं युवा उत्थान के लिए कार्यरत
            संस्था का प्रशासनिक पोर्टल।
          </p>

        </div>


        <div className="ngo-motto">

          <span>
            संस्था का उद्देश्य
          </span>


          <strong>
            #स्वार्थी नहीं सारथी बनो#
          </strong>

        </div>

      </div>

    </section>

  );
}


export default Dashboard;