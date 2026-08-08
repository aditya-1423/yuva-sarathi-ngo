import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="bg-green-900 text-white pt-16 pb-6">

      <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo */}

        <div>

          <div className="flex items-center gap-3">

            <img
              src={logo}
              alt="Logo"
              className="w-16 h-16 rounded-full bg-white p-1"
            />

            <div>

              <h2 className="text-2xl font-bold">

                युवा सारथी

              </h2>

              <p className="text-green-200">

                सेवा संस्था छत्तीसगढ़

              </p>

            </div>

          </div>

          <p className="mt-5 leading-8 text-green-100">

            शिक्षा, स्वास्थ्य, पर्यावरण संरक्षण एवं समाज सेवा
            के क्षेत्र में कार्यरत एक सामाजिक संस्था।

          </p>

        </div>

        {/* Quick Links */}

        <div>

          <h3 className="text-xl font-bold mb-5">

            Quick Links

          </h3>

          <ul className="space-y-3 text-green-100">

            <li><a href="#home" className="hover:text-orange-400">मुख्य पृष्ठ</a></li>

            <li><a href="#about" className="hover:text-orange-400">हमारे बारे में</a></li>

            <li><a href="#services" className="hover:text-orange-400">सेवाएँ</a></li>

            <li><a href="#gallery" className="hover:text-orange-400">गैलरी</a></li>

            <li><a href="#contact" className="hover:text-orange-400">संपर्क</a></li>

          </ul>

        </div>

        {/* Contact */}

        <div>

          <h3 className="text-xl font-bold mb-5">

            संपर्क

          </h3>

          <div className="space-y-4 text-green-100">

            <div className="flex gap-3">

              <FaPhoneAlt className="mt-1 text-orange-400"/>

              <span>+91 9876543210</span>

            </div>

            <div className="flex gap-3">

              <FaEnvelope className="mt-1 text-orange-400"/>

              <span>info@yuvasarathi.org</span>

            </div>

            <div className="flex gap-3">

              <FaMapMarkerAlt className="mt-1 text-orange-400"/>

              <span>कवर्धा, छत्तीसगढ़</span>

            </div>

          </div>

        </div>

        {/* Social */}

        <div>

          <h3 className="text-xl font-bold mb-5">

            Follow Us

          </h3>

          <div className="flex gap-4">

            <a
              href="#"
              className="w-11 h-11 rounded-full bg-blue-600 flex justify-center items-center hover:scale-110 transition"
            >
              <FaFacebookF/>
            </a>

            <a
              href="#"
              className="w-11 h-11 rounded-full bg-pink-500 flex justify-center items-center hover:scale-110 transition"
            >
              <FaInstagram/>
            </a>

            <a
              href="#"
              className="w-11 h-11 rounded-full bg-sky-600 flex justify-center items-center hover:scale-110 transition"
            >
              <FaLinkedinIn/>
            </a>

            <a
              href="#"
              className="w-11 h-11 rounded-full bg-green-500 flex justify-center items-center hover:scale-110 transition"
            >
              <FaWhatsapp/>
            </a>

          </div>

        </div>

      </div>

      <hr className="border-green-700 my-10"/>

      <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-green-200 text-center">

          © {new Date().getFullYear()} युवा सारथी सेवा संस्था छत्तीसगढ़ |
          All Rights Reserved.

        </p>

        <p className="flex items-center gap-2 text-green-200">

          Made with

          <FaHeart className="text-red-500"/>

          for Society

        </p>

      </div>

    </footer>
  );
}

export default Footer;