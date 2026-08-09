import {
  FaUserPlus,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Volunteer() {
  return (
    <section id="volunteer" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <span className="text-orange-500 font-semibold tracking-widest">
              हमसे जुड़ें
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mt-4 leading-tight">
              बदलाव का हिस्सा
              <br />
              बनें
            </h2>

            <p className="text-gray-600 mt-6 leading-8 text-lg">
              आप भी युवा सारथी सेवा संस्था से जुड़कर समाज सेवा और
              राष्ट्र निर्माण में अपना महत्वपूर्ण योगदान दे सकते हैं।
            </p>

            <div className="mt-10 space-y-6">

              {/* Membership */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl">
                  <FaUserPlus />
                </div>

                <div>
                  <h4 className="font-semibold text-lg">
                    सदस्य बनें
                  </h4>

                  <p className="text-gray-600">
                    संस्था की सदस्यता लेकर समाज सेवा में योगदान दें।
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xl">
                  <FaPhone />
                </div>

                <div>
                  <h4 className="font-semibold text-lg">
                    संपर्क करें
                  </h4>

                  <p className="text-gray-600">
                    सदस्यता या संस्था से संबंधित जानकारी के लिए हमसे संपर्क करें।
                  </p>
                </div>
              </div>

              {/* Work Area */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <h4 className="font-semibold text-lg">
                    कार्य क्षेत्र
                  </h4>

                  <p className="text-gray-600">
                    कबीरधाम, कवर्धा एवं छत्तीसगढ़ के विभिन्न जिले।
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Membership Form */}
          <div className="bg-white rounded-[30px] shadow-xl p-8">

            <h3 className="text-3xl font-bold text-green-800 mb-8 text-center">
              सदस्यता आवेदन
            </h3>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="पूरा नाम"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <input
                type="tel"
                placeholder="मोबाइल नंबर"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <input
                type="email"
                placeholder="ईमेल पता"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <input
                type="text"
                placeholder="जिला"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              <textarea
                rows="5"
                placeholder="आप संस्था से क्यों जुड़ना चाहते हैं?"
                className="w-full p-4 rounded-xl border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-700 to-green-900 text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition duration-300 shadow-lg"
              >
                ❤️ सदस्य बनें
              </button>

            </form>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Volunteer;