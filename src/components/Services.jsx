import { useState } from "react";

import {
  FaBookOpen,
  FaHeartbeat,
  FaLeaf,
  FaHandsHelping,
  FaUsers,
  FaBalanceScale,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

const services = [
  {
    icon: <FaBookOpen />,
    title: "शिक्षा",
    desc: "गरीब एवं जरूरतमंद बच्चों और युवाओं को शिक्षा से जोड़ना।",
    color: "from-green-500 to-green-700",
    details:
      "हमारा उद्देश्य शिक्षा से वंचित बच्चों और युवाओं तक शिक्षा की पहुंच बनाना है। संस्था जरूरतमंद विद्यार्थियों को शिक्षा के लिए प्रोत्साहित करने, जागरूकता बढ़ाने और आवश्यक सहयोग उपलब्ध कराने की दिशा में कार्य करती है।",

    activities: [
      "जरूरतमंद बच्चों को शिक्षा से जोड़ना",
      "शिक्षा के प्रति जागरूकता अभियान",
      "विद्यार्थियों को आवश्यक सहयोग प्रदान करना",
      "ग्रामीण क्षेत्रों में शिक्षा के महत्व को बढ़ावा देना",
      "युवाओं को कौशल एवं ज्ञान के लिए प्रेरित करना",
    ],
  },

  {
    icon: <FaHeartbeat />,
    title: "स्वास्थ्य",
    desc: "स्वास्थ्य शिविर, जागरूकता अभियान एवं सहायता।",
    color: "from-red-400 to-red-600",
    details:
      "स्वस्थ समाज के निर्माण के लिए संस्था स्वास्थ्य जागरूकता और सहायता से जुड़े कार्यों में योगदान देती है। हमारा प्रयास है कि जरूरतमंद लोगों तक स्वास्थ्य संबंधी जानकारी और आवश्यक सहायता पहुंच सके।",

    activities: [
      "स्वास्थ्य जागरूकता अभियान",
      "स्वास्थ्य शिविरों में सहयोग",
      "स्वच्छता एवं स्वस्थ जीवनशैली के प्रति जागरूकता",
      "जरूरतमंद लोगों को स्वास्थ्य संबंधी सहायता",
      "ग्रामीण क्षेत्रों में स्वास्थ्य जागरूकता बढ़ाना",
    ],
  },

  {
    icon: <FaLeaf />,
    title: "पर्यावरण",
    desc: "वृक्षारोपण, स्वच्छता और पर्यावरण संरक्षण।",
    color: "from-emerald-500 to-green-700",
    details:
      "पर्यावरण संरक्षण हमारी प्रमुख प्राथमिकताओं में से एक है। संस्था लोगों, विशेषकर युवाओं को प्रकृति और पर्यावरण के प्रति जिम्मेदार बनाने के लिए विभिन्न जागरूकता एवं संरक्षण गतिविधियों में भाग लेती है।",

    activities: [
      "वृक्षारोपण अभियान",
      "स्वच्छता अभियान",
      "पर्यावरण संरक्षण के प्रति जागरूकता",
      "प्लास्टिक प्रदूषण को कम करने के लिए जागरूकता",
      "प्राकृतिक संसाधनों के संरक्षण को बढ़ावा देना",
    ],
  },

  {
    icon: <FaHandsHelping />,
    title: "समाज सेवा",
    desc: "जरूरतमंद लोगों की हर संभव सहायता।",
    color: "from-orange-400 to-orange-600",
    details:
      "समाज सेवा के माध्यम से संस्था जरूरतमंद और कमजोर वर्ग के लोगों के साथ खड़े होने का प्रयास करती है। हमारा उद्देश्य समाज में सहयोग, संवेदनशीलता और मानवता की भावना को मजबूत करना है।",

    activities: [
      "जरूरतमंद लोगों की सहायता",
      "सामाजिक जागरूकता अभियान",
      "जरूरत के समय सहयोग एवं सहायता",
      "ग्रामीण एवं पिछड़े क्षेत्रों में सामाजिक कार्य",
      "मानव सेवा एवं जनहित के कार्य",
    ],
  },

  {
    icon: <FaUsers />,
    title: "युवा उत्थान",
    desc: "युवाओं को राष्ट्र निर्माण के लिए प्रेरित करना।",
    color: "from-blue-500 to-indigo-600",
    details:
      "युवा किसी भी समाज और राष्ट्र की सबसे बड़ी शक्ति हैं। संस्था युवाओं को सामाजिक जिम्मेदारियों के प्रति जागरूक करने और सकारात्मक कार्यों में उनकी भागीदारी बढ़ाने के लिए प्रयासरत है।",

    activities: [
      "युवाओं को सामाजिक कार्यों से जोड़ना",
      "नेतृत्व क्षमता को बढ़ावा देना",
      "युवाओं में सामाजिक जिम्मेदारी की भावना विकसित करना",
      "राष्ट्र निर्माण में युवाओं की भागीदारी",
      "सकारात्मक एवं रचनात्मक गतिविधियों को बढ़ावा देना",
    ],
  },

  {
    icon: <FaBalanceScale />,
    title: "समानता",
    desc: "जाति, धर्म एवं रंगभेद से ऊपर उठकर समाज को जोड़ना।",
    color: "from-purple-500 to-fuchsia-600",
    details:
      "हम एक ऐसे समाज की कल्पना करते हैं जहां हर व्यक्ति को समान सम्मान और अवसर मिले। संस्था जाति, धर्म, रंग और सामाजिक भेदभाव से ऊपर उठकर लोगों के बीच एकता और भाईचारे को बढ़ावा देने का प्रयास करती है।",

    activities: [
      "सामाजिक समानता के प्रति जागरूकता",
      "भेदभाव के विरुद्ध जागरूकता",
      "समाज में एकता एवं भाईचारे को बढ़ावा देना",
      "सभी वर्गों के प्रति सम्मान की भावना",
      "समान अवसर और सामाजिक सहयोग को बढ़ावा देना",
    ],
  },
];

export default function Services() {
  const [selectedService, setSelectedService] = useState(null);

  const closeModal = () => {
    setSelectedService(null);
  };

  return (
    <>
      {/* =====================================================
          SERVICES SECTION
      ===================================================== */}

      <section
        id="services"
        className="py-24 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-5">

          {/* ===============================
              SECTION HEADING
          =============================== */}

          <div className="text-center">

            <span className="text-orange-500 font-semibold uppercase tracking-widest">
              हमारी सेवाएँ
            </span>

            <h2 className="text-4xl md:text-5xl font-bold mt-3 text-green-800">
              समाज के लिए हमारा योगदान
            </h2>

            <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
              शिक्षा, स्वास्थ्य, पर्यावरण और समाज सेवा के माध्यम से
              एक बेहतर भारत के निर्माण का प्रयास।
            </p>

          </div>

          {/* ===============================
              SERVICE CARDS
          =============================== */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

            {services.map((item, index) => (

              <div
                key={index}
                className="
                  group
                  bg-white
                  rounded-3xl
                  shadow-md
                  hover:shadow-2xl
                  transition
                  duration-500
                  overflow-hidden
                  hover:-translate-y-3
                "
              >

                {/* TOP COLOR LINE */}

                <div
                  className={`h-2 bg-gradient-to-r ${item.color}`}
                ></div>

                <div className="p-8">

                  {/* ICON */}

                  <div
                    className={`
                      w-16
                      h-16
                      rounded-2xl
                      bg-gradient-to-r
                      ${item.color}
                      flex
                      items-center
                      justify-center
                      text-white
                      text-3xl
                      mb-6
                      group-hover:rotate-6
                      transition
                    `}
                  >
                    {item.icon}
                  </div>

                  {/* TITLE */}

                  <h3 className="text-2xl font-bold text-gray-800">
                    {item.title}
                  </h3>

                  {/* SHORT DESCRIPTION */}

                  <p className="text-gray-600 mt-4 leading-7">
                    {item.desc}
                  </p>

                  {/* LEARN MORE */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedService(item)
                    }
                    className="
                      mt-6
                      text-green-700
                      font-semibold
                      hover:text-orange-500
                      transition
                      inline-flex
                      items-center
                      gap-1
                      cursor-pointer
                    "
                  >
                    और जानें
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>

      {/* =====================================================
          SERVICE DETAILS MODAL
      ===================================================== */}

      {selectedService && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            p-4
            bg-black/60
            backdrop-blur-sm
          "
          onClick={closeModal}
        >

          {/* MODAL */}

          <div
            className="
              relative
              w-full
              max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              bg-white
              rounded-3xl
              shadow-2xl
              animate-[fadeIn_0.25s_ease-out]
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* TOP GRADIENT */}

            <div
              className={`
                h-3
                bg-gradient-to-r
                ${selectedService.color}
              `}
            ></div>

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={closeModal}
              aria-label="बंद करें"
              className="
                absolute
                top-5
                right-5
                w-10
                h-10
                rounded-full
                bg-gray-100
                hover:bg-red-100
                text-gray-600
                hover:text-red-600
                flex
                items-center
                justify-center
                transition
                cursor-pointer
              "
            >
              <FaTimes />
            </button>

            <div className="p-7 md:p-10">

              {/* ICON + TITLE */}

              <div className="flex items-center gap-5 pr-10">

                <div
                  className={`
                    flex-shrink-0
                    w-16
                    h-16
                    rounded-2xl
                    bg-gradient-to-r
                    ${selectedService.color}
                    flex
                    items-center
                    justify-center
                    text-white
                    text-3xl
                  `}
                >
                  {selectedService.icon}
                </div>

                <div>
                  <span className="text-orange-500 text-sm font-semibold">
                    हमारी सेवा
                  </span>

                  <h2 className="text-3xl font-bold text-green-800">
                    {selectedService.title}
                  </h2>
                </div>

              </div>

              {/* DIVIDER */}

              <div className="h-px bg-gray-200 my-7"></div>

              {/* DETAILS */}

              <h3 className="text-xl font-bold text-gray-800 mb-3">
                इस सेवा के बारे में
              </h3>

              <p className="text-gray-600 leading-8">
                {selectedService.details}
              </p>

              {/* ACTIVITIES */}

              <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">
                हमारे प्रमुख कार्य
              </h3>

              <div className="space-y-3">

                {selectedService.activities.map(
                  (activity, index) => (

                    <div
                      key={index}
                      className="
                        flex
                        items-start
                        gap-3
                        p-3
                        rounded-xl
                        bg-green-50
                      "
                    >

                      <FaCheckCircle
                        className="
                          flex-shrink-0
                          mt-1
                          text-green-600
                        "
                      />

                      <span className="text-gray-700">
                        {activity}
                      </span>

                    </div>

                  )
                )}

              </div>

              {/* CLOSE */}

              <div className="flex justify-end mt-8">

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    px-6
                    py-3
                    rounded-xl
                    bg-green-700
                    hover:bg-green-800
                    text-white
                    font-semibold
                    transition
                    cursor-pointer
                  "
                >
                  बंद करें
                </button>

              </div>

            </div>

          </div>

        </div>

      )}
    </>
  );
}