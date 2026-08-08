import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";

import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Events from "./components/Events";
import Team from "./components/Team";
import Volunteer from "./components/Volunteer";
import FAQ from "./components/FAQ";
import Donate from "./components/Donate";
import Contact from "./components/Contact";

import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

import AdminLogin from "./pages/AdminLogin";


// ==========================================
// VALID WEBSITE SECTIONS
// ==========================================

const validSections = [
  "home",
  "about",
  "services",
  "gallery",
  "events",
  "team",
  "volunteer",
  "faq",
  "donate",
  "contact",
];


// ==========================================
// APP
// ==========================================

function App() {

  const [currentSection, setCurrentSection] =
    useState(
      window.location.hash.replace("#", "") || "home"
    );

  const [showAdminLogin, setShowAdminLogin] =
    useState(
      window.location.hash === "#admin-login"
    );


  // ==========================================
  // HASH CHANGE
  // ==========================================

  useEffect(() => {

    const handleHashChange = () => {

      const hash =
        window.location.hash.replace("#", "");

      // ADMIN LOGIN
      if (hash === "admin-login") {

        setShowAdminLogin(true);
        return;

      }

      setShowAdminLogin(false);


      // DEFAULT HOME
      if (!hash) {

        setCurrentSection("home");
        return;

      }


      // VALID SECTION
      if (validSections.includes(hash)) {

        setCurrentSection(hash);

      } else {

        setCurrentSection("home");

      }

    };


    window.addEventListener(
      "hashchange",
      handleHashChange
    );


    handleHashChange();


    return () => {

      window.removeEventListener(
        "hashchange",
        handleHashChange
      );

    };

  }, []);


  // ==========================================
  // ADMIN LOGIN PAGE
  // ==========================================

  if (showAdminLogin) {

    return <AdminLogin />;

  }


  // ==========================================
  // RENDER SELECTED SECTION
  // ==========================================

  const renderSection = () => {

    switch (currentSection) {


      // ======================================
      // HOME
      // ======================================

      case "home":

        return (
          <>
            <Hero />
            <About />
          </>
        );


      // ======================================
      // ABOUT
      // ======================================

      case "about":

        return (
          <About />
        );


      // ======================================
      // SERVICES
      // ======================================

      case "services":

        return (
          <Services />
        );


      // ======================================
      // GALLERY
      // ======================================

      case "gallery":

        return (
          <Gallery />
        );


      // ======================================
      // EVENTS
      // ======================================

      case "events":

        return (
          <Events />
        );


      // ======================================
      // TEAM
      // ======================================

      case "team":

        return (
          <Team />
        );


      // ======================================
      // JOIN US
      // ======================================
      // JOIN US KE NICHE FAQ BHI DIKHEGA

      case "volunteer":

        return (
          <>
            <Volunteer />

            <FAQ />
          </>
        );


      // ======================================
      // FAQ
      // ======================================

      case "faq":

        return (
          <FAQ />
        );


      // ======================================
      // DONATE
      // ======================================

      case "donate":

        return (
          <Donate />
        );


      // ======================================
      // CONTACT
      // ======================================

      case "contact":

        return (
          <Contact />
        );


      // ======================================
      // FALLBACK
      // ======================================

      default:

        return (
          <>
            <Hero />
            <About />
          </>
        );

    }

  };


  // ==========================================
  // MAIN WEBSITE
  // ==========================================

  return (
    <>

      {/* NAVBAR */}

      <Navbar />


      {/* MAIN CONTENT */}

      <main>

        {renderSection()}

      </main>


      {/* FOOTER ALWAYS VISIBLE */}

      <Footer />


      {/* WHATSAPP */}

      <WhatsAppButton />


      {/* ADMIN ACCESS */}

      <a
        className="admin-access-button"
        href="#admin-login"
      >
        Admin Login
      </a>

    </>
  );

}


export default App;