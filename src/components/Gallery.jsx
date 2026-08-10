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
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/firebase.js";

function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [showAll, setShowAll] =
    useState(false);

  const [slideIndex, setSlideIndex] =
    useState(0);

  const sliderImages = useMemo(
    () => images.slice(0, 8),
    [images]
  );

  useEffect(() => {
    let mounted = true;

    const loadGallery = async () => {
      try {
        const galleryRef =
          collection(db, "gallery");

        const galleryQuery = query(
          galleryRef,
          orderBy("createdAt", "desc")
        );

        const snapshot =
          await getDocs(galleryQuery);

        const galleryImages =
          snapshot.docs
            .map((item) => {
              const data = item.data();

              return {
                id: item.id,
                image:
                  data.imageUrl ||
                  data.secureUrl ||
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
            .filter(
              (item) => item.image
            );

        if (mounted) {
          setImages(galleryImages);
        }
      } catch (error) {
        console.error(
          "Gallery load error:",
          error
        );

        if (mounted) {
          setImages([]);
        }
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

  const getVisibleCount = () => {
    if (
      typeof window === "undefined"
    ) {
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

  const visibleCount =
    getVisibleCount();

  const realMaxIndex = Math.max(
    0,
    sliderImages.length -
      visibleCount
  );

  const loopImages = useMemo(() => {
    if (!sliderImages.length) {
      return [];
    }

    const cloneCount = Math.min(
      visibleCount,
      sliderImages.length
    );

    return [
      ...sliderImages,
      ...sliderImages.slice(
        0,
        cloneCount
      ),
    ];
  }, [
    sliderImages,
    visibleCount,
  ]);

  useEffect(() => {
    if (
      showAll ||
      sliderImages.length <= 1
    ) {
      return;
    }

    const timer = setInterval(() => {
      setSlideIndex(
        (current) => current + 1
      );
    }, 4000);

    return () =>
      clearInterval(timer);
  }, [
    showAll,
    sliderImages.length,
  ]);

  useEffect(() => {
    if (
      slideIndex <
      sliderImages.length
    ) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        setSlideIndex(0);
      }, 750);

    return () =>
      window.clearTimeout(timer);
  }, [
    slideIndex,
    sliderImages.length,
  ]);

  const nextSlide = () => {
    if (sliderImages.length <= 1) {
      return;
    }

    setSlideIndex(
      (current) => current + 1
    );
  };

  const previousSlide = () => {
    if (sliderImages.length <= 1) {
      return;
    }

    setSlideIndex(
      (current) => {
        if (current <= 0) {
          return realMaxIndex;
        }

        return current - 1;
      }
    );
  };

  const openImage = (
    image,
    index
  ) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const previousImage = () => {
    if (!images.length) {
      return;
    }

    setSelectedIndex(
      (current) => {
        const next =
          current === 0
            ? images.length - 1
            : current - 1;

        setSelectedImage(
          images[next]
        );

        return next;
      }
    );
  };

  const nextImage = () => {
    if (!images.length) {
      return;
    }

    setSelectedIndex(
      (current) => {
        const next =
          current ===
          images.length - 1
            ? 0
            : current + 1;

        setSelectedImage(
          images[next]
        );

        return next;
      }
    );
  };

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (!selectedImage) {
          return;
        }

        if (event.key === "Escape") {
          closeImage();
        }

        if (event.key === "ArrowLeft") {
          previousImage();
        }

        if (event.key === "ArrowRight") {
          nextImage();
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    selectedImage,
    images,
  ]);

  const scrollToGallery = () => {
    document
      .getElementById("gallery")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  if (loading) {
    return (
      <section
        id="gallery"
        className="py-24 bg-gradient-to-b from-white via-green-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-5 text-center">
          <FaImages className="text-6xl text-green-700 mx-auto" />

          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mt-6">
            📸 हमारी गैलरी
          </h2>

          <p className="text-gray-600 mt-5">
            गैलरी लोड हो रही है...
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        id="gallery"
        className="py-24 bg-gradient-to-b from-white via-green-50 to-white overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-5">

          <div className="text-center mb-14">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center shadow-xl">
              <FaImages className="text-4xl text-green-700" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mt-6">
              📸 हमारी गैलरी
            </h2>

            <p className="text-gray-600 mt-5 max-w-3xl mx-auto leading-8 text-lg">
              शिक्षा, स्वास्थ्य, पर्यावरण संरक्षण,
              समाज सेवा, रक्तदान, युवा कार्यक्रम
              एवं अन्य सामाजिक गतिविधियों की
              यादगार झलकियाँ।
            </p>
          </div>

          {images.length === 0 && (
            <div className="text-center py-12">
              <FaImages className="text-5xl text-gray-400 mx-auto" />

              <p className="text-gray-500 text-lg mt-5">
                अभी गैलरी में कोई तस्वीर उपलब्ध नहीं है।
              </p>
            </div>
          )}

          {sliderImages.length > 0 &&
            !showAll && (
              <>
                <div className="relative">

                  {sliderImages.length > 1 && (
                    <button
                      type="button"
                      onClick={previousSlide}
                      className="absolute left-1 md:left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-green-700 hover:bg-green-700 hover:text-white transition"
                    >
                      <FaChevronLeft />
                    </button>
                  )}

                  <div className="overflow-hidden mx-4 md:mx-10">
                    <div
                      className="flex will-change-transform"
                      style={{
                        transform:
                          `translate3d(-${
                            slideIndex *
                            (100 /
                              visibleCount)
                          }%, 0, 0)`,
                        transition:
                          "transform 750ms cubic-bezier(0.22,1,0.36,1)",
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
                            className="shrink-0 w-full sm:w-1/2 lg:w-1/3 px-3"
                          >
                            <div
                              onClick={() =>
                                openImage(
                                  item,
                                  index %
                                    sliderImages.length
                                )
                              }
                              className="group relative overflow-hidden rounded-3xl shadow-xl bg-black cursor-pointer h-72 sm:h-80 lg:h-96"
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
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(
                                  event
                                ) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />

                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-end">
                                <div className="w-full p-5 translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition">
                                  <p className="text-white font-semibold text-lg">
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

                  {sliderImages.length > 1 && (
                    <button
                      type="button"
                      onClick={nextSlide}
                      className="absolute right-1 md:right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-green-700 hover:bg-green-700 hover:text-white transition"
                    >
                      <FaChevronRight />
                    </button>
                  )}
                </div>

                {sliderImages.length > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {sliderImages.map(
                      (_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() =>
                            setSlideIndex(index)
                          }
                          className={`h-2.5 rounded-full transition ${
                            slideIndex ===
                            index
                              ? "w-8 bg-green-700"
                              : "w-2.5 bg-green-300"
                          }`}
                        />
                      )
                    )}
                  </div>
                )}

                <div className="flex justify-center mt-12">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAll(true);
                      setSlideIndex(0);

                      window.setTimeout(
                        scrollToGallery,
                        50
                      );
                    }}
                    className="bg-gradient-to-r from-green-700 to-green-900 text-white px-9 py-4 rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition"
                  >
                    📸 View All
                  </button>
                </div>
              </>
            )}

          {showAll &&
            images.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
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
                        className="group relative overflow-hidden rounded-3xl shadow-xl bg-black cursor-pointer h-72 sm:h-80 lg:h-96"
                      >
                        <img
                          src={item.image}
                          alt={item.caption}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";
                          }}
                        />

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-end">
                          <div className="w-full p-5 translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition">
                            <p className="text-white font-semibold text-lg">
                              {item.caption}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="flex justify-center mt-12">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAll(false);
                      setSlideIndex(0);

                      window.setTimeout(
                        scrollToGallery,
                        50
                      );
                    }}
                    className="border-2 border-green-700 text-green-700 bg-white px-9 py-4 rounded-full font-semibold text-lg hover:bg-green-700 hover:text-white transition"
                  >
                    🔙 वापस स्लाइडर पर
                  </button>
                </div>
              </>
            )}

          {images.length > 0 && (
            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm">
                कुल {images.length} तस्वीरें उपलब्ध हैं
              </p>
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={closeImage}
        >
          <button
            type="button"
            onClick={closeImage}
            className="absolute top-5 right-5 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center"
          >
            <FaTimes />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              className="absolute left-3 md:left-8 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center"
            >
              <FaChevronLeft />
            </button>
          )}

          <div
            className="relative max-w-7xl max-h-[95vh] flex flex-col items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.caption}
              className="max-w-[92vw] max-h-[82vh] md:max-h-[88vh] object-contain rounded-xl shadow-2xl"
            />

            <p className="text-white text-lg font-medium mt-4">
              {selectedImage.caption}
            </p>

            <p className="text-white/60 text-sm mt-1">
              {selectedIndex + 1} / {images.length}
            </p>
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 md:right-8 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center"
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