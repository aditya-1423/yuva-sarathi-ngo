import { useState } from "react";

import {
  Menu,
  X,
  ChevronDown,
  Heart,
  UserRound,
} from "lucide-react";

import logo from "../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // ==========================================
  // CLOSE MENU
  // ==========================================

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsAboutOpen(false);
  };


  // ==========================================
  // CHANGE WEBSITE SECTION
  // ==========================================

  const openSection = (section) => {
    closeMenu();

    window.location.hash = section;
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-20">


          {/* ======================================
              LOGO
          ====================================== */}

          <button
            type="button"
            onClick={() => openSection("home")}
            className="flex items-center gap-3 group"
          >

            <img
              src={logo}
              alt="युवा सारथी सेवा संस्था"
              className="h-12 w-12 min-w-12 object-contain block"
            />

            <div className="text-left leading-tight">

              <div className="text-lg sm:text-xl font-bold text-gray-900">
                युवा सारथी
              </div>

              <div className="text-xs sm:text-sm text-orange-600 font-semibold">
                सेवा संस्था छत्तीसगढ़
              </div>

            </div>

          </button>


          {/* ======================================
              DESKTOP NAV
          ====================================== */}

          <div className="hidden lg:flex items-center gap-7">


            {/* HOME */}

            <button
              type="button"
              onClick={() => openSection("home")}
              className="text-gray-700 hover:text-orange-600 font-medium transition"
            >
              होम
            </button>


            {/* ABOUT */}

            <button
              type="button"
              onClick={() => openSection("about")}
              className="text-gray-700 hover:text-orange-600 font-medium transition"
            >
              हमारे बारे में
            </button>


            {/* ======================================
                INSTITUTION DROPDOWN
            ====================================== */}

            <div className="relative">

              <button
                type="button"
                onClick={() =>
                  setIsAboutOpen(!isAboutOpen)
                }
                className="flex items-center gap-1 text-gray-700 hover:text-orange-600 font-medium transition"
              >

                संस्था

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isAboutOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>


              {isAboutOpen && (

                <div className="absolute top-full left-0 mt-3 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2">

                  <button
                    type="button"
                    onClick={() =>
                      openSection("about")
                    }
                    className="w-full text-left px-5 py-3 hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    हमारे बारे में
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      openSection("services")
                    }
                    className="w-full text-left px-5 py-3 hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    हमारी सेवाएं
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      openSection("team")
                    }
                    className="w-full text-left px-5 py-3 hover:bg-orange-50 hover:text-orange-600 transition"
                  >
                    हमारी टीम
                  </button>

                </div>

              )}

            </div>


            {/* SERVICES */}

            <button
              type="button"
              onClick={() =>
                openSection("services")
              }
              className="text-gray-700 hover:text-orange-600 font-medium transition"
            >
              सेवाएं
            </button>


            {/* ======================================
                PROGRAMS / EVENTS
            ====================================== */}

            <button
              type="button"
              onClick={() =>
                openSection("events")
              }
              className="text-gray-700 hover:text-orange-600 font-medium transition"
            >
              कार्यक्रम
            </button>


            {/* GALLERY */}

            <button
              type="button"
              onClick={() =>
                openSection("gallery")
              }
              className="text-gray-700 hover:text-orange-600 font-medium transition"
            >
              गैलरी
            </button>


            {/* FAQ */}

            {/* <button
              type="button"
              onClick={() =>
                openSection("faq")
              }
              className="text-gray-700 hover:text-orange-600 font-medium transition"
            >
              FAQ
            </button> */}


            {/* CONTACT */}

            <button
              type="button"
              onClick={() =>
                openSection("contact")
              }
              className="text-gray-700 hover:text-orange-600 font-medium transition"
            >
              संपर्क
            </button>


            {/* DONATE */}

            <button
              type="button"
              onClick={() =>
                openSection("donate")
              }
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-full font-semibold transition shadow-md hover:shadow-lg"
            >

              <Heart
                size={17}
                fill="currentColor"
              />

              सहयोग करें

            </button>

          </div>


          {/* ======================================
              MOBILE MENU BUTTON
          ====================================== */}

          <button
            type="button"
            onClick={() =>
              setIsMenuOpen(!isMenuOpen)
            }
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >

            {isMenuOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}

          </button>

        </div>

      </div>


      {/* ==========================================
          MOBILE MENU
      ========================================== */}

      {isMenuOpen && (

        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">

          <div className="px-5 py-4 space-y-1">


            {/* HOME */}

            <button
              type="button"
              onClick={() =>
                openSection("home")
              }
              className="mobile-nav-item"
            >
              होम
            </button>


            {/* ABOUT */}

            <button
              type="button"
              onClick={() =>
                openSection("about")
              }
              className="mobile-nav-item"
            >
              हमारे बारे में
            </button>


            {/* ======================================
                MOBILE INSTITUTION
            ====================================== */}

            <div>

              <button
                type="button"
                onClick={() =>
                  setIsAboutOpen(!isAboutOpen)
                }
                className="w-full flex items-center justify-between py-3 text-gray-700 font-medium"
              >

                संस्था

                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    isAboutOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>


              {isAboutOpen && (

                <div className="pl-4 pb-2 space-y-1">

                  <button
                    type="button"
                    onClick={() =>
                      openSection("about")
                    }
                    className="mobile-sub-item"
                  >
                    हमारे बारे में
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      openSection("services")
                    }
                    className="mobile-sub-item"
                  >
                    हमारी सेवाएं
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      openSection("team")
                    }
                    className="mobile-sub-item"
                  >
                    हमारी टीम
                  </button>

                </div>

              )}

            </div>


            {/* SERVICES */}

            <button
              type="button"
              onClick={() =>
                openSection("services")
              }
              className="mobile-nav-item"
            >
              सेवाएं
            </button>


            {/* ======================================
                PROGRAMS
            ====================================== */}

            <button
              type="button"
              onClick={() =>
                openSection("events")
              }
              className="mobile-nav-item"
            >
              कार्यक्रम
            </button>


            {/* GALLERY */}

            <button
              type="button"
              onClick={() =>
                openSection("gallery")
              }
              className="mobile-nav-item"
            >
              गैलरी
            </button>


            {/* FAQ */}

            <button
              type="button"
              onClick={() =>
                openSection("faq")
              }
              className="mobile-nav-item"
            >
              FAQ
            </button>


            {/* CONTACT */}

            <button
              type="button"
              onClick={() =>
                openSection("contact")
              }
              className="mobile-nav-item"
            >
              संपर्क
            </button>


            {/* VOLUNTEER */}

            <button
              type="button"
              onClick={() =>
                openSection("volunteer")
              }
              className="w-full flex items-center justify-center gap-2 mt-3 bg-gray-900 text-white py-3 rounded-xl font-semibold"
            >

              <UserRound size={18} />

              Volunteer बनें

            </button>


            {/* DONATE */}

            <button
              type="button"
              onClick={() =>
                openSection("donate")
              }
              className="w-full flex items-center justify-center gap-2 mt-2 bg-orange-600 text-white py-3 rounded-xl font-semibold"
            >

              <Heart
                size={18}
                fill="currentColor"
              />

              सहयोग करें

            </button>

          </div>

        </div>

      )}


      {/* ==========================================
          MOBILE CSS
      ========================================== */}

      <style>{`

        .mobile-nav-item {
          width: 100%;
          text-align: left;
          padding: 12px 0;
          color: #374151;
          font-weight: 500;
          transition: all 0.2s;
        }

        .mobile-nav-item:hover {
          color: #ea580c;
        }

        .mobile-sub-item {
          width: 100%;
          text-align: left;
          padding: 9px 0;
          color: #6b7280;
          font-size: 14px;
          transition: all 0.2s;
        }

        .mobile-sub-item:hover {
          color: #ea580c;
        }

      `}</style>

    </nav>
  );
};

export default Navbar;