import { useEffect, useState } from "react";

import {
  CalendarDays,
  MapPin,
  Loader2,
  ChevronRight,
  Image as ImageIcon,
  X,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ==================================================
  // FIREBASE EVENTS
  // ==================================================

  useEffect(() => {
    const eventsRef = collection(db, "events");

    const eventsQuery = query(
      eventsRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const firebaseEvents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(firebaseEvents);
        setLoading(false);
      },
      (error) => {
        console.error("Firebase Events Error:", error);

        setEvents([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==================================================
  // ESC KEY - CLOSE MODAL
  // ==================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedEvent(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  // ==================================================
  // DATE
  // ==================================================

  const formatDate = (value) => {
    if (!value) {
      return "तिथि जल्द घोषित होगी";
    }

    try {
      let date;

      if (value?.toDate) {
        date = value.toDate();
      } else if (value instanceof Date) {
        date = value;
      } else {
        date = new Date(value);
      }

      if (Number.isNaN(date.getTime())) {
        return String(value);
      }

      return date.toLocaleDateString("hi-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "तिथि उपलब्ध नहीं";
    }
  };

  // ==================================================
  // IMAGE
  // ==================================================

  const getImage = (event) => {
    return (
      event?.imageUrl ||
      event?.image ||
      event?.photo ||
      event?.img ||
      ""
    );
  };

  // ==================================================
  // TITLE
  // ==================================================

  const getTitle = (event) => {
    return (
      event?.title ||
      event?.name ||
      event?.eventName ||
      "सामाजिक कार्यक्रम"
    );
  };

  // ==================================================
  // DESCRIPTION
  // ==================================================

  const getDescription = (event) => {
    return (
      event?.description ||
      event?.details ||
      event?.about ||
      "संस्था द्वारा आयोजित सामाजिक कार्यक्रम।"
    );
  };

  // ==================================================
  // DATE
  // ==================================================

  const getDate = (event) => {
    return (
      event?.date ||
      event?.eventDate ||
      event?.programDate ||
      null
    );
  };

  // ==================================================
  // LOCATION
  // ==================================================

  const getLocation = (event) => {
    return (
      event?.location ||
      event?.place ||
      event?.address ||
      "छत्तीसगढ़"
    );
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section
        id="events"
        className="
          w-full
          min-h-screen
          pt-28
          pb-20
          bg-gradient-to-b
          from-green-50
          to-white
          scroll-mt-20
        "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <span className="
              inline-block
              px-4
              py-2
              rounded-full
              bg-green-100
              text-green-700
              font-semibold
              text-sm
              mb-4
            ">
              युवा सारथी सेवा संस्था
            </span>

            <h2 className="
              text-4xl
              sm:text-5xl
              font-bold
              text-green-700
            ">
              हमारे कार्यक्रम
            </h2>

            <p className="
              mt-4
              text-gray-600
              text-base
              sm:text-lg
            ">
              संस्था द्वारा आयोजित प्रमुख सामाजिक कार्यक्रम
            </p>

          </div>

          <div className="
            flex
            justify-center
            items-center
            py-20
          ">
            <Loader2
              size={42}
              className="animate-spin text-green-600"
            />
          </div>

        </div>
      </section>
    );
  }

  // ==================================================
  // MAIN
  // ==================================================

  return (
    <>
      <section
        id="events"
        className="
          w-full
          min-h-screen
          pt-28
          pb-20
          bg-gradient-to-b
          from-green-50
          to-white
          scroll-mt-20
          overflow-x-hidden
        "
      >

        <div className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        ">

          {/* ==========================================
              HEADER
          ========================================== */}

          <div className="
            text-center
            mb-12
            sm:mb-16
          ">

            <span className="
              inline-block
              px-4
              py-2
              rounded-full
              bg-green-100
              text-green-700
              font-semibold
              text-sm
              mb-4
            ">
              युवा सारथी सेवा संस्था
            </span>

            <h2 className="
              text-4xl
              sm:text-5xl
              lg:text-6xl
              font-bold
              text-green-700
              leading-tight
            ">
              हमारे कार्यक्रम
            </h2>

            <p className="
              mt-4
              text-gray-600
              text-base
              sm:text-lg
              max-w-2xl
              mx-auto
              leading-relaxed
            ">
              संस्था द्वारा आयोजित प्रमुख सामाजिक कार्यक्रम
              एवं जनसेवा गतिविधियां
            </p>

          </div>

          {/* ==========================================
              NO EVENTS
          ========================================== */}

          {events.length === 0 ? (

            <div className="
              w-full
              max-w-2xl
              mx-auto
              text-center
              bg-white
              rounded-3xl
              shadow-md
              border
              border-green-100
              p-8
              sm:p-12
            ">

              <div className="
                w-20
                h-20
                mx-auto
                rounded-full
                bg-green-100
                flex
                items-center
                justify-center
                mb-5
              ">

                <CalendarDays
                  size={38}
                  className="text-green-600"
                />

              </div>

              <h3 className="
                text-xl
                sm:text-2xl
                font-bold
                text-gray-800
              ">
                अभी कोई कार्यक्रम उपलब्ध नहीं है
              </h3>

              <p className="
                mt-3
                text-gray-600
                text-sm
                sm:text-base
              ">
                जल्द ही हमारे आगामी कार्यक्रम यहां दिखाई देंगे।
              </p>

            </div>

          ) : (

            /* ========================================
               EVENTS GRID
            ======================================== */

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-7
              lg:gap-8
              items-stretch
            ">

              {events.map((event) => {

                const image = getImage(event);
                const title = getTitle(event);
                const description = getDescription(event);
                const date = getDate(event);
                const location = getLocation(event);

                return (
                  <article
                    key={event.id}
                    className="
                      w-full
                      min-w-0
                      bg-white
                      rounded-3xl
                      overflow-hidden
                      shadow-lg
                      border
                      border-gray-100
                      hover:shadow-2xl
                      transition-all
                      duration-300
                      flex
                      flex-col
                      h-full
                    "
                  >

                    {/* =================================
                        IMAGE
                    ================================= */}

                    <div className="
                      relative
                      w-full
                      h-56
                      sm:h-64
                      bg-gray-100
                      overflow-hidden
                      shrink-0
                    ">

                      {image ? (

                        <img
                          src={image}
                          alt={title}
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-500
                            hover:scale-105
                          "
                          onError={(e) => {

                            e.currentTarget.style.display =
                              "none";

                            const fallback =
                              e.currentTarget.parentElement?.querySelector(
                                ".event-image-fallback"
                              );

                            if (fallback) {
                              fallback.classList.remove(
                                "hidden"
                              );

                              fallback.classList.add(
                                "flex"
                              );
                            }

                          }}
                        />

                      ) : null}

                      {/* IMAGE FALLBACK */}

                      <div
                        className={`
                          event-image-fallback
                          absolute
                          inset-0
                          ${
                            image
                              ? "hidden"
                              : "flex"
                          }
                          items-center
                          justify-center
                          bg-green-50
                        `}
                      >

                        <div className="text-center">

                          <ImageIcon
                            size={48}
                            className="
                              mx-auto
                              text-green-500
                            "
                          />

                          <p className="
                            mt-2
                            text-green-700
                            font-medium
                          ">
                            कार्यक्रम की तस्वीर
                          </p>

                        </div>

                      </div>

                      {/* BADGE */}

                      <div className="
                        absolute
                        top-4
                        right-4
                        bg-black/60
                        text-white
                        px-3
                        py-1.5
                        rounded-full
                        text-xs
                        font-medium
                        backdrop-blur-sm
                      ">
                        कार्यक्रम
                      </div>

                    </div>

                    {/* =================================
                        CONTENT
                    ================================= */}

                    <div className="
                      p-6
                      sm:p-7
                      flex
                      flex-col
                      flex-1
                      min-w-0
                    ">

                      {/* TITLE */}

                      <h3 className="
                        text-xl
                        sm:text-2xl
                        font-bold
                        text-green-700
                        leading-tight
                        mb-5
                        break-words
                      ">
                        {title}
                      </h3>

                      {/* DATE */}

                      <div className="
                        flex
                        items-start
                        gap-3
                        mb-3
                      ">

                        <CalendarDays
                          size={20}
                          className="
                            text-orange-500
                            shrink-0
                            mt-0.5
                          "
                        />

                        <span className="
                          text-gray-700
                          text-sm
                          sm:text-base
                        ">
                          {formatDate(date)}
                        </span>

                      </div>

                      {/* LOCATION */}

                      <div className="
                        flex
                        items-start
                        gap-3
                        mb-4
                      ">

                        <MapPin
                          size={20}
                          className="
                            text-red-500
                            shrink-0
                            mt-0.5
                          "
                        />

                        <span className="
                          text-gray-700
                          text-sm
                          sm:text-base
                          break-words
                        ">
                          {location}
                        </span>

                      </div>

                      {/* DESCRIPTION */}

                      <p className="
                        text-gray-600
                        leading-relaxed
                        text-sm
                        sm:text-base
                        mb-6
                        break-words
                      ">
                        {description}
                      </p>

                      {/* BUTTON */}

                      <div className="mt-auto pt-2">

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedEvent(event)
                          }
                          className="
                            w-full
                            flex
                            items-center
                            justify-center
                            gap-2
                            bg-green-700
                            hover:bg-green-800
                            text-white
                            py-3
                            px-5
                            rounded-xl
                            font-semibold
                            text-sm
                            sm:text-base
                            transition-all
                            duration-200
                            active:scale-[0.98]
                          "
                        >
                          विवरण देखें

                          <ChevronRight size={18} />

                        </button>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </div>
      </section>

      {/* =================================================
          EVENT DETAILS MODAL
      ================================================= */}

      {selectedEvent && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/75
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-3
            sm:p-6
          "
          onClick={() =>
            setSelectedEvent(null)
          }
        >

          {/* MODAL */}

          <div
            className="
              relative
              w-full
              max-w-4xl
              max-h-[94vh]
              overflow-y-auto
              bg-white
              rounded-2xl
              sm:rounded-3xl
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setSelectedEvent(null)
              }
              className="
                absolute
                top-3
                right-3
                sm:top-5
                sm:right-5
                z-30
                w-10
                h-10
                rounded-full
                bg-black/65
                hover:bg-black/85
                text-white
                flex
                items-center
                justify-center
                transition
              "
              aria-label="Close"
            >
              <X size={22} />
            </button>

            {/* =========================================
                FULL IMAGE
            ========================================= */}

            {getImage(selectedEvent) && (

              <div className="
                w-full
                bg-black
                flex
                items-center
                justify-center
                rounded-t-2xl
                sm:rounded-t-3xl
                overflow-hidden
              ">

                <img
                  src={getImage(selectedEvent)}
                  alt={getTitle(selectedEvent)}
                  className="
                    block
                    w-auto
                    h-auto
                    max-w-full
                    max-h-[75vh]
                    object-contain
                  "
                />

              </div>

            )}

            {/* =========================================
                DETAILS
            ========================================= */}

            <div className="
              p-6
              sm:p-8
            ">

              {/* BADGE */}

              <span className="
                inline-block
                px-3
                py-1.5
                rounded-full
                bg-green-100
                text-green-700
                text-xs
                font-semibold
                mb-4
              ">
                कार्यक्रम
              </span>

              {/* TITLE */}

              <h2 className="
                text-2xl
                sm:text-3xl
                font-bold
                text-green-700
                leading-tight
                mb-6
                break-words
              ">
                {getTitle(selectedEvent)}
              </h2>

              {/* DATE */}

              <div className="
                flex
                items-start
                gap-3
                mb-5
              ">

                <CalendarDays
                  size={22}
                  className="
                    text-orange-500
                    shrink-0
                    mt-0.5
                  "
                />

                <div>

                  <p className="
                    text-xs
                    text-gray-500
                    mb-1
                  ">
                    कार्यक्रम की तिथि
                  </p>

                  <p className="
                    text-gray-800
                    font-medium
                  ">
                    {formatDate(
                      getDate(selectedEvent)
                    )}
                  </p>

                </div>

              </div>

              {/* LOCATION */}

              <div className="
                flex
                items-start
                gap-3
                mb-6
              ">

                <MapPin
                  size={22}
                  className="
                    text-red-500
                    shrink-0
                    mt-0.5
                  "
                />

                <div>

                  <p className="
                    text-xs
                    text-gray-500
                    mb-1
                  ">
                    स्थान
                  </p>

                  <p className="
                    text-gray-800
                    font-medium
                    break-words
                  ">
                    {getLocation(selectedEvent)}
                  </p>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="
                border-t
                border-gray-100
                pt-5
              ">

                <h3 className="
                  text-lg
                  sm:text-xl
                  font-bold
                  text-gray-800
                  mb-3
                ">
                  कार्यक्रम के बारे में
                </h3>

                <p className="
                  text-gray-600
                  leading-relaxed
                  whitespace-pre-line
                  break-words
                ">
                  {getDescription(selectedEvent)}
                </p>

              </div>

              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setSelectedEvent(null)
                }
                className="
                  w-full
                  mt-7
                  bg-green-700
                  hover:bg-green-800
                  text-white
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                "
              >
                बंद करें
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Events;