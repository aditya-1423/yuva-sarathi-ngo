import { useState } from "react";

import Management from "./components/Management.jsx";
import AdminNavbar from "./components/AdminNavbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Membership from "./components/Membership.jsx";
import Events from "./components/Events.jsx";
import Gallery from "./components/Gallery.jsx";

import logo from "../assets/logo.png";

import "./admin.css";

function AdminPortal({ user, onLogout }) {
  const [activeSection, setActiveSection] =
    useState("dashboard");

  // ==========================================
  // ADMIN SESSION CHECK
  // ==========================================

  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: "#ffffff",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
          }}
        >
          <h2>Admin session नहीं मिली</h2>

          <button
            type="button"
            onClick={onLogout}
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              marginTop: "15px",
              background: "#15803d",
              color: "#ffffff",
              fontWeight: "600",
            }}
          >
            वापस लॉगिन करें
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // SECTION CHANGE
  // ==========================================

  const handleSectionChange = (section) => {
    console.log("Admin section:", section);

    setActiveSection(section);
  };

  // ==========================================
  // MAIN ADMIN PORTAL
  // ==========================================

  return (
    <div className="admin-portal">

      {/* ======================================
          ADMIN NAVBAR
      ====================================== */}

      <AdminNavbar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
        onLogout={onLogout}
      />

      {/* ======================================
          SMALL ADMIN BRAND
      ====================================== */}

      <div
        className="admin-brand-strip"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 24px",
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <img
          src={logo}
          alt="युवा सारथी सेवा संस्था"
          style={{
            width: "42px",
            height: "42px",
            objectFit: "contain",
          }}
        />

        <span
          style={{
            fontWeight: "700",
            color: "#166534",
            fontSize: "18px",
          }}
        >
          युवा सारथी
        </span>
      </div>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main
        className="admin-content"
        style={{
          display: "block",
          width: "100%",
          minHeight: "calc(100vh - 160px)",
        }}
      >

        {/* ====================================
            DASHBOARD
        ==================================== */}

        {activeSection === "dashboard" && (
          <Dashboard
            setActiveSection={handleSectionChange}
          />
        )}

        {/* ====================================
            MANAGEMENT
        ==================================== */}

        {activeSection === "management" && (
          <Management
            setActiveSection={handleSectionChange}
          />
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

        {/* ====================================
            FALLBACK
        ==================================== */}

        {![
          "dashboard",
          "management",
          "membership",
          "events",
          "gallery",
        ].includes(activeSection) && (
          <Dashboard
            setActiveSection={handleSectionChange}
          />
        )}

      </main>
    </div>
  );
}

export default AdminPortal;