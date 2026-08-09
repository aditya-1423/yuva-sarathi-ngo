import {
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowUp,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: "f",
      url: "#",
    },
    {
      name: "Instagram",
      icon: "◎",
      url: "#",
    },
    {
      name: "YouTube",
      icon: "▶",
      url: "#",
    },
  ];

  const quickLinks = [
    {
      name: "होम",
      href: "#home",
    },
    {
     name: "हमारी गैलरी",
     href: "#gallery",
   },
  
    {
      name: "हमारे बारे में",
      href: "#about",
    },
    {
      name: "हमारे कार्यक्रम",
      href: "#events",
    },
   
    {
      name: "संपर्क करें",
      href: "#contact",
    },
  ];

  const importantLinks = [
    {
      name: "हमारे सदस्य बनें",
      href: "#volunteer",
    },
    {
      name: "सहयोग करें",
      href: "#donate",
    },
    {
      name: "हमारा मिशन",
      href: "#mission",
    },
    {
      name: "हमारी सेवाएं",
      href: "#services",
    },
    {
      name: "सामान्य प्रश्न",
      href: "#faq",
    },
     
    // {
    //   name: "कार्यक्रम",
    //   href: "#events",
    // },
    // {
    //   name: "हमारी गतिविधियां",
    //   href: "#gallery",
    // },
  ];

  return (
    <footer className="bg-gray-950 text-white">

      {/* =========================
          MAIN FOOTER
      ========================== */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-14">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* =========================
              ABOUT NGO
          ========================== */}
          <div>

            <h2 className="text-2xl font-bold mb-4">
              युवा{" "}
              <span className="text-orange-500">
                सारथी
              </span>
            </h2>

            <p className="text-gray-400 leading-7">
              युवा सारथी सेवा संस्था छत्तीसगढ़ समाज के विकास,
              शिक्षा, स्वास्थ्य, स्वच्छता, पर्यावरण संरक्षण और
              समानता के लिए निरंतर कार्य कर रही है।
            </p>

            <p className="mt-5 text-orange-400 font-semibold">
              #स्वार्थी नहीं सारथी बनो#
            </p>

            {/* =========================
                SOCIAL LINKS
            ========================== */}
            <div className="flex gap-3 mt-6">

              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  aria-label={social.name}
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-gray-800
                    hover:bg-orange-500
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    font-bold
                  "
                >
                  {social.icon}
                </a>
              ))}

            </div>

          </div>

          {/* =========================
              QUICK LINKS
          ========================== */}
          <div>

            <h3 className="text-lg font-bold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3">

              {quickLinks.map((link) => (
                <li key={link.name}>

                  <a
                    href={link.href}
                    className="
                      text-gray-400
                      hover:text-orange-400
                      transition
                    "
                  >
                    {link.name}
                  </a>

                </li>
              ))}

            </ul>

          </div>

          {/* =========================
              IMPORTANT LINKS
          ========================== */}
          <div>

            <h3 className="text-lg font-bold mb-5">
              महत्वपूर्ण
            </h3>

            <ul className="space-y-3">

              {importantLinks.map((link) => (
                <li key={link.name}>

                  <a
                    href={link.href}
                    className="
                      text-gray-400
                      hover:text-orange-400
                      transition
                    "
                  >
                    {link.name}
                  </a>

                </li>
              ))}

            </ul>

          </div>

          {/* =========================
              CONTACT
          ========================== */}
          <div>

            <h3 className="text-lg font-bold mb-5">
              संपर्क करें
            </h3>

            <div className="space-y-5">

              {/* Address */}
              <div className="flex items-start gap-3">

                <MapPin
                  size={21}
                  className="
                    text-orange-500
                    mt-1
                    flex-shrink-0
                  "
                />

                <p className="text-gray-400 leading-6">
                  छत्तीसगढ़, भारत
                </p>

              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">

                <Phone
                  size={20}
                  className="
                    text-orange-500
                    flex-shrink-0
                  "
                />

                <a
                  href="tel:+919999999999"
                  className="
                    text-gray-400
                    hover:text-orange-400
                    transition
                  "
                >
                  +91 9238022531
                </a>

              </div>

              {/* Email */}
              <div className="flex items-center gap-3">

                <Mail
                  size={20}
                  className="
                    text-orange-500
                    flex-shrink-0
                  "
                />

                <a
                  href="mailto:info@yuvasarathi.org"
                  className="
                    text-gray-400
                    hover:text-orange-400
                    transition
                    break-all
                  "
                >
                  info@yuvasarathi.org
                </a>

              </div>

            </div>

            {/* Donate Button */}
            <a
              href="#donate"
              className="
                inline-flex
                items-center
                justify-center
                mt-7
                px-6
                py-3
                bg-orange-500
                hover:bg-orange-600
                rounded-lg
                font-semibold
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              सहयोग करें
            </a>

          </div>

        </div>

      </div>

      {/* =========================
          BOTTOM BAR
      ========================== */}
      <div className="border-t border-gray-800">

        <div
          className="
            max-w-7xl
            mx-auto
            px-6
            sm:px-8
            lg:px-10
            py-5
          "
        >

          <div
            className="
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-4
            "
          >

            {/* Copyright */}
            <p
              className="
                text-sm
                text-gray-500
                text-center
                md:text-left
              "
            >
              © {new Date().getFullYear()} युवा सारथी सेवा संस्था
              छत्तीसगढ़। सभी अधिकार सुरक्षित।
            </p>

            {/* Made With */}
            <p
              className="
                text-sm
                text-gray-500
                flex
                items-center
                gap-1
              "
            >
              Made with

              <Heart
                size={15}
                className="
                  text-red-500
                  fill-red-500
                "
              />

              for society
            </p>

            {/* Back To Top */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="
                w-10
                h-10
                rounded-full
                bg-gray-800
                hover:bg-orange-500
                flex
                items-center
                justify-center
                transition-all
                duration-300
                hover:-translate-y-1
              "
            >
              <ArrowUp size={18} />
            </button>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;