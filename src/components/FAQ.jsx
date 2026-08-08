import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

function FAQ() {

  const faqs = [
    {
      question: "युवा सारथी सेवा संस्था क्या कार्य करती है?",
      answer:
        "हम शिक्षा, स्वास्थ्य, पर्यावरण संरक्षण, स्वच्छता एवं समाज सेवा के क्षेत्र में विभिन्न कार्यक्रम आयोजित करते हैं।",
    },
    {
      question: "मैं संस्था से कैसे जुड़ सकता हूँ?",
      answer:
        "आप Volunteer सेक्शन में जाकर अपना फॉर्म भर सकते हैं। हमारी टीम आपसे संपर्क करेगी।",
    },
    {
      question: "क्या संस्था पूरे छत्तीसगढ़ में कार्य करती है?",
      answer:
        "हाँ, हमारा उद्देश्य पूरे छत्तीसगढ़ में सामाजिक एवं जनकल्याण कार्यों को बढ़ावा देना है।",
    },
    {
      question: "दान की गई राशि कहाँ उपयोग होती है?",
      answer:
        "दान की राशि शिक्षा, स्वास्थ्य, पर्यावरण, गरीब एवं जरूरतमंद लोगों की सहायता और सामाजिक कार्यक्रमों में उपयोग की जाती है।",
    },
    {
      question: "संस्था से संपर्क कैसे करें?",
      answer:
        "Contact सेक्शन में दिए गए मोबाइल नंबर, ईमेल एवं पते के माध्यम से संपर्क कर सकते हैं।",
    },
  ];

  const [open, setOpen] = useState(null);

  return (
    <section
      id="faq"
      className="py-24 bg-gradient-to-b from-white to-green-50"
    >
      <div className="max-w-4xl mx-auto px-5">

        <div className="text-center mb-14">

          <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">

            FAQ

          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-5 text-green-800">

            अक्सर पूछे जाने वाले प्रश्न

          </h2>

          <p className="text-gray-600 mt-5">

            संस्था से जुड़े सामान्य प्रश्नों के उत्तर

          </p>

        </div>

        <div className="space-y-5">

          {faqs.map((faq, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >

              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="w-full flex justify-between items-center p-6 text-left"
              >

                <span className="font-semibold text-lg">

                  {faq.question}

                </span>

                <FaChevronDown
                  className={`transition duration-300 ${
                    open === index ? "rotate-180 text-green-700" : ""
                  }`}
                />

              </button>

              <div
                className={`transition-all duration-500 overflow-hidden ${
                  open === index
                    ? "max-h-60 p-6 pt-0"
                    : "max-h-0"
                }`}
              >

                <p className="text-gray-600 leading-8">

                  {faq.answer}

                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default FAQ;