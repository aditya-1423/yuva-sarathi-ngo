import { useState } from "react";
import toast from "react-hot-toast";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import { addContactMessage } from "../firebase/contact.js";


function Contact() {

  // ==========================================
  // FORM STATE
  // ==========================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });


  // ==========================================
  // SUBMIT LOADING
  // ==========================================

  const [isSubmitting, setIsSubmitting] =
    useState(false);


  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // ==========================================
  // FORM SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // ========================================
    // NAME VALIDATION
    // ========================================

    const name =
      formData.name.trim();

    if (!name) {

      toast.error(
        "कृपया अपना नाम दर्ज करें।"
      );

      return;
    }


    // ========================================
    // EMAIL VALIDATION
    // ========================================

    const email =
      formData.email.trim();

    if (!email) {

      toast.error(
        "कृपया अपना ईमेल दर्ज करें।"
      );

      return;
    }


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {

      toast.error(
        "कृपया सही ईमेल दर्ज करें।"
      );

      return;
    }


    // ========================================
    // PHONE VALIDATION
    // ========================================

    const phone =
      formData.phone.trim();


    if (!/^[0-9]{10}$/.test(phone)) {

      toast.error(
        "कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।"
      );

      return;
    }


    // ========================================
    // MESSAGE VALIDATION
    // ========================================

    const message =
      formData.message.trim();


    if (!message) {

      toast.error(
        "कृपया अपना संदेश लिखें।"
      );

      return;
    }


    // ========================================
    // FIREBASE SUBMIT
    // ========================================

    try {

      setIsSubmitting(true);


      await addContactMessage({
        name,
        email,
        phone,
        message,
      });


      // ======================================
      // SUCCESS
      // ======================================

      toast.success(
        "🎉 आपका संदेश सफलतापूर्वक भेज दिया गया।"
      );


      // ======================================
      // RESET FORM
      // ======================================

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });


    } catch (error) {

      console.error(
        "Contact form submit error:",
        error
      );


      toast.error(
        "संदेश भेजने में समस्या हुई। कृपया दोबारा प्रयास करें।"
      );

    } finally {

      setIsSubmitting(false);

    }

  };


  return (

    <section
      id="contact"
      className="
        py-24
        bg-gradient-to-b
        from-green-50
        to-white
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-5
        "
      >


        {/* =====================================
            HEADING
        ====================================== */}

        <div
          className="
            text-center
            mb-16
          "
        >

          <span
            className="
              inline-block
              bg-green-100
              text-green-700
              px-5
              py-2
              rounded-full
              font-semibold
            "
          >
            संपर्क करें
          </span>


          <h2
            className="
              text-4xl
              md:text-5xl
              font-bold
              text-green-800
              mt-5
            "
          >
            हमसे संपर्क करें
          </h2>


          <p
            className="
              text-gray-600
              mt-5
              max-w-2xl
              mx-auto
            "
          >
            किसी भी प्रकार की जानकारी,
            सहयोग या स्वयंसेवक बनने के लिए
            हमसे संपर्क करें।
          </p>

        </div>



        <div
          className="
            grid
            lg:grid-cols-2
            gap-10
          "
        >


          {/* ==================================
              LEFT SIDE
          ================================== */}

          <div
            className="
              space-y-6
            "
          >


            {/* PHONE */}

            <div
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
                flex
                gap-5
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-green-100
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >

                <FaPhoneAlt
                  className="
                    text-green-700
                    text-xl
                  "
                />

              </div>


              <div>

                <h3
                  className="
                    font-bold
                    text-lg
                  "
                >
                  फ़ोन
                </h3>


                <p
                  className="
                    text-gray-600
                  "
                >
                  +91 9238022531
                </p>

              </div>

            </div>



            {/* EMAIL */}

            <div
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
                flex
                gap-5
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-orange-100
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >

                <FaEnvelope
                  className="
                    text-orange-500
                    text-xl
                  "
                />

              </div>


              <div>

                <h3
                  className="
                    font-bold
                    text-lg
                  "
                >
                  ईमेल
                </h3>


                <p
                  className="
                    text-gray-600
                  "
                >
                  info@yuvasarathi.org
                </p>

              </div>

            </div>



            {/* ADDRESS */}

            <div
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
                flex
                gap-5
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-red-100
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >

                <FaMapMarkerAlt
                  className="
                    text-red-500
                    text-xl
                  "
                />

              </div>


              <div>

                <h3
                  className="
                    font-bold
                    text-lg
                  "
                >
                  पता
                </h3>


                <p
                  className="
                    text-gray-600
                  "
                >
                  कवर्धा, छत्तीसगढ़
                </p>

              </div>

            </div>



            {/* OFFICE TIME */}

            <div
              className="
                bg-white
                rounded-2xl
                shadow-lg
                p-6
                flex
                gap-5
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-blue-100
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >

                <FaClock
                  className="
                    text-blue-600
                    text-xl
                  "
                />

              </div>


              <div>

                <h3
                  className="
                    font-bold
                    text-lg
                  "
                >
                  कार्यालय समय
                </h3>


                <p
                  className="
                    text-gray-600
                  "
                >
                  सोमवार - शनिवार
                </p>


                <p
                  className="
                    text-gray-600
                  "
                >
                  सुबह 10:00 - शाम 6:00
                </p>

              </div>

            </div>



            {/* SOCIAL MEDIA */}

            <div
              className="
                flex
                gap-4
              "
            >

              <a
                href="#"
                aria-label="Facebook"
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-blue-600
                  text-white
                  flex
                  justify-center
                  items-center
                "
              >
                <FaFacebookF />
              </a>


              <a
                href="#"
                aria-label="Instagram"
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-pink-500
                  text-white
                  flex
                  justify-center
                  items-center
                "
              >
                <FaInstagram />
              </a>


              <a
                href="#"
                aria-label="LinkedIn"
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-sky-600
                  text-white
                  flex
                  justify-center
                  items-center
                "
              >
                <FaLinkedinIn />
              </a>

            </div>

          </div>



          {/* ==================================
              RIGHT SIDE FORM
          ================================== */}

          <div
            className="
              bg-white
              rounded-3xl
              shadow-xl
              p-8
            "
          >

            <h3
              className="
                text-2xl
                font-bold
                text-green-800
                mb-6
              "
            >
              हमें संदेश भेजें
            </h3>


            <form
              onSubmit={handleSubmit}
              className="
                space-y-5
              "
            >


              {/* NAME */}

              <div>

                <label
                  htmlFor="contact-name"
                  className="
                    block
                    mb-2
                    font-semibold
                    text-gray-700
                  "
                >
                  नाम
                </label>


                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="आपका नाम"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  disabled={isSubmitting}
                  className="
                    w-full
                    border
                    rounded-xl
                    p-4
                    outline-none
                    focus:border-green-600
                    disabled:bg-gray-100
                  "
                />

              </div>



              {/* EMAIL */}

              <div>

                <label
                  htmlFor="contact-email"
                  className="
                    block
                    mb-2
                    font-semibold
                    text-gray-700
                  "
                >
                  ईमेल
                </label>


                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="ईमेल"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="
                    w-full
                    border
                    rounded-xl
                    p-4
                    outline-none
                    focus:border-green-600
                    disabled:bg-gray-100
                  "
                />

              </div>



              {/* PHONE */}

              <div>

                <label
                  htmlFor="contact-phone"
                  className="
                    block
                    mb-2
                    font-semibold
                    text-gray-700
                  "
                >
                  मोबाइल नंबर
                </label>


                <input
                  id="contact-phone"
                  type="tel"
                  name="phone"
                  placeholder="10 अंकों का मोबाइल नंबर"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel"
                  disabled={isSubmitting}
                  className="
                    w-full
                    border
                    rounded-xl
                    p-4
                    outline-none
                    focus:border-green-600
                    disabled:bg-gray-100
                  "
                />

              </div>



              {/* MESSAGE */}

              <div>

                <label
                  htmlFor="contact-message"
                  className="
                    block
                    mb-2
                    font-semibold
                    text-gray-700
                  "
                >
                  संदेश
                </label>


                <textarea
                  id="contact-message"
                  rows="5"
                  name="message"
                  placeholder="अपना संदेश लिखें..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="
                    w-full
                    border
                    rounded-xl
                    p-4
                    resize-none
                    outline-none
                    focus:border-green-600
                    disabled:bg-gray-100
                  "
                />

              </div>



              {/* SUBMIT */}

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full
                  bg-green-700
                  hover:bg-green-800
                  disabled:bg-green-400
                  disabled:cursor-not-allowed
                  text-white
                  py-4
                  rounded-xl
                  font-semibold
                  transition
                "
              >

                {isSubmitting
                  ? "⏳ संदेश भेजा जा रहा है..."
                  : "📩 संदेश भेजें"}

              </button>

            </form>

          </div>

        </div>


        {/* ==================================
            GOOGLE MAP
        ================================== */}

        {/* 
        <div className="mt-12">

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=Kabirdham,Chhattisgarh&output=embed"
              className="w-full h-[450px]"
              loading="lazy"
            />

          </div>

        </div>
        */}

      </div>

    </section>

  );
}


export default Contact;