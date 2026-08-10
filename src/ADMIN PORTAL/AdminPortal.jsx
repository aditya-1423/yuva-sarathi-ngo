import { useState } from "react";

import Management from "./components/Management.jsx";

import AdminNavbar from "./components/AdminNavbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Membership from "./components/Membership.jsx";
import Events from "./components/Events.jsx";
import Gallery from "./components/Gallery.jsx";

import "./admin.css";

function AdminPortal({ user, onLogout }) {
  const [activeSection, setActiveSection] =
    useState("dashboard");

  // ==========================================
  // AGAR ADMIN USER NAHI MILA
  // ==========================================

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>
            Admin session नहीं मिली
          </h2>

          <button
            onClick={onLogout}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            वापस लॉगिन करें
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-portal">

      {/* ======================================
          ADMIN NAVBAR
      ====================================== */}

      <AdminNavbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
      />


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="admin-content">

        {/* ====================================
            DASHBOARD
        ==================================== */}

        {activeSection === "dashboard" && (
          <Dashboard
            setActiveSection={setActiveSection}
          />
        )}

        {activeSection === "management" && (
  <Management />
)}


        {/* ====================================
            MEMBERSHIP
        ==================================== */}

        {activeSection === "membership" && (
          <Membership
            user={user}
          />
        )}


        {/* ====================================
            EVENTS
        ==================================== */}

        {activeSection === "events" && (
          <Events />
        )}


        {/* ====================================
            GALLERY
        ==================================== */}

        {activeSection === "gallery" && (
          <Gallery />
        )}

      </main>

    </div>
  );
}

export default AdminPortal;