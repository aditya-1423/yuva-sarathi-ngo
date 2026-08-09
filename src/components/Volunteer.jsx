import { useState } from "react";

import {
  FaUserPlus,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  createMembershipApplication,
} from "../firebase/volunteer.js";

// ==================================================
// NGO WHATSAPP NUMBER
// ==================================================
// Country code ke saath number likho.
// Example: 919876543210
// +, space ya - mat lagana.

const NGO_WHATSAPP_NUMBER =
  "9238022531";


function Volunteer() {

  // ============================================
  // FORM STATE
  // ============================================

  const [formData, setFormData] = useState({
    fullName: "",
    whatsappNumber: "",
    email: "",
    age: "",
    gender: "",
    district: "",
    village: "",
    address: "",
    occupation: "",
    reason: "",
  });

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // ============================================
  // INPUT CHANGE
  // ============================================

  function handleChange(event) {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setError("");
    setMessage("");
  }


  // ============================================
  // SUBMIT
  // ============================================

  async function handleSubmit(event) {

    event.preventDefault();

    setError("");
    setMessage("");


    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!formData.fullName.trim()) {

      setError(
        "कृपया अपना पूरा नाम भरें।"
      );

      return;
    }


    if (!formData.whatsappNumber.trim()) {

      setError(
        "कृपया अपना WhatsApp नंबर भरें।"
      );

      return;
    }


    if (!formData.age) {

      setError(
        "कृपया अपनी उम्र भरें।"
      );

      return;
    }


    if (!formData.gender) {

      setError(
        "कृपया लिंग चुनें।"
      );

      return;
    }


    if (!formData.district.trim()) {

      setError(
        "कृपया अपना जिला भरें।"
      );

      return;
    }


    // ==========================================
    // VILLAGE / CITY VALIDATION
    // ==========================================

    if (!formData.village.trim()) {

      setError(
        "कृपया गांव / शहर का नाम भरें।"
      );

      return;
    }


    if (!formData.address.trim()) {

      setError(
        "कृपया अपना पूरा पता भरें।"
      );

      return;
    }


    if (!formData.reason.trim()) {

      setError(
        "कृपया संस्था से जुड़ने का उद्देश्य बताएं।"
      );

      return;
    }


    // ==========================================
    // AGE VALIDATION
    // ==========================================

    const age =
      Number(formData.age);


    if (
      age < 15 ||
      age > 55
    ) {

      setError(
        "सदस्यता के लिए आयु 15 से 55 वर्ष के बीच होनी चाहिए।"
      );

      return;
    }


    // ==========================================
    // WHATSAPP VALIDATION
    // ==========================================

    const whatsapp =
      formData.whatsappNumber.replace(
        /\D/g,
        ""
      );


    if (
      whatsapp.length !== 10
    ) {

      setError(
        "कृपया सही 10 अंकों का WhatsApp नंबर डालें।"
      );

      return;
    }


    // ==========================================
    // FIREBASE SUBMIT
    // ==========================================

    try {

      setLoading(true);


      // ----------------------------------------
      // IMPORTANT:
      // पहले Firebase में application save होगा
      // ----------------------------------------

      const application =
        await createMembershipApplication({

          fullName:
            formData.fullName.trim(),

          whatsappNumber:
            whatsapp,

          email:
            formData.email.trim(),

          age:
            age,

          gender:
            formData.gender.trim(),

          district:
            formData.district.trim(),

          village:
            formData.village.trim(),

          address:
            formData.address.trim(),

          occupation:
            formData.occupation.trim(),

          reason:
            formData.reason.trim(),

        });


      console.log(
        "Membership application created:",
        application
      );


      // ========================================
      // SUCCESS MESSAGE
      // ========================================

      setMessage(
        "आपका सदस्यता आवेदन सफलतापूर्वक दर्ज हो गया है। संस्था का एडमिन आपके आवेदन की जाँच करेगा।"
      );


      // ========================================
      // WHATSAPP REDIRECT
      // ========================================
      // Firebase save होने के बाद ही चलेगा।

      const whatsappMessage =
        `नमस्ते युवा सारथी सेवा संस्था छत्तीसगढ़।\n\n` +
        `मैंने आपकी वेबसाइट पर सदस्यता के लिए आवेदन किया है।\n\n` +
        `नाम: ${formData.fullName.trim()}\n` +
        `WhatsApp नंबर: ${whatsapp}\n` +
        `जिला: ${formData.district.trim()}\n` +
        `गांव / शहर: ${formData.village.trim()}\n` +
        `उम्र: ${age}\n` +
        `लिंग: ${formData.gender.trim()}\n\n` +
        `कृपया मेरे सदस्यता आवेदन के संबंध में आगे की जानकारी दें।`;


      const whatsappUrl =
        `https://wa.me/${NGO_WHATSAPP_NUMBER}?text=${encodeURIComponent(
          whatsappMessage
        )}`;


      // थोड़ा delay ताकि success message भी दिखाई दे सके
      setTimeout(() => {

        window.location.href =
          whatsappUrl;

      }, 500);


      // ========================================
      // CLEAR FORM
      // ========================================

      setFormData({

        fullName: "",

        whatsappNumber: "",

        email: "",

        age: "",

        gender: "",

        district: "",

        village: "",

        address: "",

        occupation: "",

        reason: "",

      });


    } catch (submitError) {

      console.error(
        "Membership application error:",
        submitError
      );


      setError(
        submitError?.message ||
        "आवेदन जमा नहीं हो सका। कृपया दोबारा प्रयास करें।"
      );


    } finally {

      setLoading(false);

    }
  }


  // ============================================
  // UI
  // ============================================

  return (

    <section
      id="volunteer"
      className="py-24 bg-gray-50"
    >

      <div className="max-w-7xl mx-auto px-5">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">


          {/* =====================================
              LEFT SIDE
          ===================================== */}

          <div>

            <span className="text-orange-500 font-semibold tracking-widest">
              हमसे जुड़ें
            </span>


            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mt-4 leading-tight">

              संस्था की
              <br />
              सदस्यता लें

            </h2>


            <p className="text-gray-600 mt-6 leading-8 text-lg">

              आप भी युवा सारथी सेवा संस्था छत्तीसगढ़
              से जुड़कर समाज सेवा, युवा उत्थान और
              राष्ट्र निर्माण में अपना महत्वपूर्ण योगदान
              दे सकते हैं।

            </p>


            <div className="mt-10 space-y-6">


              {/* MEMBER */}

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl">

                  <FaUserPlus />

                </div>


                <div>

                  <h4 className="font-semibold text-lg">
                    सदस्य बनें
                  </h4>


                  <p className="text-gray-600">
                    वार्षिक न्यूनतम सदस्यता शुल्क ₹100।
                  </p>

                </div>

              </div>


              {/* WHATSAPP */}

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xl">

                  <FaPhone />

                </div>


                <div>

                  <h4 className="font-semibold text-lg">
                    WhatsApp नंबर
                  </h4>


                  <p className="text-gray-600">

                    संस्था की आवश्यक जानकारी एवं संपर्क
                    के लिए WhatsApp नंबर देना अनिवार्य है।

                  </p>

                </div>

              </div>


              {/* AREA */}

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl">

                  <FaMapMarkerAlt />

                </div>


                <div>

                  <h4 className="font-semibold text-lg">
                    कार्य क्षेत्र
                  </h4>


                  <p className="text-gray-600">

                    कबीरधाम, कवर्धा एवं छत्तीसगढ़ के
                    विभिन्न जिले।

                  </p>

                </div>

              </div>

            </div>


            {/* INFO */}

            <div className="mt-10 p-6 bg-green-50 border border-green-100 rounded-2xl">

              <h4 className="font-bold text-green-800 text-lg">

                सदस्यता के लिए आवश्यक जानकारी

              </h4>


              <ul className="mt-3 space-y-2 text-gray-600">

                <li>
                  • न्यूनतम आयु 15 वर्ष
                </li>

                <li>
                  • अधिकतम आयु 55 वर्ष
                </li>

                <li>
                  • वार्षिक न्यूनतम सदस्यता शुल्क ₹100
                </li>

                <li>
                  • सही WhatsApp नंबर आवश्यक
                </li>

                <li>
                  • गांव / शहर का नाम आवश्यक
                </li>

                <li>
                  • अंतिम सदस्यता स्वीकृति एडमिन द्वारा
                </li>

              </ul>

            </div>

          </div>


          {/* =====================================
              FORM
          ===================================== */}

          <div className="bg-white rounded-[30px] shadow-xl p-8">

            <h3 className="text-3xl font-bold text-green-800 mb-2 text-center">

              सदस्यता आवेदन

            </h3>


            <p className="text-center text-gray-500 mb-8">

              युवा सारथी सेवा संस्था छत्तीसगढ़

            </p>


            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >


              {/* FULL NAME */}

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="पूरा नाम *"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />


              {/* WHATSAPP */}

              <input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="WhatsApp नंबर *"
                maxLength="10"
                inputMode="numeric"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />


              <p className="text-sm text-gray-500 -mt-3">

                इसी नंबर पर संस्था द्वारा संपर्क किया जा सकता है।

              </p>


              {/* EMAIL */}

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ईमेल पता"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
              />


              {/* AGE */}

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="उम्र *"
                min="15"
                max="55"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />


              {/* GENDER */}

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              >

                <option value="">
                  लिंग चुनें *
                </option>

                <option value="पुरुष">
                  पुरुष
                </option>

                <option value="महिला">
                  महिला
                </option>

                <option value="अन्य">
                  अन्य
                </option>

              </select>


              {/* DISTRICT */}

              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="जिला *"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />


              {/* VILLAGE / CITY */}

              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="गांव / शहर का नाम *"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />


              <p className="text-sm text-gray-500 -mt-3">

                अपना गांव, कस्बा या शहर का नाम भरें।

              </p>


              {/* FULL ADDRESS */}

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="पूरा पता *"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />


              {/* OCCUPATION */}

              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                placeholder="व्यवसाय / कार्य"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
              />


              {/* REASON */}

              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="4"
                placeholder="आप संस्था से क्यों जुड़ना चाहते हैं? *"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />


              {/* FEE */}

              <div className="p-5 rounded-xl bg-green-50 border border-green-100">

                <div className="flex justify-between items-center">

                  <span className="font-semibold text-gray-700">

                    वार्षिक सदस्यता शुल्क

                  </span>


                  <span className="text-2xl font-bold text-green-800">

                    ₹100

                  </span>

                </div>


                <p className="text-sm text-gray-500 mt-2">

                  न्यूनतम वार्षिक सदस्यता शुल्क ₹100 है।

                </p>

              </div>


              {/* ERROR */}

              {error && (

                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">

                  {error}

                </div>

              )}


              {/* SUCCESS */}

              {message && (

                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">

                  {message}

                </div>

              )}


              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-700 to-green-900 text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {loading
                  ? "आवेदन जमा हो रहा है..."
                  : "सदस्यता आवेदन करें"}

              </button>


              <p className="text-xs text-gray-500 text-center leading-5">

                आवेदन जमा करने के बाद संस्था का एडमिन
                आपके आवेदन की जाँच करेगा। अंतिम सदस्यता
                संस्था की स्वीकृति के बाद ही मान्य होगी।

              </p>

            </form>

          </div>

        </div>

      </div>

    </section>

  );
}


export default Volunteer;