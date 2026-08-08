import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";

import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Counter from "./components/Counter";
import Mission from "./components/Mission";
import Gallery from "./components/Gallery";
import Volunteer from "./components/Volunteer";
import Donate from "./components/Donate";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Events from "./components/Events";
import Team from "./components/Team";
import FAQ from "./components/FAQ";
import WhatsAppButton from "./components/WhatsAppButton";

import AdminLogin from "./pages/AdminLogin";


// ============================================
// VALID WEBSITE SECTIONS
// ============================================

const validSections = [
  "home",
  "about",
  "services",
  "gallery",
  "events",
  "team",
  "volunteer",
  "donate",
  "contact",
];


// ============================================
// APP
// ============================================

function App() {

  const [currentSection, setCurrentSection] =
    useState(() => {

      const hash =
        window.location.hash.replace("#", "");

      if (hash === "admin-login") {
        return "admin-login";
      }

      if (validSections.includes(hash)) {
        return hash;
      }

      // Default landing page
      return "home";
    });


  // ============================================
  // HASH CHANGE
  // ============================================

  useEffect(() => {

    const handleHashChange = () => {

      const hash =
        window.location.hash.replace("#", "");


      if (hash === "admin-login") {
        setCurrentSection("admin-login");
        return;
      }


      if (validSections.includes(hash)) {
        setCurrentSection(hash);
        return;
      }


      // Empty / unknown hash
      setCurrentSection("home");
    };


    window.addEventListener(
      "hashchange",
      handleHashChange
    );


    return () => {

      window.removeEventListener(
        "hashchange",
        handleHashChange
      );

    };

  }, []);


  // ============================================
  // PAGE TOP SCROLL
  // ============================================

  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

  }, [currentSection]);


  // ============================================
  // ADMIN LOGIN
  // ============================================

  if (currentSection === "admin-login") {
    return <AdminLogin />;
  }


  // ============================================
  // RENDER SECTION
  // ============================================

  function renderSection() {

    switch (currentSection) {

      // ========================================
      // HOME
      // ========================================

      case "home":
        return (
          <>
            <Hero />
            <About />
          </>
        );


      // ========================================
      // ABOUT
      // ========================================

      case "about":
        return (
          <About />
        );


      // ========================================
      // SERVICES
      // ========================================

      case "services":
        return (
          <Services />
        );


      // ========================================
      // GALLERY
      // ========================================

      case "gallery":
        return (
          <Gallery />
        );


      // ========================================
      // EVENTS
      // ========================================

      case "events":
        return (
          <Events />
        );


      // ========================================
      // TEAM
      // ========================================

      case "team":
        return (
          <Team />
        );


      // ========================================
      // VOLUNTEER + FAQ
      // ========================================

      case "volunteer":
        return (
          <>
            <Volunteer />

            {/* FAQ directly below Join Us */}

            <FAQ />
          </>
        );


      // ========================================
      // DONATE
      // ========================================

      case "donate":
        return (
          <Donate />
        );


      // ========================================
      // CONTACT
      // ========================================

      case "contact":
        return (
          <Contact />
        );


      // ========================================
      // DEFAULT
      // ========================================

      default:
        return (
          <>
            <Hero />
            <About />
          </>
        );
    }
  }


  // ============================================
  // MAIN WEBSITE
  // ============================================

  return (
    <>

      {/* NAVBAR */}

      <Navbar />


      {/* MAIN SECTION */}

      <main className="pt-0">

        {renderSection()}

      </main>


      {/* FOOTER */}

      <Footer />


      {/* WHATSAPP */}

      <WhatsAppButton />


      {/* ADMIN */}

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