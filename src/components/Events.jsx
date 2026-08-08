import {
  useEffect,
  useState,
} from "react";

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


// =====================================
// DEFAULT EVENTS
// =====================================

const defaultEvents = [

  {
    id: "blood-camp",

    title: "रक्तदान शिविर",

    date: "15 अगस्त 2026",

    location: "कवर्धा",

    description:
      "रक्तदान करके जरूरतमंद लोगों की सहायता करें।",

    image:
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200",
  },


  {
    id: "tree-plantation",

    title: "वृक्षारोपण अभियान",

    date: "20 अगस्त 2026",

    location: "भिलाई",

    description:
      "हरियाली और स्वच्छ पर्यावरण के लिए वृक्षारोपण अभियान।",

    image:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200",
  },


  {
    id: "education-campaign",

    title: "शिक्षा अभियान",

    date: "25 अगस्त 2026",

    location: "राजनांदगांव",

    description:
      "बच्चों की शिक्षा के लिए जागरूकता और सहायता अभियान।",

    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200",
  },

];


// =====================================
// DATE FORMAT
// =====================================

function formatEventDate(date) {

  if (!date) {
    return "";
  }

  if (
    typeof date !== "string" ||
    !date.includes("-")
  ) {
    return date;
  }

  return new Intl.DateTimeFormat(
    "hi-IN",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(
    new Date(
      `${date}T00:00:00`
    )
  );
}


// =====================================
// EVENTS COMPONENT
// =====================================

function Events() {

  const [
    events,
    setEvents,
  ] = useState(
    defaultEvents
  );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    selectedEvent,
    setSelectedEvent,
  ] = useState(null);


  // =====================================
  // LOAD EVENTS
  // =====================================

  useEffect(() => {

    async function loadEvents() {

      try {

        const eventsQuery =
          query(
            collection(
              db,
              "events"
            ),

            orderBy(
              "createdAt",
              "desc"
            )
          );


        const snapshot =
          await getDocs(
            eventsQuery
          );


        const firebaseEvents =
          snapshot.docs.map(
            (document) => {

              const data =
                document.data();


              return {

                id:
                  document.id,

                ...data,

                image:
                  data.image ||
                  "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200",

              };

            }
          );


        setEvents([
          ...firebaseEvents,
          ...defaultEvents,
        ]);

      }

      catch (error) {

        console.error(
          "Events load error:",
          error
        );


        setEvents(
          defaultEvents
        );

      }

      finally {

        setLoading(false);

      }

    }


    loadEvents();

  }, []);


  // =====================================
  // CLOSE EVENT
  // =====================================

  const closeEvent = () => {

    setSelectedEvent(null);

  };


  // =====================================
  // ESC KEY
  // =====================================

  useEffect(() => {

    const handleKeyDown =
      (event) => {

        if (
          event.key ===
          "Escape"
        ) {

          closeEvent();

        }

      };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, []);


  // =====================================
  // UI
  // =====================================

  return (

    <section
      id="events"
      className="py-20 bg-gradient-to-b from-green-50 to-white"
    >

      <div className="max-w-7xl mx-auto px-5">


        {/* HEADER */}

        <div className="text-center mb-14">

          <h2 className="text-4xl md:text-5xl font-bold text-green-800">

            हमारे कार्यक्रम

          </h2>


          <p className="text-gray-600 mt-3">

            संस्था द्वारा आयोजित प्रमुख सामाजिक कार्यक्रम

          </p>

        </div>


        {/* LOADING */}

        {loading && (

          <p className="text-center text-gray-500 mb-6">

            कार्यक्रम लोड हो रहे हैं...

          </p>

        )}


        {/* EVENTS GRID */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {events.map(
            (event) => (

              <div
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >


                {/* =================================
                    IMAGE
                ================================= */}

                <button
                  type="button"
                  onClick={() =>
                    setSelectedEvent(
                      event
                    )
                  }
                  className="block w-full bg-gray-100 cursor-pointer focus:outline-none"
                >

                  <div className="w-full h-56 flex items-center justify-center overflow-hidden">

                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="w-full h-full object-contain"
                    />

                  </div>

                </button>


                {/* =================================
                    CONTENT
                ================================= */}

                <div className="p-6">


                  <h3 className="text-2xl font-bold text-green-700">

                    {event.title}

                  </h3>


                  {/* DATE */}

                  <div className="flex items-center gap-2 mt-4 text-gray-600">

                    <FaCalendarAlt className="text-orange-500" />

                    <span>

                      {formatEventDate(
                        event.date
                      )}

                    </span>

                  </div>


                  {/* LOCATION */}

                  <div className="flex items-center gap-2 mt-2 text-gray-600">

                    <FaMapMarkerAlt className="text-red-500" />

                    <span>

                      {event.location}

                    </span>

                  </div>


                  {/* DESCRIPTION */}

                  {event.description && (

                    <p className="mt-4 text-gray-600 line-clamp-2">

                      {event.description}

                    </p>

                  )}


                  {/* DETAIL BUTTON */}

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedEvent(
                        event
                      )
                    }
                    className="mt-6 w-full bg-green-700 text-white py-3 rounded-xl font-semibold hover:bg-green-800 transition"
                  >

                    विवरण देखें

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* =====================================
          FULL IMAGE MODAL
      ===================================== */}

      {selectedEvent && (

        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-2 sm:p-5"
          onClick={closeEvent}
        >


          <div
            className="bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* =================================
                ORIGINAL FULL IMAGE
            ================================= */}

            <div className="relative bg-black">


              <div className="w-full min-h-[250px] max-h-[75vh] flex items-center justify-center p-2 sm:p-5">

                <img
                  src={
                    selectedEvent.image
                  }
                  alt={
                    selectedEvent.title
                  }
                  className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                />

              </div>


              {/* CLOSE */}

              <button
                type="button"
                onClick={closeEvent}
                className="absolute top-3 right-3 sm:top-5 sm:right-5 w-11 h-11 rounded-full bg-white/95 flex items-center justify-center text-gray-700 hover:bg-white shadow-xl hover:scale-110 transition"
                aria-label="Close"
              >

                <FaTimes />

              </button>

            </div>


            {/* =================================
                EVENT DETAILS
            ================================= */}

            <div className="p-6 md:p-8">


              <h2 className="text-3xl md:text-4xl font-bold text-green-800">

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

              {selectedEvent.description && (

                <div className="mt-6">

                  <h3 className="text-xl font-bold text-green-700 mb-2">

                    कार्यक्रम के बारे में

                  </h3>


                  <p className="text-gray-600 leading-8 whitespace-pre-line">

                    {selectedEvent.description}

                  </p>

                </div>

              )}


              {/* CLOSE */}

              <button
                type="button"
                onClick={closeEvent}
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