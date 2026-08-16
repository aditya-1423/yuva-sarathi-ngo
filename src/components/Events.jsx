import { useEffect, useState } from "react";

import {
  CalendarDays,
  MapPin,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

/* =========================================================
   ADMIN EMAIL
========================================================= */

const ADMIN_EMAIL = "adityaverma1325@gmail.com";

/* =========================================================
   MAXIMUM EVENT IMAGES
========================================================= */

const MAX_EVENT_IMAGES = 10;

/* =========================================================
   EXTRACT IMAGE VALUE
========================================================= */

const extractImageValue = (item) => {
  if (!item) {
    return null;
  }

  if (typeof item === "string") {
    return item.trim() || null;
  }

  if (typeof item === "object") {
    return (
      item.url ||
      item.downloadURL ||
      item.downloadUrl ||
      item.src ||
      item.imageUrl ||
      item.imageURL ||
      item.fullPath ||
      item.path ||
      item.filePath ||
      null
    );
  }

  return null;
};

/* =========================================================
   GET RAW EVENT IMAGES
========================================================= */

const getRawEventImages = (event) => {
  if (!event) {
    return [];
  }

  let images = [];

  /*
    NEW EVENT FORMAT
    createEvent() में images galleryImages के अंदर save हो रही हैं।
  */

  if (
    Array.isArray(event.galleryImages) &&
    event.galleryImages.length > 0
  ) {
    images = event.galleryImages;
  }

  /* OLD / OTHER FORMATS */

  else if (
    Array.isArray(event.imageUrls) &&
    event.imageUrls.length > 0
  ) {
    images = event.imageUrls;
  }

  else if (
    Array.isArray(event.images) &&
    event.images.length > 0
  ) {
    images = event.images;
  }

  else if (
    Array.isArray(event.photos) &&
    event.photos.length > 0
  ) {
    images = event.photos;
  }

  else if (event.imageUrl) {
    images = [event.imageUrl];
  }

  else if (event.imageURL) {
    images = [event.imageURL];
  }

  else if (event.image) {
    images = [event.image];
  }

  else if (event.photo) {
    images = [event.photo];
  }

  else if (event.img) {
    images = [event.img];
  }

  else if (event.photoUrl) {
    images = [event.photoUrl];
  }

  else if (event.photoURL) {
    images = [event.photoURL];
  }

  else if (
    event.file &&
    typeof event.file === "object"
  ) {
    images = [event.file];
  }

  return images
    .map(extractImageValue)
    .filter(Boolean)
    .slice(0, MAX_EVENT_IMAGES);
};

/* =========================================================
   CHECK NORMAL IMAGE URL
========================================================= */

const isNormalImageUrl = (value) => {
  if (!value) {
    return false;
  }

  const cleanValue = String(value).trim();

  return (
    cleanValue.startsWith("http://") ||
    cleanValue.startsWith("https://") ||
    cleanValue.startsWith("data:image/") ||
    cleanValue.startsWith("blob:")
  );
};

/* =========================================================
   GET EVENT IMAGES
========================================================= */

const getEventImages = (event) => {
  if (!event) {
    return [];
  }

  if (
    Array.isArray(event.resolvedImages) &&
    event.resolvedImages.length > 0
  ) {
    return event.resolvedImages
      .filter(Boolean)
      .slice(0, MAX_EVENT_IMAGES);
  }

  return getRawEventImages(event)
    .filter(isNormalImageUrl)
    .slice(0, MAX_EVENT_IMAGES);
};

/* =========================================================
   TITLE
========================================================= */

const getTitle = (event) => {
  return (
    event?.title ||
    event?.name ||
    event?.eventName ||
    "सामाजिक कार्यक्रम"
  );
};

/* =========================================================
   DESCRIPTION
========================================================= */

const getDescription = (event) => {
  return (
    event?.description ||
    event?.details ||
    event?.about ||
    "संस्था द्वारा आयोजित सामाजिक कार्यक्रम।"
  );
};

/* =========================================================
   DATE
========================================================= */

const getDate = (event) => {
  return (
    event?.date ||
    event?.eventDate ||
    event?.programDate ||
    null
  );
};

/* =========================================================
   LOCATION
========================================================= */

const getLocation = (event) => {
  return (
    event?.location ||
    event?.place ||
    event?.address ||
    "छत्तीसगढ़"
  );
};

/* =========================================================
   DATE FORMAT
========================================================= */

const formatDate = (value) => {
  if (!value) {
    return "तिथि जल्द घोषित होगी";
  }

  try {
    let date;

    if (
      value &&
      typeof value.toDate === "function"
    ) {
      date = value.toDate();
    }

    else if (value instanceof Date) {
      date = value;
    }

    else if (typeof value === "number") {
      date = new Date(value);
    }

    else if (typeof value === "string") {
      const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
      );

      if (match) {
        date = new Date(
          Number(match[1]),
          Number(match[2]) - 1,
          Number(match[3])
        );
      }

      else {
        date = new Date(value);
      }
    }

    else {
      date = new Date(value);
    }

    if (
      !date ||
      Number.isNaN(date.getTime())
    ) {
      return String(value);
    }

    return date.toLocaleDateString(
      "hi-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  catch (error) {
    console.error(
      "Date formatting error:",
      error
    );

    return "तिथि उपलब्ध नहीं";
  }
};

/* =========================================================
   EVENTS COMPONENT
========================================================= */

const Events = () => {

  /* =======================================================
     STATES
  ======================================================= */

  const [events, setEvents] = useState(null);

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);

  const [fullImage, setFullImage] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [isAdmin, setIsAdmin] =
    useState(false);

  /* =======================================================
     FIREBASE AUTH
  ======================================================= */

  useEffect(() => {

    /*
      Firebase auth instance
      उसी Firebase project से आएगा।
    */

    import("firebase/auth").then(
      ({
        getAuth,
        onAuthStateChanged,
      }) => {

        const auth = getAuth();

        const unsubscribe =
          onAuthStateChanged(
            auth,
            (user) => {

              const userEmail =
                user?.email
                  ?.toLowerCase()
                  ?.trim() || "";

              const adminEmail =
                ADMIN_EMAIL
                  .toLowerCase()
                  .trim();

              setIsAdmin(
                Boolean(
                  userEmail &&
                  userEmail === adminEmail
                )
              );
            }
          );

        return unsubscribe;
      }
    );

  }, []);

  /* =======================================================
     FIREBASE EVENTS
  ======================================================= */

  useEffect(() => {

    let unsubscribe = null;

    const eventsRef =
      collection(
        db,
        "events"
      );

    const eventsQuery =
      query(
        eventsRef,
        orderBy(
          "createdAt",
          "desc"
        )
      );

    unsubscribe =
      onSnapshot(
        eventsQuery,
        (snapshot) => {

          try {

            const eventData =
              snapshot.docs.map(
                (eventDoc) => {

                  const data =
                    eventDoc.data();

                  const rawImages =
                    getRawEventImages(
                      data
                    );

                  return {
                    id: eventDoc.id,
                    ...data,

                    resolvedImages:
                      rawImages
                        .filter(
                          isNormalImageUrl
                        )
                        .slice(
                          0,
                          MAX_EVENT_IMAGES
                        ),
                  };
                }
              );

            setEvents(
              eventData
            );

          }

          catch (error) {

            console.error(
              "Events processing error:",
              error
            );

            setEvents([]);
          }
        },

        (error) => {

          console.error(
            "Events fetch error:",
            error
          );

          setEvents([]);
        }
      );

    return () => {

      if (unsubscribe) {
        unsubscribe();
      }

    };

  }, []);

  /* =======================================================
     OPEN EVENT
  ======================================================= */

  const openEvent = (event) => {

    setSelectedEvent(
      event
    );

    setCurrentImageIndex(
      0
    );

    setFullImage(
      null
    );
  };

  /* =======================================================
     CLOSE EVENT
  ======================================================= */

  const closeEvent = () => {

    setSelectedEvent(
      null
    );

    setCurrentImageIndex(
      0
    );

    setFullImage(
      null
    );
  };

  /* =======================================================
     NEXT IMAGE
  ======================================================= */

  const nextImage = () => {

    if (!selectedEvent) {
      return;
    }

    const images =
      getEventImages(
        selectedEvent
      );

    if (
      images.length <= 1
    ) {
      return;
    }

    setCurrentImageIndex(
      (previousIndex) => {

        if (
          previousIndex >=
          images.length - 1
        ) {
          return 0;
        }

        return previousIndex + 1;
      }
    );
  };

  /* =======================================================
     PREVIOUS IMAGE
  ======================================================= */

  const previousImage = () => {

    if (!selectedEvent) {
      return;
    }

    const images =
      getEventImages(
        selectedEvent
      );

    if (
      images.length <= 1
    ) {
      return;
    }

    setCurrentImageIndex(
      (previousIndex) => {

        if (
          previousIndex <= 0
        ) {
          return images.length - 1;
        }

        return previousIndex - 1;
      }
    );
  };

  /* =======================================================
     DELETE EVENT
  ======================================================= */

  const deleteEvent = async (
    event
  ) => {

    /*
      Extra protection
    */

    if (!isAdmin) {

      window.alert(
        "केवल Admin कार्यक्रम हटा सकता है।"
      );

      return;
    }

    if (!event?.id) {
      return;
    }

    const confirmed =
      window.confirm(
        `क्या आप "${getTitle(
          event
        )}" कार्यक्रम को हटाना चाहते हैं?\n\nयह कार्यक्रम वेबसाइट से हट जाएगा।`
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingId(
        event.id
      );

      /*
        Firestore से event delete
      */

      await deleteDoc(
        doc(
          db,
          "events",
          event.id
        )
      );

      /*
        Local UI update
      */

      setEvents(
        (previousEvents) => {

          if (
            !Array.isArray(
              previousEvents
            )
          ) {
            return previousEvents;
          }

          return previousEvents.filter(
            (item) =>
              item.id !== event.id
          );
        }
      );

      /*
        अगर modal में वही event खुला है
      */

      setSelectedEvent(
        (previousEvent) => {

          if (
            previousEvent?.id ===
            event.id
          ) {
            return null;
          }

          return previousEvent;
        }
      );

      setCurrentImageIndex(
        0
      );

      setFullImage(
        null
      );

    }

    catch (error) {

      console.error(
        "Delete event error:",
        error
      );

      window.alert(
        "कार्यक्रम हटाया नहीं जा सका। कृपया दोबारा कोशिश करें।"
      );

    }

    finally {

      setDeletingId(
        null
      );
    }
  };

  /* =======================================================
     IMAGE ERROR
  ======================================================= */

  const handleImageError = (
    imageEvent
  ) => {

    const image =
      imageEvent.currentTarget;

    image.style.display =
      "none";

    const fallback =
      image.parentElement?.querySelector(
        "[data-image-fallback]"
      );

    if (fallback) {

      fallback.style.display =
        "flex";
    }
  };

  /* =======================================================
     KEYBOARD CONTROLS
  ======================================================= */

  useEffect(() => {

    const handleKeyDown =
      (event) => {

        if (fullImage) {

          if (
            event.key ===
            "Escape"
          ) {

            setFullImage(
              null
            );

            return;
          }

          if (
            event.key ===
            "ArrowRight"
          ) {

            nextImage();

            return;
          }

          if (
            event.key ===
            "ArrowLeft"
          ) {

            previousImage();

            return;
          }

          return;
        }

        if (!selectedEvent) {
          return;
        }

        if (
          event.key ===
          "Escape"
        ) {

          closeEvent();

          return;
        }

        if (
          event.key ===
          "ArrowRight"
        ) {

          nextImage();

          return;
        }

        if (
          event.key ===
          "ArrowLeft"
        ) {

          previousImage();
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

  });

  /* =======================================================
     LOADING
  ======================================================= */

  if (events === null) {

    return (

      <section
        id="events"
        className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-green-50 to-white"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">

            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm mb-4">
              युवा सारथी सेवा संस्था
            </span>

            <h2 className="text-4xl sm:text-5xl font-bold text-green-700">
              हमारे कार्यक्रम
            </h2>

            <p className="mt-4 text-gray-600 text-lg">
              संस्था द्वारा आयोजित प्रमुख सामाजिक कार्यक्रम
            </p>

          </div>

          <div className="flex justify-center py-20">

            <Loader2
              size={42}
              className="animate-spin text-green-600"
            />

          </div>

        </div>

      </section>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (

    <>

      <section
        id="events"
        className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-green-50 to-white"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* HEADER */}

          <div className="text-center mb-12 sm:mb-16">

            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm mb-4">
              युवा सारथी सेवा संस्था
            </span>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-700">
              हमारे कार्यक्रम
            </h2>

            <p className="mt-4 text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              संस्था द्वारा आयोजित प्रमुख सामाजिक कार्यक्रम
              एवं जनसेवा गतिविधियां
            </p>

          </div>

          {/* NO EVENTS */}

          {events.length === 0 && (

            <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl shadow-md border border-green-100 p-10 sm:p-14">

              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-5">

                <CalendarDays
                  size={38}
                  className="text-green-600"
                />

              </div>

              <h3 className="text-2xl font-bold text-gray-800">
                अभी कोई कार्यक्रम उपलब्ध नहीं है
              </h3>

              <p className="mt-3 text-gray-600">
                जल्द ही हमारे आगामी कार्यक्रम यहां दिखाई देंगे।
              </p>

            </div>
          )}

          {/* EVENTS */}

          {events.length > 0 && (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">

              {events.map(
                (event) => {

                  const images =
                    getEventImages(
                      event
                    );

                  const title =
                    getTitle(
                      event
                    );

                  const description =
                    getDescription(
                      event
                    );

                  const date =
                    getDate(
                      event
                    );

                  const location =
                    getLocation(
                      event
                    );

                  const mainImage =
                    images[0] ||
                    null;

                  return (

                    <article
                      key={
                        event.id
                      }
                      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
                    >

                      {/* CARD IMAGE */}

                      <div className="relative w-full h-56 sm:h-64 bg-gray-100 overflow-hidden">

                        {mainImage ? (

                          <div className="relative w-full h-full">

                            <img
                              src={
                                mainImage
                              }
                              alt={
                                title
                              }
                              onError={
                                handleImageError
                              }
                              className="w-full h-full object-cover"
                            />

                            <div
                              data-image-fallback
                              style={{
                                display:
                                  "none",
                              }}
                              className="absolute inset-0 items-center justify-center bg-green-50"
                            >

                              <div className="text-center">

                                <ImageIcon
                                  size={
                                    48
                                  }
                                  className="mx-auto text-green-500"
                                />

                                <p className="mt-2 text-green-700 font-medium">
                                  कार्यक्रम की तस्वीर
                                </p>

                              </div>

                            </div>

                          </div>

                        ) : (

                          <div className="w-full h-full flex items-center justify-center bg-green-50">

                            <div className="text-center">

                              <ImageIcon
                                size={
                                  48
                                }
                                className="mx-auto text-green-500"
                              />

                              <p className="mt-2 text-green-700 font-medium">
                                कार्यक्रम की तस्वीर
                              </p>

                            </div>

                          </div>
                        )}

                        {/* PHOTO COUNT */}

                        {images.length >
                          1 && (

                          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-semibold">

                            📷{" "}
                            {
                              images.length
                            }{" "}
                            तस्वीरें

                          </div>
                        )}

                        {/* PROGRAM TAG */}

                        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                          कार्यक्रम
                        </div>

                      </div>

                      {/* CARD CONTENT */}

                      <div className="p-6 sm:p-7 flex flex-col flex-1">

                        <h3 className="text-xl sm:text-2xl font-bold text-green-700 leading-tight mb-5">
                          {
                            title
                          }
                        </h3>

                        {/* DATE */}

                        <div className="flex items-start gap-3 mb-3">

                          <CalendarDays
                            size={
                              20
                            }
                            className="text-orange-500 shrink-0 mt-0.5"
                          />

                          <span className="text-gray-700">
                            {
                              formatDate(
                                date
                              )
                            }
                          </span>

                        </div>

                        {/* LOCATION */}

                        <div className="flex items-start gap-3 mb-4">

                          <MapPin
                            size={
                              20
                            }
                            className="text-red-500 shrink-0 mt-0.5"
                          />

                          <span className="text-gray-700">
                            {
                              location
                            }
                          </span>

                        </div>

                        {/* DESCRIPTION */}

                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6 line-clamp-3">
                          {
                            description
                          }
                        </p>

                        {/* BUTTONS */}

                        <div className="mt-auto flex gap-2">

                          {/* DETAILS */}

                          <button
                            type="button"
                            onClick={() =>
                              openEvent(
                                event
                              )
                            }
                            className="flex-1 flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-3 px-5 rounded-xl font-semibold transition-all duration-200"
                          >

                            विवरण देखें

                            <ChevronRight
                              size={
                                18
                              }
                            />

                          </button>

                          {/* DELETE - ADMIN ONLY */}

                          {isAdmin && (

                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                event.id
                              }
                              onClick={() =>
                                deleteEvent(
                                  event
                                )
                              }
                              title="कार्यक्रम हटाएं"
                              aria-label="कार्यक्रम हटाएं"
                              className="w-14 shrink-0 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >

                              {deletingId ===
                              event.id ? (

                                <Loader2
                                  size={
                                    20
                                  }
                                  className="animate-spin"
                                />

                              ) : (

                                <Trash2
                                  size={
                                    20
                                  }
                                />

                              )}

                            </button>

                          )}

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </div>

      </section>

      {/* ==================================================
          EVENT DETAIL MODAL
      ================================================== */}

      {selectedEvent && (

        <div
          className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={
            closeEvent
          }
        >

          <div
            className="relative bg-white w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* CLOSE */}

            <button
              type="button"
              onClick={
                closeEvent
              }
              aria-label="Close"
              className="absolute top-4 right-4 z-40 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition"
            >

              <X size={22} />

            </button>

            {/* IMAGE SLIDER */}

            {(() => {

              const images =
                getEventImages(
                  selectedEvent
                );

              const safeIndex =
                images.length > 0
                  ? Math.min(
                      currentImageIndex,
                      images.length - 1
                    )
                  : 0;

              const currentImage =
                images[
                  safeIndex
                ] || null;

              return (

                <div>

                  {/* MAIN IMAGE */}

                  <div className="relative bg-black w-full h-[280px] sm:h-[420px] lg:h-[520px] flex items-center justify-center overflow-hidden">

                    {currentImage ? (

                      <div className="relative w-full h-full flex items-center justify-center">

                        <img
                          src={
                            currentImage
                          }
                          alt={
                            getTitle(
                              selectedEvent
                            )
                          }
                          onError={
                            handleImageError
                          }
                          onClick={() =>
                            setFullImage(
                              currentImage
                            )
                          }
                          className="w-full h-full object-contain cursor-zoom-in"
                        />

                        <div
                          data-image-fallback
                          style={{
                            display:
                              "none",
                          }}
                          className="absolute inset-0 items-center justify-center bg-black text-white"
                        >

                          <div className="text-center">

                            <ImageIcon
                              size={
                                60
                              }
                              className="mx-auto mb-3 opacity-70"
                            />

                            <p>
                              तस्वीर उपलब्ध नहीं है
                            </p>

                          </div>

                        </div>

                      </div>

                    ) : (

                      <div className="text-white text-center">

                        <ImageIcon
                          size={
                            60
                          }
                          className="mx-auto mb-3 opacity-70"
                        />

                        <p>
                          तस्वीर उपलब्ध नहीं है
                        </p>

                      </div>
                    )}

                    {/* PREVIOUS */}

                    {images.length >
                      1 && (

                      <button
                        type="button"
                        aria-label="Previous image"
                        onClick={
                          previousImage
                        }
                        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition z-20"
                      >

                        <ChevronLeft
                          size={
                            28
                          }
                        />

                      </button>
                    )}

                    {/* NEXT */}

                    {images.length >
                      1 && (

                      <button
                        type="button"
                        aria-label="Next image"
                        onClick={
                          nextImage
                        }
                        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition z-20"
                      >

                        <ChevronRight
                          size={
                            28
                          }
                        />

                      </button>
                    )}

                    {/* COUNTER */}

                    {images.length >
                      0 && (

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-20">

                        {
                          safeIndex + 1
                        }

                        {" / "}

                        {
                          images.length
                        }

                      </div>
                    )}

                  </div>

                  {/* THUMBNAILS */}

                  {images.length >
                    1 && (

                    <div className="flex gap-2 p-3 overflow-x-auto bg-gray-100">

                      {images.map(
                        (
                          image,
                          index
                        ) => (

                          <button
                            key={`${image}-${index}`}
                            type="button"
                            onClick={() =>
                              setCurrentImageIndex(
                                index
                              )
                            }
                            aria-label={`तस्वीर ${
                              index + 1
                            } देखें`}
                            className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition ${
                              safeIndex ===
                              index
                                ? "border-green-600"
                                : "border-transparent"
                            }`}
                          >

                            <img
                              src={
                                image
                              }
                              alt={`तस्वीर ${
                                index + 1
                              }`}
                              onError={
                                handleImageError
                              }
                              className="w-full h-full object-cover"
                            />

                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>
              );

            })()}

            {/* EVENT INFORMATION */}

            <div className="p-6 sm:p-8">

              <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-5">
                {
                  getTitle(
                    selectedEvent
                  )
                }
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                {/* DATE */}

                <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-4">

                  <CalendarDays
                    size={
                      22
                    }
                    className="text-orange-500"
                  />

                  <div>

                    <p className="text-xs text-gray-500">
                      तिथि
                    </p>

                    <p className="font-semibold text-gray-800">
                      {
                        formatDate(
                          getDate(
                            selectedEvent
                          )
                        )
                      }
                    </p>

                  </div>

                </div>

                {/* LOCATION */}

                <div className="flex items-center gap-3 bg-red-50 rounded-xl p-4">

                  <MapPin
                    size={
                      22
                    }
                    className="text-red-500"
                  />

                  <div>

                    <p className="text-xs text-gray-500">
                      स्थान
                    </p>

                    <p className="font-semibold text-gray-800">
                      {
                        getLocation(
                          selectedEvent
                        )
                      }
                    </p>

                  </div>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  कार्यक्रम के बारे में
                </h3>

                <p className="text-gray-600 leading-8">
                  {
                    getDescription(
                      selectedEvent
                    )
                  }
                </p>

              </div>

              <p className="mt-6 text-sm text-gray-400 text-center">
                तस्वीर पर क्लिक करके उसे बड़े आकार में देखें
              </p>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          FULL SCREEN IMAGE
      ================================================== */}

      {fullImage && (

        <div
          className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4"
          onClick={() =>
            setFullImage(
              null
            )
          }
        >

          {/* CLOSE */}

          <button
            type="button"
            onClick={() =>
              setFullImage(
                null
              )
            }
            aria-label="Close image"
            className="absolute top-5 right-5 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >

            <X size={25} />

          </button>

          {/* PREVIOUS */}

          {selectedEvent &&
            getEventImages(
              selectedEvent
            ).length > 1 && (

              <button
                type="button"
                onClick={(
                  event
                ) => {

                  event.stopPropagation();

                  previousImage();
                }}
                aria-label="Previous image"
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >

                <ChevronLeft
                  size={30}
                />

              </button>
            )}

          {/* FULL IMAGE */}

          <img
            src={
              fullImage
            }
            alt="कार्यक्रम की तस्वीर"
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
            onError={
              handleImageError
            }
            className="max-w-[96vw] max-h-[94vh] w-auto h-auto object-contain rounded-lg"
          />

          {/* NEXT */}

          {selectedEvent &&
            getEventImages(
              selectedEvent
            ).length > 1 && (

              <button
                type="button"
                onClick={(
                  event
                ) => {

                  event.stopPropagation();

                  nextImage();
                }}
                aria-label="Next image"
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              >

                <ChevronRight
                  size={30}
                />

              </button>
            )}

        </div>
      )}

    </>
  );
};

export default Events;