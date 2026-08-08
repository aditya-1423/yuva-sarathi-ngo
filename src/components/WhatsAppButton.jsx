import { FaWhatsapp } from "react-icons/fa";

function WhatsAppButton() {

  const phoneNumber = "9238022531"; // अपना WhatsApp नंबर डालना

  return (

    <a
      href={`https://wa.me/${phoneNumber}?text=नमस्ते%20युवा%20सारथी%20सेवा%20संस्था,%20मुझे%20जानकारी%20चाहिए।`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >

      <div
        className="
        w-16
        h-16
        rounded-full
        bg-[#25D366]
        flex
        items-center
        justify-center
        shadow-2xl
        hover:scale-110
        transition-all
        duration-300
        animate-bounce
        "
      >

        <FaWhatsapp className="text-white text-4xl" />

      </div>

      {/* Tooltip */}

      <div
        className="
        absolute
        right-6
        top-1/2
        -translate-y-1/2
        bg-white
        text-gray-800
        px-4
        py-2
        rounded-xl
        shadow-lg
        opacity-0
        group-hover:opacity-100
        transition
        whitespace-nowrap
        "
      >

        WhatsApp पर संपर्क करें

      </div>

    </a>

  );
}

export default WhatsAppButton;