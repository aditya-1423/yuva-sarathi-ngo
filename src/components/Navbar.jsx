import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";

function Navbar() {
  const [open, setOpen] = useState(false);

  const menu = [
    {
      name: "मुख्य पृष्ठ",
      link: "#home",
    },
    {
      name: "हमारे बारे में",
      link: "#about",
    },
    {
      name: "सेवाएँ",
      link: "#services",
    },
    {
      name: "गैलरी",
      link: "#gallery",
    },
    {
      name: "हमसे जुड़ें",
      link: "#volunteer",
    },
    {
      name: "संपर्क",
      link: "#contact",
    },
  ];

  const handleMenuClick = () => {
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl shadow-md transition-all duration-300">

      <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">

        {/* =========================
            LOGO
        ========================= */}

        <a
          href="#home"
          onClick={handleMenuClick}
          className="flex items-center gap-3 group"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-700 bg-white shadow-lg group-hover:scale-110 transition duration-300">

            <img
              src={logo}
              alt="युवा सारथी सेवा संस्था"
              className="w-full h-full object-contain p-1"
            />

          </div>

          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-green-700">
                युवा
              </span>{" "}
              <span className="text-orange-500">
                सारथी
              </span>
            </h1>

            <p className="text-sm text-gray-600">
              सेवा संस्था छत्तीसगढ़
            </p>
          </div>
        </a>


        {/* =========================
            DESKTOP MENU
        ========================= */}

        <div className="hidden lg:flex items-center gap-7">

          {menu.map((item, index) => (
            <a
              key={index}
              href={item.link}
              onClick={handleMenuClick}
              className="relative text-gray-700 font-medium hover:text-green-700 transition duration-300 group"
            >
              {item.name}

              <span className="absolute left-0 bottom-[-6px] h-[2px] w-0 bg-orange-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}


          {/* DONATE */}

          <a
            href="#donate"
            onClick={handleMenuClick}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-7 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition duration-300"
          >
            ❤️ दान करें
          </a>

        </div>


        {/* =========================
            MOBILE BUTTON
        ========================= */}

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="lg:hidden text-2xl text-green-700"
          aria-label="Menu"
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

      </div>


      {/* =========================
          MOBILE MENU
      ========================= */}

      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          open
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >

        <div className="bg-white border-t shadow-lg p-5">

          <div className="flex flex-col gap-3">

            {menu.map((item, index) => (
              <a
                key={index}
                href={item.link}
                onClick={handleMenuClick}
                className="px-4 py-3 rounded-xl text-gray-700 font-medium hover:bg-green-50 hover:text-green-700 transition-all duration-300"
              >
                {item.name}
              </a>
            ))}


            {/* DONATE MOBILE */}

            <a
              href="#donate"
              onClick={handleMenuClick}
              className="mt-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition"
            >
              ❤️ दान करें
            </a>

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;