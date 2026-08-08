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


function App() {

  const [showAdminLogin, setShowAdminLogin] =
    useState(
      window.location.hash ===
        "#admin-login"
    );


  useEffect(() => {

    const checkPage = () => {

      setShowAdminLogin(
        window.location.hash ===
          "#admin-login"
      );

    };


    window.addEventListener(
      "hashchange",
      checkPage
    );


    return () =>
      window.removeEventListener(
        "hashchange",
        checkPage
      );

  }, []);


  if (showAdminLogin) {
    return <AdminLogin />;
  }


  return (
    <>

      <Navbar />

      <main>

        <Hero />

        <About />

        <Services />

        <Counter />

        <Mission />

        <Gallery />

        <Events />

        <Team />

        <Volunteer />

        <FAQ />

        <Donate />

        <Contact />

      </main>


      <Footer />

      <WhatsAppButton />


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