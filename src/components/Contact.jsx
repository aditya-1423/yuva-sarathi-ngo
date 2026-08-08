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

function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("कृपया अपना नाम दर्ज करें");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("कृपया अपना ईमेल दर्ज करें");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("कृपया मोबाइल नंबर दर्ज करें");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("कृपया अपना संदेश लिखें");
      return;
    }

    toast.success("🎉 आपका संदेश सफलतापूर्वक भेज दिया गया।");

    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-b from-green-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-5">

        <div className="text-center mb-16">

          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
            संपर्क करें
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mt-5">
            हमसे संपर्क करें
          </h2>

          <p className="text-gray-600 mt-5 max-w-2xl mx-auto">
            किसी भी प्रकार की जानकारी, सहयोग या स्वयंसेवक बनने के लिए
            हमसे संपर्क करें।
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Left Side */}

          <div className="space-y-6">

            <div className="bg-white rounded-2xl shadow-lg p-6 flex gap-5">

              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <FaPhoneAlt className="text-green-700 text-xl"/>
              </div>

              <div>
                <h3 className="font-bold text-lg">फ़ोन</h3>
                <p className="text-gray-600">+91 9238022531</p>
              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex gap-5">

              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                <FaEnvelope className="text-orange-500 text-xl"/>
              </div>

              <div>
                <h3 className="font-bold text-lg">ईमेल</h3>
                <p className="text-gray-600">
                  info@yuvasarathi.org
                </p>
              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex gap-5">

              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <FaMapMarkerAlt className="text-red-500 text-xl"/>
              </div>

              <div>
                <h3 className="font-bold text-lg">पता</h3>
                <p className="text-gray-600">
                  कवर्धा, छत्तीसगढ़
                </p>
              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 flex gap-5">

              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <FaClock className="text-blue-600 text-xl"/>
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  कार्यालय समय
                </h3>

                <p className="text-gray-600">
                  सोमवार - शनिवार
                </p>

                <p className="text-gray-600">
                  सुबह 10:00 - शाम 6:00
                </p>

              </div>

            </div>

            <div className="flex gap-4">

              <a href="#" className="w-12 h-12 rounded-full bg-blue-600 text-white flex justify-center items-center">
                <FaFacebookF/>
              </a>

              <a href="#" className="w-12 h-12 rounded-full bg-pink-500 text-white flex justify-center items-center">
                <FaInstagram/>
              </a>

              <a href="#" className="w-12 h-12 rounded-full bg-sky-600 text-white flex justify-center items-center">
                <FaLinkedinIn/>
              </a>

            </div>

          </div>

          {/* Right Side */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h3 className="text-2xl font-bold text-green-800 mb-6">
              हमें संदेश भेजें
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                type="text"
                name="name"
                placeholder="आपका नाम"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-xl p-4 outline-none focus:border-green-600"
              />

              <input
                type="email"
                name="email"
                placeholder="ईमेल"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-xl p-4 outline-none focus:border-green-600"
              />

              <input
                type="tel"
                name="phone"
                placeholder="मोबाइल नंबर"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-xl p-4 outline-none focus:border-green-600"
              />

              <textarea
                rows="5"
                name="message"
                placeholder="अपना संदेश लिखें..."
                value={formData.message}
                onChange={handleChange}
                className="w-full border rounded-xl p-4 resize-none outline-none focus:border-green-600"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-semibold transition"
              >
                📩 संदेश भेजें
              </button>

            </form>
                      </div>

        </div>

        {/* Google Map */}

        {/* <div className="mt-12">

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=Kabirdham,Chhattisgarh&output=embed"
              className="w-full h-[450px]"
              loading="lazy"
            ></iframe>

          </div>

        </div> */}

      </div>

    </section>
  );

}

export default Contact;