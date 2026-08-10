import {
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

import "./Developer.css";

function Developer() {
  return (
    <section
      id="developer"
      className="developer-section"
      
    >
      <div className="developer-container">

        <div className="developer-heading">
          <span className="developer-eyebrow">
            WEBSITE DEVELOPER
          </span>

          <h2>
            वेबसाइट डेवलपर
          </h2>

          <p>
            युवा सारथी सेवा संस्था की वेबसाइट को
            डिजाइन और विकसित करने वाला।
          </p>
        </div>

        <div className="developer-card">

          <div className="developer-image-wrapper">
            <img
              src="/src/assets/aditya.jpg"
              alt="Aditya Verma"
              className="developer-image"
            />
          </div>

          <div className="developer-content">

            <h3>Aditya Verma</h3>

            <div className="developer-role">
              Website Developer
            </div>

            <p>
              संस्था की वेबसाइट के design,
              development और technical implementation
              में योगदान।
            </p>

            <div className="developer-socials">

              <a
                href="https://wa.me/919238022531"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-social whatsapp"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://www.instagram.com/_aditya_verma._23"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-social instagram"
              >
                <FaInstagram />
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Developer;