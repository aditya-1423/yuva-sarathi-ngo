import { FaUsers, FaMapMarkerAlt, FaHandsHelping } from "react-icons/fa";

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-24"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80"
          alt="NGO Work"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/70 to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 py-12">

        <div className="max-w-3xl">

          <span className="inline-block bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
            #स्वार्थी नहीं सारथी बनो#
          </span>

          <h1 className="text-white font-bold leading-tight mt-6 text-4xl sm:text-5xl lg:text-7xl">
            <span>युवा </span>

            <span className="text-orange-400">
              सारथी
            </span>

            <span> सेवा संस्था</span>

            <br />

            <span>छत्तीसगढ़</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-200 leading-8 max-w-2xl">
            युवा उत्थान, शिक्षा, स्वास्थ्य, पर्यावरण संरक्षण और
            समाज में समानता के लिए समर्पित एक सामाजिक पहल।
          </p>

          <div className="flex flex-wrap gap-4 mt-8">

            <a
              href="#volunteer"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition duration-300 shadow-lg"
            >
              हमसे जुड़ें
            </a>

            <a
              href="#about"
              className="border border-white text-white px-8 py-3 rounded-xl hover:bg-white hover:text-green-800 transition duration-300"
            >
              और जानें
            </a>

          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-16 max-w-5xl">

          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 flex items-center gap-4 hover:-translate-y-2 transition duration-300">

            <FaUsers className="text-4xl text-green-700" />

            <div>
              <h3 className="text-3xl font-bold text-gray-800">
                0
              </h3>

              <p className="text-gray-600">
                सदस्य
              </p>
            </div>

          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 flex items-center gap-4 hover:-translate-y-2 transition duration-300">

            <FaMapMarkerAlt className="text-4xl text-orange-500" />

            <div>
              <h3 className="text-3xl font-bold text-gray-800">
                
              </h3>

              <p className="text-gray-600">
                जिले
              </p>
            </div>

          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 flex items-center gap-4 hover:-translate-y-2 transition duration-300">

            <FaHandsHelping className="text-4xl text-green-700" />

            <div>
              <h3 className="text-3xl font-bold text-gray-800">
                0
              </h3>

              <p className="text-gray-600">
                सेवा कार्य
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;