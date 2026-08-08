import {
  FaBookOpen,
  FaHeartbeat,
  FaLeaf,
  FaHandsHelping,
  FaUsers,
  FaBalanceScale
} from "react-icons/fa";

const services = [
  {
    icon: <FaBookOpen />,
    title: "शिक्षा",
    desc: "गरीब एवं जरूरतमंद बच्चों और युवाओं को शिक्षा से जोड़ना।",
    color: "from-green-500 to-green-700"
  },
  {
    icon: <FaHeartbeat />,
    title: "स्वास्थ्य",
    desc: "स्वास्थ्य शिविर, जागरूकता अभियान एवं सहायता।",
    color: "from-red-400 to-red-600"
  },
  {
    icon: <FaLeaf />,
    title: "पर्यावरण",
    desc: "वृक्षारोपण, स्वच्छता और पर्यावरण संरक्षण।",
    color: "from-emerald-500 to-green-700"
  },
  {
    icon: <FaHandsHelping />,
    title: "समाज सेवा",
    desc: "जरूरतमंद लोगों की हर संभव सहायता।",
    color: "from-orange-400 to-orange-600"
  },
  {
    icon: <FaUsers />,
    title: "युवा उत्थान",
    desc: "युवाओं को राष्ट्र निर्माण के लिए प्रेरित करना।",
    color: "from-blue-500 to-indigo-600"
  },
  {
    icon: <FaBalanceScale />,
    title: "समानता",
    desc: "जाति, धर्म एवं रंगभेद से ऊपर उठकर समाज को जोड़ना।",
    color: "from-purple-500 to-fuchsia-600"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gray-50">

      <div className="max-w-7xl mx-auto px-5">

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {services.map((item, index) => (

            <div
              key={index}
              className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition duration-500 overflow-hidden hover:-translate-y-3"
            >

              <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>

              <div className="p-8">

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center text-white text-3xl mb-6 group-hover:rotate-6 transition`}>
                  {item.icon}
                </div>

                <h3 className="text-2xl font-bold text-gray-800">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-4 leading-7">
                  {item.desc}
                </p>

                <button className="mt-6 text-green-700 font-semibold hover:text-orange-500 transition">
                  और जानें →
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}