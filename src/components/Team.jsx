import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

import nokeshImage from "../assets/images/nokesh.jpeg";
import gajendraImage from "../assets/logo.png";
import teamImage from "../assets/logo.png";

function Team() {
  const members = [
    {
      id: 1,
      name: "नोकेश कुमार मधुकर",
      role: "संस्थापक",
      image: nokeshImage,
      color: "from-green-700 to-green-900",
    },

    {
      id: 2,
      name: "गजेंद्र सिंह ठाकुर",
      role: "सह-संस्थापक",
      image: gajendraImage,
      color: "from-orange-500 to-orange-600",
    },

    {
      id: 3,
      name: "टीम सदस्य",
      role: "मुख्य स्वयंसेवक",
      image: teamImage,
      color: "from-blue-600 to-blue-800",
    },

    {
      id: 4,
      name: "टीम सदस्य",
      role: "स्वयंसेवक",
      image: teamImage,
      color: "from-pink-500 to-pink-700",
    },

    {
      id: 5,
      name: "टीम सदस्य",
      role: "स्वयंसेवक",
      image: teamImage,
      color: "from-purple-500 to-purple-700",
    },

    {
      id: 6,
      name: "टीम सदस्य",
      role: "स्वयंसेवक",
      image: teamImage,
      color: "from-teal-500 to-teal-700",
    },
  ];

  return (
    <section
      id="team"
      className="py-24 bg-gradient-to-b from-white to-green-50"
    >
      <div className="max-w-7xl mx-auto px-5">

        {/* HEADER */}
        <div className="text-center mb-16">

          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
            हमारी नेतृत्व टीम
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mt-5">
            हमारी टीम
          </h2>

          <p className="text-gray-600 mt-5 max-w-2xl mx-auto leading-8">
            युवा सारथी सेवा संस्था को आगे बढ़ाने वाले समर्पित संस्थापक,
            सह-संस्थापक एवं स्वयंसेवकों की टीम।
          </p>

        </div>

        {/* TEAM GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {members.map((member) => (

            <div
              key={member.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:-translate-y-3 hover:shadow-2xl transition duration-500"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden">

                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition"></div>

              </div>

              {/* CONTENT */}
              <div className="p-6 text-center">

                <h3 className="text-2xl font-bold text-green-800">
                  {member.name}
                </h3>

                <div
                  className={`inline-block mt-3 px-5 py-2 rounded-full text-white bg-gradient-to-r ${member.color}`}
                >
                  {member.role}
                </div>

                {/* SOCIAL */}
                <div className="flex justify-center gap-4 mt-6">

                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition"
                    aria-label={`${member.name} Facebook`}
                  >
                    <FaFacebookF />
                  </a>

                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center hover:scale-110 transition"
                    aria-label={`${member.name} Instagram`}
                  >
                    <FaInstagram />
                  </a>

                  <a
                    href="#"
                    className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center hover:scale-110 transition"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <FaLinkedinIn />
                  </a>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Team;