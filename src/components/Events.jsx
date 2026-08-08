import { useEffect, useState } from "react";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";

// ==============================
// DEFAULT EVENTS
// ==============================

const defaultEvents = [
  {
    id: "blood-camp",
    title: "रक्तदान शिविर",
    date: "15 अगस्त 2026",
    location: "कवर्धा",
    description:
      "रक्तदान करके जरूरतमंद लोगों की सहायता करें।",
    image:
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800",
  },

  {
    id: "tree-plantation",
    title: "वृक्षारोपण अभियान",
    date: "20 अगस्त 2026",
    location: "भिलाई",
    description:
      "हरियाली और स्वच्छ पर्यावरण के लिए वृक्षारोपण अभियान।",
    image:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
  },

  {
    id: "education-campaign",
    title: "शिक्षा अभियान",
    date: "25 अगस्त 2026",
    location: "राजनांदगांव",
    description:
      "बच्चों की शिक्षा के लिए जागरूकता और सहायता अभियान।",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
  },
];

// ==============================
// DATE FORMAT
// ==============================

function formatEventDate(date) {
  if (!date) {
    return "";
  }

  if (typeof date !== "string") {
    return date;
  }

  if (!date.includes("-")) {
    return date;
  }

  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

// ==============================
// EVENTS COMPONENT
// ==============================

function Events() {
  const [events, setEvents] = useState(defaultEvents);

  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);

  // ==============================
  // LOAD EVENTS FROM FIREBASE
  // ==============================

  useEffect(() => {
    async function loadEvents() {
      try {
        const eventsQuery = query(
          collection(db, "events"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(eventsQuery);

        const firebaseEvents = snapshot.docs.map(
          (document) => {
            const data = document.data();

            return {
              id: document.id,
              ...data,

              image:
                data.image ||
                "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800",
            };
          }
        );

        // Firebase में event है तो वही दिखेंगे
        // Firebase खाली है तो default events दिखेंगे
        setEvents(
          firebaseEvents.length > 0
            ? firebaseEvents
            : defaultEvents
        );
      } catch (error) {
        console.error(
          "Events load error:",
          error
        );

        // Error होने पर default events
        setEvents(defaultEvents);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // ==============================
  // OPEN EVENT DETAILS
  // ==============================

  function handleOpenEvent(event) {
    setSelectedEvent(event);
  }

  // ==============================
  // CLOSE EVENT DETAILS
  // ==============================

  function handleCloseEvent() {
    setSelectedEvent(null);
  }

  return (
    <section
      id="events"
      className="py-20 bg-gradient-to-b from-green-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-5">

        {/* ==============================
            HEADER
        ============================== */}

        <div className="text-center mb-14">

          <h2 className="text-4xl md:text-5xl font-bold text-green-800">
            हमारे कार्यक्रम
          </h2>

          <p className="text-gray-600 mt-3">
            संस्था द्वारा आयोजित प्रमुख सामाजिक कार्यक्रम
          </p>

        </div>

        {/* ==============================
            LOADING
        ============================== */}

        {loading && (
          <p className="text-center text-gray-500 mb-6">
            कार्यक्रम लोड हो रहे हैं...
          </p>
        )}

        {/* ==============================
            EVENTS GRID
        ============================== */}

        {!loading && events.length === 0 && (
          <p className="text-center text-gray-500">
            अभी कोई कार्यक्रम उपलब्ध नहीं है।
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >

              {/* COVER IMAGE */}

              <img
                src={
                  event.image ||
                  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800"
                }
                alt={event.title}
                className="w-full h-56 object-cover"
              />

              {/* EVENT CONTENT */}

              <div className="p-6">

                <h3 className="text-2xl font-bold text-green-700">
                  {event.title}
                </h3>

                {/* DATE */}

                <div className="flex items-center gap-2 mt-4 text-gray-600">

                  <FaCalendarAlt className="text-orange-500" />

                  <span>
                    {formatEventDate(event.date)}
                  </span>

                </div>

                {/* LOCATION */}

                <div className="flex items-center gap-2 mt-2 text-gray-600">

                  <FaMapMarkerAlt className="text-red-500" />

                  <span>
                    {event.location}
                  </span>

                </div>

                {/* SHORT DESCRIPTION */}

                {event.description && (
                  <p className="mt-4 text-gray-600 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* DETAILS BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    handleOpenEvent(event)
                  }
                  className="mt-6 w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
                >
                  विवरण देखें
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* =================================================
          EVENT DETAIL MODAL
      ================================================= */}

      {selectedEvent && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-5"
          onClick={handleCloseEvent}
        >

          {/* MODAL BOX */}

          <div
            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ==============================
                COVER IMAGE
            ============================== */}

            <div className="relative">

              <img
                src={
                  selectedEvent.image ||
                  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800"
                }
                alt={selectedEvent.title}
                className="w-full h-64 md:h-80 object-cover"
              />

              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={handleCloseEvent}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 flex items-center justify-center text-gray-700 hover:bg-white shadow-lg"
                aria-label="Close"
              >
                <FaTimes />
              </button>

            </div>

            {/* ==============================
                EVENT DETAILS
            ============================== */}

            <div className="p-7">

              {/* TITLE */}

              <h2 className="text-3xl font-bold text-green-800">
                {selectedEvent.title}
              </h2>

              {/* DATE */}

              <div className="flex items-center gap-3 mt-5 text-gray-700">

                <FaCalendarAlt className="text-orange-500" />

                <span>
                  {formatEventDate(
                    selectedEvent.date
                  )}
                </span>

              </div>

              {/* LOCATION */}

              <div className="flex items-center gap-3 mt-3 text-gray-700">

                <FaMapMarkerAlt className="text-red-500" />

                <span>
                  {selectedEvent.location}
                </span>

              </div>

              {/* DESCRIPTION */}

              <div className="mt-6">

                <h3 className="text-xl font-bold text-green-700 mb-2">
                  कार्यक्रम के बारे में
                </h3>

                <p className="text-gray-600 leading-8 whitespace-pre-line">
                  {selectedEvent.description ||
                    "इस कार्यक्रम की जानकारी जल्द उपलब्ध होगी।"}
                </p>

              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={handleCloseEvent}
                className="mt-7 w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
              >
                बंद करें
              </button>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Events;