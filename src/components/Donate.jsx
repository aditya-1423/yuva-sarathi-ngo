import { useState } from "react";

import {
  FaHeart,
  FaHandHoldingHeart,
  FaRupeeSign,
  FaArrowLeft,
} from "react-icons/fa";

import { QRCodeSVG } from "qrcode.react";


// ==========================================
// DONATION CONFIG
// ==========================================

const UPI_ID = "9238022531@ptaxis";

const NGO_NAME = "Yuva Sarathi Seva Sanstha";

const WHATSAPP_NUMBER = "919238022531";


function Donate() {

  // ========================================
  // FORM STATE
  // ========================================

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    amount: "",
  });


  // ========================================
  // PAYMENT STATE
  // ========================================

  const [paymentData, setPaymentData] = useState(null);


  // ========================================
  // INPUT CHANGE
  // ========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // ========================================
  // FORM SUBMIT
  // ========================================

  const handleSubmit = (e) => {

    e.preventDefault();


    const name = formData.name.trim();

    const phone = formData.phone.trim();

    const amount = Number(formData.amount);


    // NAME VALIDATION

    if (!name) {

      alert("कृपया अपना नाम दर्ज करें।");

      return;
    }


    // MOBILE VALIDATION

    if (!/^[0-9]{10}$/.test(phone)) {

      alert("कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।");

      return;
    }


    // AMOUNT VALIDATION

    if (!amount || amount <= 0) {

      alert("कृपया सही donation amount दर्ज करें।");

      return;
    }


    // ======================================
    // UPI PAYMENT LINK
    // ======================================

    const upiUrl =
      `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
      `&pn=${encodeURIComponent(NGO_NAME)}` +
      `&am=${amount.toFixed(2)}` +
      `&cu=INR` +
      `&tn=${encodeURIComponent(
        `Donation by ${name}`
      )}`;


    // ======================================
    // PAYMENT DATA
    // ======================================

    setPaymentData({

      name,

      phone,

      amount,

      upiUrl,

    });

  };


  // ========================================
  // BACK TO FORM
  // ========================================

  const goBack = () => {

    setPaymentData(null);

  };


  // ========================================
  // NEW DONATION
  // ========================================

  const resetForm = () => {

    setFormData({
      name: "",
      phone: "",
      amount: "",
    });

    setPaymentData(null);

  };


  // ========================================
  // WHATSAPP MESSAGE
  // ========================================

  const whatsappMessage = paymentData
    ? `नमस्ते, मैंने ${NGO_NAME} को ₹${paymentData.amount} का donation किया है।

नाम: ${paymentData.name}
मोबाइल: ${paymentData.phone}

Payment का screenshot भेज रहा/रही हूँ।`
    : "";


  const whatsappUrl = paymentData
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : "#";


  return (

    <section
      id="donate"
      className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-green-900
        via-green-800
        to-green-950
        py-24
      "
    >


      {/* ======================================
          BACKGROUND DECORATION
      ====================================== */}

      <div
        className="
          absolute
          right-0
          top-0
          h-96
          w-96
          rounded-full
          bg-orange-500/20
          blur-3xl
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          h-72
          w-72
          rounded-full
          bg-green-400/10
          blur-3xl
        "
      />


      {/* ======================================
          MAIN CONTAINER
      ====================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-5
        "
      >

        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-12
            lg:grid-cols-2
          "
        >


          {/* ==================================
              LEFT SIDE
          ================================== */}

          <div className="text-white">


            {/* HEART ICON */}

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-orange-500
                text-3xl
                shadow-lg
              "
            >
              <FaHeart />
            </div>


            {/* HEADING */}

            <h2
              className="
                mt-6
                text-4xl
                font-bold
                leading-tight
                md:text-5xl
              "
            >

              आपका सहयोग

              <br />

              किसी की जिंदगी बदल सकता है

            </h2>


            {/* DESCRIPTION */}

            <p
              className="
                mt-6
                text-lg
                leading-8
                text-green-100
              "
            >

              आपका छोटा सा योगदान शिक्षा, स्वास्थ्य,
              पर्यावरण और समाज सेवा के कार्यों को आगे
              बढ़ाने में मदद करेगा।

            </p>


            {/* MOTTO */}

            <div
              className="
                mt-8
                flex
                items-center
                gap-4
              "
            >

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-white/20
                  text-2xl
                "
              >

                <FaHandHoldingHeart />

              </div>


              <p className="font-semibold text-white">

                #स्वार्थी नहीं सारथी बनो#

              </p>

            </div>

          </div>


          {/* ==================================
              RIGHT CARD
          ================================== */}

          <div
            className="
              rounded-[30px]
              bg-white
              p-7
              shadow-2xl
              md:p-8
            "
          >


            {/* =================================
                PAYMENT PAGE
            ================================= */}

            {paymentData ? (

              <div className="text-center">


                {/* BACK BUTTON */}

                <button
                  type="button"
                  onClick={goBack}
                  className="
                    mb-6
                    flex
                    items-center
                    gap-2
                    font-medium
                    text-gray-600
                    transition
                    hover:text-orange-600
                  "
                >

                  <FaArrowLeft />

                  वापस जाएं

                </button>


                {/* PAYMENT TITLE */}

                <h3
                  className="
                    text-2xl
                    font-bold
                    text-green-800
                  "
                >

                  Donation Payment

                </h3>


                <p
                  className="
                    mt-2
                    text-gray-500
                  "
                >

                  धन्यवाद, {paymentData.name}

                </p>


                {/* AMOUNT */}

                <div
                  className="
                    mt-5
                    text-4xl
                    font-bold
                    text-orange-600
                  "
                >

                  ₹{paymentData.amount}

                </div>


                {/* =================================
                    QR CODE
                ================================= */}

                <div
                  className="
                    mx-auto
                    mt-6
                    flex
                    w-fit
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-md
                  "
                >

                  <QRCodeSVG
                    value={paymentData.upiUrl}
                    size={220}
                    level="H"
                    includeMargin
                  />

                </div>


                <p
                  className="
                    mt-4
                    font-medium
                    text-gray-600
                  "
                >

                  QR Code scan करके payment करें

                </p>


                {/* =================================
                    OR
                ================================= */}

                <div
                  className="
                    my-5
                    flex
                    items-center
                    gap-3
                    text-sm
                    font-semibold
                    text-gray-400
                  "
                >

                  <span
                    className="
                      h-px
                      flex-1
                      bg-gray-200
                    "
                  />

                  <span>OR</span>

                  <span
                    className="
                      h-px
                      flex-1
                      bg-gray-200
                    "
                  />

                </div>


                {/* =================================
                    PAY THROUGH UPI
                ================================= */}

                <a
                  href={paymentData.upiUrl}
                  className="
                    block
                    w-full
                    rounded-xl
                    bg-orange-500
                    py-4
                    text-lg
                    font-bold
                    text-white
                    shadow-lg
                    transition
                    hover:bg-orange-600
                  "
                >

                  💳 UPI APP से पेमेंट करें

                </a>


                {/* =================================
                    WHATSAPP INFORMATION
                ================================= */}

                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-green-200
                    bg-green-50
                    p-5
                  "
                >

                  <p
                    className="
                      text-center
                      font-semibold
                      text-green-800
                    "
                  >

                    ✅ Payment करने के बाद

                  </p>


                  <p
                    className="
                      mt-2
                      text-center
                      text-sm
                      leading-6
                      text-gray-600
                    "
                  >

                    अपना नाम और payment का screenshot
                    WhatsApp पर भेजें।

                  </p>


                  {/* WHATSAPP BUTTON */}

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      mt-4
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-green-600
                      py-4
                      font-bold
                      text-white
                      shadow-md
                      transition
                      hover:bg-green-700
                    "
                  >

                    📱 WhatsApp पर Screenshot भेजें

                  </a>

                </div>


                {/* UPI ID */}

                <div
                  className="
                    mt-5
                    rounded-xl
                    bg-gray-50
                    p-3
                  "
                >

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >

                    UPI ID

                  </p>


                  <p
                    className="
                      mt-1
                      font-semibold
                      text-green-700
                    "
                  >

                    {UPI_ID}

                  </p>

                </div>


                {/* NEW DONATION */}

                <button
                  type="button"
                  onClick={resetForm}
                  className="
                    mt-5
                    text-sm
                    font-semibold
                    text-gray-500
                    transition
                    hover:text-orange-600
                  "
                >

                  नई Donation करें

                </button>

              </div>

            ) : (


              /* =================================
                 DONATION FORM
              ================================= */

              <div>


                {/* FORM TITLE */}

                <h3
                  className="
                    text-center
                    text-2xl
                    font-bold
                    text-green-800
                  "
                >

                  सहयोग करें

                </h3>


                <p
                  className="
                    mt-2
                    text-center
                    text-gray-500
                  "
                >

                  Donation करने के लिए अपनी जानकारी भरें

                </p>


                {/* =================================
                    FORM
                ================================= */}

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-5"
                >


                  {/* NAME */}

                  <div>

                    <label
                      htmlFor="donation-name"
                      className="
                        mb-2
                        block
                        font-semibold
                        text-gray-700
                      "
                    >

                      नाम

                    </label>


                    <input
                      id="donation-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="अपना नाम दर्ज करें"
                      autoComplete="name"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        px-4
                        py-3
                        outline-none
                        transition
                        focus:border-orange-500
                        focus:ring-2
                        focus:ring-orange-100
                      "
                    />

                  </div>


                  {/* MOBILE */}

                  <div>

                    <label
                      htmlFor="donation-phone"
                      className="
                        mb-2
                        block
                        font-semibold
                        text-gray-700
                      "
                    >

                      मोबाइल नंबर

                    </label>


                    <input
                      id="donation-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={10}
                      inputMode="numeric"
                      placeholder="10 अंकों का मोबाइल नंबर"
                      autoComplete="tel"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-300
                        px-4
                        py-3
                        outline-none
                        transition
                        focus:border-orange-500
                        focus:ring-2
                        focus:ring-orange-100
                      "
                    />

                  </div>


                  {/* AMOUNT */}

                  <div>

                    <label
                      htmlFor="donation-amount"
                      className="
                        mb-2
                        block
                        font-semibold
                        text-gray-700
                      "
                    >

                       दान की राशि

                    </label>


                    <div className="relative">

                      <FaRupeeSign
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-gray-500
                        "
                      />


                      <input
                        id="donation-amount"
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        min="1"
                        step="1"
                        inputMode="numeric"
                        placeholder="Amount डालें"
                        className="
                          w-full
                          rounded-xl
                          border
                          border-gray-300
                          py-3
                          pl-10
                          pr-4
                          outline-none
                          transition
                          focus:border-orange-500
                          focus:ring-2
                          focus:ring-orange-100
                        "
                      />

                    </div>

                  </div>


                  {/* =================================
                      WARNING ON FORM PAGE
                  ================================= */}

                  <div
                    className="
                      rounded-xl
                      border
                      border-orange-200
                      bg-orange-50
                      p-4
                    "
                  >

                    <p
                      className="
                        text-center
                        text-sm
                        font-semibold
                        text-orange-700
                      "
                    >

                      ⚠️ महत्वपूर्ण सूचना

                    </p>


                    <p
                      className="
                        mt-2
                        text-center
                        text-sm
                        leading-6
                        text-gray-600
                      "
                    >

                      Payment करने के बाद अपना नाम और
                      payment का screenshot WhatsApp पर
                      भेजना आवश्यक है।

                    </p>

                  </div>


                  {/* =================================
                      CONTINUE BUTTON
                  ================================= */}

                  <button
                    type="submit"
                    className="
                      w-full
                      rounded-xl
                      bg-orange-500
                      py-4
                      text-lg
                      font-bold
                      text-white
                      shadow-lg
                      transition
                      hover:scale-[1.02]
                      hover:bg-orange-600
                    "
                  >

                    ❤️ भुगतान करें

                  </button>

                </form>


                {/* UPI INFORMATION */}

                <div
                  className="
                    mt-6
                    rounded-2xl
                    bg-green-50
                    p-5
                    text-center
                  "
                >

                  <p
                    className="
                      text-sm
                      text-gray-600
                    "
                  >

                    आपकी donation संस्था के सेवा
                    कार्यों में उपयोग की जाएगी।

                  </p>


                  <p
                    className="
                      mt-2
                      text-sm
                      font-semibold
                      text-green-700
                    "
                  >

                    UPI: {UPI_ID}

                  </p>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </section>

  );
}


export default Donate;