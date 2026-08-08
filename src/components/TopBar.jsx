import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart } from "react-icons/fa";

function TopBar() {
  return (
    <div className="bg-green-900 text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row justify-between items-center gap-2">

        <div className="flex flex-wrap items-center gap-5">
          <span className="flex items-center gap-2">
            <FaPhoneAlt className="text-orange-400" />
            +91 XXXXXXXXXX
          </span>

          <span className="flex items-center gap-2">
            <FaEnvelope className="text-orange-400" />
            info@yuvasarthi.org
          </span>

          <span className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-orange-400" />
            कबीरधाम, छत्तीसगढ़
          </span>
        </div>

        <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg flex items-center gap-2 transition">
          <FaHeart />
          दान करें
        </button>

      </div>
    </div>
  );
}

export default TopBar;