import { useEffect, useState } from "react";

import { getEvents } from "../../firebase/events.js";
import { getGalleryImages } from "../../firebase/gallery.js";
import {
  getMembershipApplications,
} from "../../firebase/volunteer.js";


// ==================================================
// DASHBOARD
// ==================================================

function Dashboard({
  setActiveSection,
}) {

  // ================================================
  // STATS
  // ================================================

  const [stats, setStats] = useState({
    memberships: 0,
    pendingMemberships: 0,
    events: 0,
    gallery: 0,
  });


  const [loading, setLoading] =
    useState(true);


  // ================================================
  // LOAD DASHBOARD DATA
  // ================================================

  useEffect(() => {

    let mounted = true;


    async function loadDashboard() {

      try {

        // ==========================================
        // EVENTS
        // ==========================================

        const eventsData =
          await getEvents();

        const events =
          Array.isArray(eventsData)
            ? eventsData
            : [];


        // ==========================================
        // GALLERY
        // ==========================================

        let galleryData = [];

        try {

          galleryData =
            await getGalleryImages();

        } catch (galleryError) {

          console.error(
            "Gallery count error:",
            galleryError
          );

        }


        const gallery =
          Array.isArray(galleryData)
            ? galleryData
            : [];


        // ==========================================
        // MEMBERSHIPS
        // ==========================================

        let membershipData = [];

        try {

          membershipData =
            await getMembershipApplications();

        } catch (membershipError) {

          console.error(
            "Membership count error:",
            membershipError
          );

        }


        const memberships =
          Array.isArray(membershipData)
            ? membershipData
            : [];


        // ==========================================
        // PENDING MEMBERSHIPS
        // ==========================================

        const pendingMemberships =
          memberships.filter(
            (item) =>
              item.membershipStatus ===
              "pending"
          );


        // ==========================================
        // COUNTS
        // ==========================================

        const eventCount =
          events.length;


        const galleryCount =
          gallery.length;


        const membershipCount =
          pendingMemberships.length;


        const pendingCount =
          pendingMemberships.length;


        // ==========================================
        // DEBUG
        // ==========================================

        console.log(
          "=========================="
        );

        console.log(
          "EVENT COUNT:",
          eventCount
        );

        console.log(
          "GALLERY COUNT:",
          galleryCount
        );

        console.log(
          "MEMBERSHIP COUNT:",
          membershipCount
        );

        console.log(
          "PENDING COUNT:",
          pendingCount
        );

        console.log(
          "=========================="
        );


        // ==========================================
        // UPDATE STATE
        // ==========================================

        if (!mounted) return;


        setStats({
          memberships:
            membershipCount,

          pendingMemberships:
            pendingCount,

          events:
            eventCount,

          gallery:
            galleryCount,
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


  // ================================================
  // NAVIGATION FUNCTION
  // ================================================

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


  // ================================================
  // UI
  // ================================================

  return (

    <section className="admin-dashboard">


      {/* ==========================================
          HERO
      ========================================== */}

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


        <div className="dashboard-hero-logo">

          <img
            src="/logo.png"
            alt="युवा सारथी"
          />

        </div>

      </div>


      {/* ==========================================
          STATS
      ========================================== */}

      {loading ? (

        <div className="admin-loading">

          <div className="loading-spinner"></div>

          <span>
            Dashboard लोड हो रहा है...
          </span>

        </div>

      ) : (

        <div className="dashboard-stats">


          {/* =====================================
              MEMBERSHIP REQUEST
          ===================================== */}

          <div
            className="stat-card"
            onClick={() =>
              openSection("membership")
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
              Membership Requests
            </h3>


            <strong>
              {stats.memberships}
            </strong>


            <p>
              Pending सदस्यता आवेदन
            </p>

          </div>


          {/* =====================================
              PENDING
          ===================================== */}

          <div
            className="stat-card"
            onClick={() =>
              openSection("membership")
            }
            role="button"
            tabIndex={0}
          >

            <div className="stat-card-top">

              <div className="stat-icon pending">
                📋
              </div>


              <span className="stat-badge">
                PENDING
              </span>

            </div>


            <h3>
              Pending आवेदन
            </h3>


            <strong>
              {stats.pendingMemberships}
            </strong>


            <p>
              समीक्षा के लिए लंबित
            </p>

          </div>


          {/* =====================================
              EVENTS
          ===================================== */}

          <div
            className="stat-card"
            onClick={() =>
              openSection("events")
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


          {/* =====================================
              GALLERY
          ===================================== */}

          <div
            className="stat-card"
            onClick={() =>
              openSection("gallery")
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

        </div>

      )}


      {/* ==========================================
          QUICK ACTIONS
      ========================================== */}

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


          {/* =====================================
              MEMBERSHIP
          ===================================== */}

          <button
            type="button"
            className="quick-action-card"
            onClick={() =>
              openSection("membership")
            }
          >

            <div className="quick-action-icon">
              📋
            </div>


            <div>

              <h3>
                Membership
              </h3>


              <p>
                नए सदस्यता आवेदनों की
                समीक्षा करें।
              </p>

            </div>


            <span className="quick-arrow">
              →
            </span>

          </button>


          {/* =====================================
              EVENTS
          ===================================== */}

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


          {/* =====================================
              GALLERY
          ===================================== */}

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


        </div>

      </div>


      {/* ==========================================
          NGO INFO
      ========================================== */}

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