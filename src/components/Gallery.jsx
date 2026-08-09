import { useEffect, useMemo, useState } from "react";

import {
  FaImages,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";

function Gallery() {
  // ==========================================
  // STATES
  // ==========================================

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [showAll, setShowAll] = useState(false);

  const [slideIndex, setSlideIndex] = useState(0);

  // ==========================================
  // ONLY FIRST 8 IMAGES FOR SLIDER
  // ==========================================

  const sliderImages = useMemo(() => {
    return images.slice(0, 8);
  }, [images]);

  // ==========================================
  // LOAD GALLERY FROM FIREBASE
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const loadGallery = async () => {
      try {
        const galleryRef = collection(db, "gallery");

        const snapshot = await getDocs(galleryRef);

        const galleryImages = snapshot.docs
          .map((document) => {
            const data = document.data();

            return {
              id: document.id,

              image:
                data.imageUrl ||
                data.image ||
                data.photo ||
                "",

              caption:
                data.caption ||
                data.title ||
                "संस्था की गतिविधि",

              createdAt:
                data.createdAt || null,
            };
          })
          .filter((item) => item.image);

        // ======================================
        // SORT NEWEST FIRST
        // ======================================

        galleryImages.sort((a, b) => {
          const getTime = (value) => {
            if (!value) {
              return 0;
            }

            if (
              typeof value.toMillis === "function"
            ) {
              return value.toMillis();
            }

            if (value instanceof Date) {
              return value.getTime();
            }

            const time = new Date(value).getTime();

            return Number.isNaN(time)
              ? 0
              : time;
          };

          return (
            getTime(b.createdAt) -
            getTime(a.createdAt)
          );
        });

        if (mounted) {
          setImages(galleryImages);
        }
      } catch (error) {
        console.error(
          "Gallery load error:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadGallery();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================
  // RESPONSIVE VISIBLE COUNT
  // ==========================================

  const getVisibleCount = () => {
    if (typeof window === "undefined") {
      return 1;
    }

    if (window.innerWidth >= 1024) {
      return 3;
    }

    if (window.innerWidth >= 640) {
      return 2;
    }

    return 1;
  };

  // ==========================================
  // VISIBLE COUNT
  // ==========================================

  const visibleCount = getVisibleCount();

  // ==========================================
  // REAL MAX INDEX
  // ==========================================

  const realMaxIndex = Math.max(
    0,
    sliderImages.length - visibleCount
  );

  // ==========================================
  // LOOP SLIDES
  //
  // Example:
  //
  // [1 2 3 4 5 6 7 8]
  // [1 2 3]
  //
  // Extra cloned slides are added at end.
  // ==========================================

  const loopImages = useMemo(() => {
    if (sliderImages.length === 0) {
      return [];
    }

    const cloneCount = Math.min(
      visibleCount,
      sliderImages.length
    );

    const clones = sliderImages.slice(
      0,
      cloneCount
    );

    return [
      ...sliderImages,
      ...clones,
    ];
  }, [sliderImages, visibleCount]);

  // ==========================================
  // AUTO SLIDER
  // ==========================================

  useEffect(() => {
    if (
      showAll ||
      sliderImages.length <= 1
    ) {
      return undefined;
    }

    const timer = setInterval(() => {
      setSlideIndex((current) => {
        return current + 1;
      });
    }, 4000);

    return () => {
      clearInterval(timer);
    };
  }, [
    showAll,
    sliderImages.length,
  ]);

  // ==========================================
  // HANDLE LOOP RESET
  //
  // IMPORTANT:
  // This uses requestAnimationFrame instead
  // of directly calling setState inside effect.
  // ==========================================

  useEffect(() => {
    if (
      sliderImages.length === 0 ||
      slideIndex < sliderImages.length
    ) {
      return undefined;
    }

    const resetTimer = window.setTimeout(() => {
      setSlideIndex(0);
    }, 750);

    return () => {
      window.clearTimeout(resetTimer);
    };
  }, [
    slideIndex,
    sliderImages.length,
  ]);

  // ==========================================
  // NEXT SLIDE
  // ==========================================

  const nextSlide = () => {
    if (sliderImages.length <= 1) {
      return;
    }

    setSlideIndex((current) => {
      return current + 1;
    });
  };

  // ==========================================
  // PREVIOUS SLIDE
  // ==========================================

  const previousSlide = () => {
    if (sliderImages.length <= 1) {
      return;
    }

    setSlideIndex((current) => {
      if (current <= 0) {
        return realMaxIndex;
      }

      return current - 1;
    });
  };

  // ==========================================
  // DOT CLICK
  // ==========================================

  const goToSlide = (index) => {
    setSlideIndex(index);
  };

  // ==========================================
  // OPEN FULL IMAGE
  // ==========================================

  const openImage = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  // ==========================================
  // CLOSE FULL IMAGE
  // ==========================================

  const closeImage = () => {
    setSelectedImage(null);
  };

  // ==========================================
  // PREVIOUS FULL IMAGE
  // ==========================================

  const previousImage = () => {
    if (images.length === 0) {
      return;
    }

    setSelectedIndex((current) => {
      const newIndex =
        current === 0
          ? images.length - 1
          : current - 1;

      setSelectedImage(
        images[newIndex]
      );

      return newIndex;
    });
  };

  // ==========================================
  // NEXT FULL IMAGE
  // ==========================================

  const nextImage = () => {
    if (images.length === 0) {
      return;
    }

    setSelectedIndex((current) => {
      const newIndex =
        current === images.length - 1
          ? 0
          : current + 1;

      setSelectedImage(
        images[newIndex]
      );

      return newIndex;
    });
  };

  // ==========================================
  // KEYBOARD CONTROLS
  // ==========================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedImage) {
        return;
      }

      if (event.key === "Escape") {
        setSelectedImage(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        previousImage();
        return;
      }

      if (event.key === "ArrowRight") {
        nextImage();
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
  }, [selectedImage, images]);

  // ==========================================
  // SCROLL TO GALLERY
  // ==========================================

  const scrollToGallery = () => {
    document
      .getElementById("gallery")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section
        id="gallery"
        className="
          py-24
          bg-gradient-to-b
          from-white
          via-green-50
          to-white
        "
      >
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center">

            <div
              className="
                w-20
                h-20
                mx-auto
                rounded-full
                bg-green-100
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <FaImages className="text-4xl text-green-700" />
            </div>

            <h2
              className="
                text-4xl
                md:text-5xl
                font-bold
                text-green-800
                mt-6
              "
            >
              📸 हमारी गैलरी
            </h2>

            <p className="text-gray-600 mt-5">
              गैलरी लोड हो रही है...
            </p>

          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <>
      <section
        id="gallery"
        className="
          py-24
          bg-gradient-to-b
          from-white
          via-green-50
          to-white
          overflow-hidden
        "
      >
        <div className="max-w-7xl mx-auto px-5">

          {/* ====================================
              HEADER
          ==================================== */}

          <div className="text-center mb-14">

            <div
              className="
                w-20
                h-20
                mx-auto
                rounded-full
                bg-green-100
                flex
                items-center
                justify-center
                shadow-xl
              "
            >
              <FaImages className="text-4xl text-green-700" />
            </div>

            <h2
              className="
                text-4xl
                md:text-5xl
                font-bold
                text-green-800
                mt-6
              "
            >
              📸 हमारी गैलरी
            </h2>

            <p
              className="
                text-gray-600
                mt-5
                max-w-3xl
                mx-auto
                leading-8
                text-lg
              "
            >
              शिक्षा, स्वास्थ्य, पर्यावरण संरक्षण,
              समाज सेवा, रक्तदान, युवा कार्यक्रम
              एवं अन्य सामाजिक गतिविधियों की
              यादगार झलकियाँ।
            </p>

          </div>

          {/* ====================================
              EMPTY
          ==================================== */}

          {images.length === 0 && (
            <div className="text-center py-12">

              <div
                className="
                  w-20
                  h-20
                  mx-auto
                  rounded-full
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                "
              >
                <FaImages className="text-3xl text-gray-400" />
              </div>

              <p
                className="
                  text-gray-500
                  text-lg
                  mt-5
                "
              >
                अभी गैलरी में कोई तस्वीर उपलब्ध नहीं है।
              </p>

            </div>
          )}

          {/* ====================================
              SLIDER
          ==================================== */}

          {sliderImages.length > 0 &&
            !showAll && (
              <>

                <div className="relative">

                  {/* LEFT BUTTON */}

                  {sliderImages.length > 1 && (
                    <button
                      type="button"
                      onClick={previousSlide}
                      aria-label="Previous slide"
                      className="
                        absolute
                        left-1
                        md:left-0
                        top-1/2
                        -translate-y-1/2
                        z-30
                        w-12
                        h-12
                        rounded-full
                        bg-white
                        shadow-xl
                        flex
                        items-center
                        justify-center
                        text-green-700
                        hover:bg-green-700
                        hover:text-white
                        transition-all
                        duration-300
                      "
                    >
                      <FaChevronLeft />
                    </button>
                  )}

                  {/* =================================
                      SLIDER WINDOW
                  ================================= */}

                  <div
                    className="
                      overflow-hidden
                      mx-4
                      md:mx-10
                    "
                  >

                    <div
                      className="
                        flex
                        will-change-transform
                      "
                      style={{
                        transform: `translate3d(-${
                          slideIndex *
                          (100 / visibleCount)
                        }%, 0, 0)`,

                        transition:
                          slideIndex >=
                          sliderImages.length
                            ? "transform 750ms cubic-bezier(0.22, 1, 0.36, 1)"
                            : "transform 750ms cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                      onTransitionEnd={() => {
                        if (
                          slideIndex >=
                          sliderImages.length
                        ) {
                          setSlideIndex(0);
                        }
                      }}
                    >

                      {loopImages.map(
                        (item, index) => (
                          <div
                            key={`${item.id}-${index}`}
                            className="
                              shrink-0
                              w-full
                              sm:w-1/2
                              lg:w-1/3
                              px-3
                            "
                          >

                            <div
                              onClick={() => {
                                const realIndex =
                                  index %
                                  sliderImages.length;

                                openImage(
                                  item,
                                  realIndex
                                );
                              }}
                              className="
                                group
                                relative
                                overflow-hidden
                                rounded-3xl
                                shadow-xl
                                bg-black
                                cursor-pointer
                                h-72
                                sm:h-80
                                lg:h-96
                              "
                            >

                              <img
                                src={item.image}
                                alt={item.caption}
                                loading={
                                  index < 3
                                    ? "eager"
                                    : "lazy"
                                }
                                decoding="async"
                                className="
                                  w-full
                                  h-full
                                  object-cover
                                  transition-transform
                                  duration-700
                                  ease-out
                                  group-hover:scale-105
                                "
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />

                              {/* OVERLAY */}

                              <div
                                className="
                                  absolute
                                  inset-0
                                  bg-black/0
                                  group-hover:bg-black/50
                                  transition-all
                                  duration-500
                                  flex
                                  items-end
                                "
                              >

                                <div
                                  className="
                                    w-full
                                    p-5
                                    translate-y-5
                                    opacity-0
                                    group-hover:translate-y-0
                                    group-hover:opacity-100
                                    transition-all
                                    duration-500
                                  "
                                >
                                  <p
                                    className="
                                      text-white
                                      font-semibold
                                      text-lg
                                    "
                                  >
                                    {item.caption}
                                  </p>
                                </div>

                              </div>

                            </div>

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  {/* RIGHT BUTTON */}

                  {sliderImages.length > 1 && (
                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Next slide"
                      className="
                        absolute
                        right-1
                        md:right-0
                        top-1/2
                        -translate-y-1/2
                        z-30
                        w-12
                        h-12
                        rounded-full
                        bg-white
                        shadow-xl
                        flex
                        items-center
                        justify-center
                        text-green-700
                        hover:bg-green-700
                        hover:text-white
                        transition-all
                        duration-300
                      "
                    >
                      <FaChevronRight />
                    </button>
                  )}

                </div>

                {/* =================================
                    DOTS
                ================================= */}

                {sliderImages.length > 1 && (
                  <div
                    className="
                      flex
                      justify-center
                      gap-2
                      mt-8
                    "
                  >

                    {sliderImages.map(
                      (_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            goToSlide(index)
                          }
                          aria-label={`Slide ${
                            index + 1
                          }`}
                          className={`
                            h-2.5
                            rounded-full
                            transition-all
                            duration-300
                            ${
                              slideIndex ===
                              index
                                ? "w-8 bg-green-700"
                                : "w-2.5 bg-green-300"
                            }
                          `}
                        />
                      )
                    )}

                  </div>
                )}

                {/* =================================
                    VIEW ALL
                ================================= */}

                <div
                  className="
                    flex
                    justify-center
                    mt-12
                  "
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowAll(true);
                      setSlideIndex(0);

                      window.setTimeout(() => {
                        scrollToGallery();
                      }, 50);
                    }}
                    className="
                      bg-gradient-to-r
                      from-green-700
                      to-green-900
                      text-white
                      px-9
                      py-4
                      rounded-full
                      font-semibold
                      text-lg
                      shadow-lg
                      hover:scale-105
                      hover:shadow-2xl
                      transition-all
                      duration-300
                    "
                  >
                    📸 View All
                  </button>
                </div>

              </>
            )}

          {/* ====================================
              ALL IMAGES
          ==================================== */}

          {showAll &&
            images.length > 0 && (
              <>

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-7
                  "
                >

                  {images.map(
                    (item, index) => (
                      <div
                        key={item.id}
                        onClick={() =>
                          openImage(
                            item,
                            index
                          )
                        }
                        className="
                          group
                          relative
                          overflow-hidden
                          rounded-3xl
                          shadow-xl
                          bg-black
                          cursor-pointer
                          h-72
                          sm:h-80
                          lg:h-96
                        "
                      >

                        <img
                          src={item.image}
                          alt={item.caption}
                          loading="lazy"
                          decoding="async"
                          className="
                            w-full
                            h-full
                            object-cover
                            transition-transform
                            duration-700
                            ease-out
                            group-hover:scale-105
                          "
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />

                        <div
                          className="
                            absolute
                            inset-0
                            bg-black/0
                            group-hover:bg-black/50
                            transition-all
                            duration-500
                            flex
                            items-end
                          "
                        >

                          <div
                            className="
                              w-full
                              p-5
                              translate-y-5
                              opacity-0
                              group-hover:translate-y-0
                              group-hover:opacity-100
                              transition-all
                              duration-500
                            "
                          >
                            <p
                              className="
                                text-white
                                font-semibold
                                text-lg
                              "
                            >
                              {item.caption}
                            </p>
                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>

                {/* BACK BUTTON */}

                <div
                  className="
                    flex
                    justify-center
                    mt-12
                  "
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowAll(false);
                      setSlideIndex(0);

                      window.setTimeout(() => {
                        scrollToGallery();
                      }, 50);
                    }}
                    className="
                      border-2
                      border-green-700
                      text-green-700
                      bg-white
                      px-9
                      py-4
                      rounded-full
                      font-semibold
                      text-lg
                      shadow-lg
                      hover:bg-green-700
                      hover:text-white
                      hover:scale-105
                      transition-all
                      duration-300
                    "
                  >
                    🔙 वापस स्लाइडर पर
                  </button>
                </div>

              </>
            )}

          {/* ====================================
              TOTAL
          ==================================== */}

          {images.length > 0 && (
            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm">
                कुल {images.length} तस्वीरें उपलब्ध हैं
              </p>
            </div>
          )}

        </div>
      </section>

      {/* ========================================
          FULL SCREEN IMAGE
      ======================================== */}

      {selectedImage && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/95
            flex
            items-center
            justify-center
            p-4
          "
          onClick={closeImage}
        >

          {/* CLOSE */}

          <button
            type="button"
            onClick={closeImage}
            aria-label="Close"
            className="
              absolute
              top-5
              right-5
              z-30
              w-12
              h-12
              rounded-full
              bg-white/10
              hover:bg-white/25
              text-white
              flex
              items-center
              justify-center
              text-xl
              transition
            "
          >
            <FaTimes />
          </button>

          {/* PREVIOUS */}

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              aria-label="Previous image"
              className="
                absolute
                left-3
                md:left-8
                z-30
                w-12
                h-12
                rounded-full
                bg-white/10
                hover:bg-white/25
                text-white
                flex
                items-center
                justify-center
                text-xl
                transition
              "
            >
              <FaChevronLeft />
            </button>
          )}

          {/* IMAGE */}

          <div
            className="
              relative
              max-w-7xl
              max-h-[95vh]
              flex
              flex-col
              items-center
              justify-center
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={selectedImage.image}
              alt={selectedImage.caption}
              className="
                max-w-[92vw]
                max-h-[82vh]
                md:max-h-[88vh]
                w-auto
                h-auto
                object-contain
                rounded-xl
                shadow-2xl
              "
            />

            <div className="text-center mt-4">

              <p
                className="
                  text-white
                  text-base
                  md:text-lg
                  font-medium
                "
              >
                {selectedImage.caption}
              </p>

              <p
                className="
                  text-white/60
                  text-sm
                  mt-1
                "
              >
                {selectedIndex + 1} /{" "}
                {images.length}
              </p>

            </div>

          </div>

          {/* NEXT */}

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
              className="
                absolute
                right-3
                md:right-8
                z-30
                w-12
                h-12
                rounded-full
                bg-white/10
                hover:bg-white/25
                text-white
                flex
                items-center
                justify-center
                text-xl
                transition
              "
            >
              <FaChevronRight />
            </button>
          )}

        </div>
      )}
    </>
  );
}

export default Gallery;