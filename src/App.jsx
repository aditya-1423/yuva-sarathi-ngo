import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";

import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Gallery from "./components/Gallery";
import Events from "./components/Events";
import Team from "./components/Team";
import Developer from "./components/Developer/Developer";
import Volunteer from "./components/Volunteer";
import FAQ from "./components/FAQ";
import Donate from "./components/Donate";
import Contact from "./components/Contact";

import Footer from "./components/Footer";

import AdminLogin from "./pages/AdminLogin";
import AdminPortal from "./ADMIN PORTAL/AdminPortal";
import Mission from "./components/Mission";


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
  "developer",
  "volunteer",
  "faq",
  "donate",
  "contact",
  "mission",
];


// ==========================================
// APP
// ==========================================

function App() {

  const [currentSection, setCurrentSection] = useState(
    window.location.hash.replace("#", "") || "home"
  );

  const [showAdminLogin, setShowAdminLogin] = useState(
    window.location.hash === "#admin-login"
  );

  const [adminUser, setAdminUser] = useState(null);


  // ==========================================
  // HASH CHANGE
  // ==========================================

  useEffect(() => {

    const handleHashChange = () => {

      const hash = window.location.hash.replace("#", "");


      


      // ======================================
      // ADMIN LOGIN
      // ======================================

      if (hash === "admin-login") {

        setShowAdminLogin(true);
        setCurrentSection("home");

        return;
      }


      // ======================================
      // ADMIN PORTAL
      // ======================================

      if (hash === "admin-portal") {

        setShowAdminLogin(false);

        return;
      }


      // ======================================
      // NORMAL WEBSITE
      // ======================================

      setShowAdminLogin(false);


      // ======================================
      // DEFAULT HOME
      // ======================================

      if (!hash) {

        setCurrentSection("home");

        return;
      }


      // ======================================
      // VALID SECTION
      // ======================================

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


    // Initial check
    handleHashChange();


    return () => {

      window.removeEventListener(
        "hashchange",
        handleHashChange
      );

    };

  }, []);


  // ==========================================
  // ADMIN LOGIN SUCCESS
  // ==========================================

  function handleAdminLoginSuccess(user) {

    console.log(
      "Admin login successful:",
      user
    );

    setAdminUser(user);
    setShowAdminLogin(false);

    window.location.hash = "admin-portal";
  }


  // ==========================================
  // ADMIN LOGOUT
  // ==========================================

  function handleAdminLogout() {

    setAdminUser(null);

    window.location.hash = "home";
  }


  // ==========================================
  // ADMIN LOGIN PAGE
  // ==========================================

  if (showAdminLogin) {

    return (
      <AdminLogin
        onLoginSuccess={
          handleAdminLoginSuccess
        }
      />
    );

  }


  // ==========================================
  // ADMIN PORTAL
  // ==========================================

  if (
    window.location.hash === "#admin-portal" &&
    adminUser
  ) {

    return (
      <AdminPortal
        user={adminUser}
        onLogout={handleAdminLogout}
      />
    );

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
      // DEVELOPER
      // ======================================

      case "developer":

        return (
          <Developer />
        );


      // ======================================
      // VOLUNTEER
      // ======================================

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
 // MISSION
 // ======================================

      case "mission":

  return (
    <Mission />
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

      <Navbar />

      <main>
        {renderSection()}
      </main>

      <Footer />


      {/* ======================================
          ADMIN ACCESS
      ====================================== */}

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