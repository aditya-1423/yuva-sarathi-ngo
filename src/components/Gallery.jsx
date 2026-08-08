import { useEffect, useState } from "react";
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
  const [visibleImages, setVisibleImages] = useState(6);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // ==========================================
  // LOAD GALLERY
  // ==========================================

  useEffect(() => {
    async function loadGallery() {
      try {
        const galleryQuery = query(
          collection(db, "gallery"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(galleryQuery);

        const galleryImages = snapshot.docs
          .map((document) => {
            const data = document.data();

            return {
              id: document.id,
              image: data.imageUrl,
              caption:
                data.caption || "संस्था की गतिविधि",
            };
          })
          .filter((item) => item.image);

        setImages(galleryImages);
      } catch (error) {
        console.error(
          "Gallery load error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  // ==========================================
  // OPEN IMAGE
  // ==========================================

  const openImage = (image, index) => {
    setSelectedImage(image);
    setSelectedIndex(index);
  };

  // ==========================================
  // CLOSE IMAGE
  // ==========================================

  const closeImage = () => {
    setSelectedImage(null);
  };

  // ==========================================
  // PREVIOUS
  // ==========================================

  const previousImage = () => {
    if (images.length === 0) return;

    const newIndex =
      selectedIndex === 0
        ? images.length - 1
        : selectedIndex - 1;

    setSelectedIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // ==========================================
  // NEXT
  // ==========================================

  const nextImage = () => {
    if (images.length === 0) return;

    const newIndex =
      selectedIndex === images.length - 1
        ? 0
        : selectedIndex + 1;

    setSelectedIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // ==========================================
  // KEYBOARD
  // ==========================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedImage) return;

      if (event.key === "Escape") {
        setSelectedImage(null);
        return;
      }

      if (event.key === "ArrowLeft") {
        if (images.length === 0) return;

        const newIndex =
          selectedIndex === 0
            ? images.length - 1
            : selectedIndex - 1;

        setSelectedIndex(newIndex);
        setSelectedImage(images[newIndex]);
      }

      if (event.key === "ArrowRight") {
        if (images.length === 0) return;

        const newIndex =
          selectedIndex === images.length - 1
            ? 0
            : selectedIndex + 1;

        setSelectedIndex(newIndex);
        setSelectedImage(images[newIndex]);
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
  }, [selectedImage, selectedIndex, images]);

  // ==========================================
  // LOAD MORE
  // ==========================================

  const loadMore = () => {
    setVisibleImages((previous) =>
      Math.min(
        previous + 6,
        images.length
      )
    );
  };

  // ==========================================
  // SEE LESS
  // ==========================================

  const seeLess = () => {
    setVisibleImages(6);

    document
      .getElementById("gallery")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  return (
    <>
      {/* ========================================
          GALLERY
      ======================================== */}

      <section
        id="gallery"
        className="py-24 bg-gradient-to-b from-white via-green-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-5">

          {/* HEADING */}

          <div className="text-center mb-16">

            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center shadow-xl">

              <FaImages className="text-4xl text-green-700" />

            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mt-6">
              📸 हमारी गैलरी
            </h2>

            <p className="text-gray-600 mt-5 max-w-3xl mx-auto leading-8 text-lg">
              शिक्षा, स्वास्थ्य, पर्यावरण संरक्षण,
              समाज सेवा, रक्तदान, युवा कार्यक्रम
              एवं अन्य सामाजिक गतिविधियों की कुछ
              यादगार झलकियाँ।
            </p>

          </div>

          {/* LOADING */}

          {loading && (
            <div className="text-center py-10">

              <p className="text-green-700 text-lg">
                गैलरी लोड हो रही है...
              </p>

            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            images.length === 0 && (
              <div className="text-center py-10">

                <p className="text-gray-500 text-lg">
                  अभी गैलरी में कोई तस्वीर
                  उपलब्ध नहीं है।
                </p>

              </div>
            )}

          {/* ====================================
              GALLERY GRID
          ==================================== */}

          {!loading &&
            images.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

                  {images
                    .slice(0, visibleImages)
                    .map((item, index) => (
                      <div
                        key={item.id}
                        onClick={() =>
                          openImage(
                            item,
                            index
                          )
                        }
                        className="group relative overflow-hidden rounded-3xl shadow-xl bg-black cursor-pointer"
                      >

                        {/* IMAGE */}

                        <img
                          src={item.image}
                          alt={item.caption}
                          loading="lazy"
                          className="w-full h-72 object-cover group-hover:scale-105 transition duration-500"
                        />

                        {/* HOVER */}

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-500 flex items-center justify-center">

                          <span className="opacity-0 group-hover:opacity-100 text-white text-xl font-semibold transition duration-500 text-center px-4">

                            {item.caption}

                          </span>

                        </div>

                      </div>
                    ))}

                </div>

                {/* BUTTONS */}

                <div className="flex justify-center items-center gap-5 mt-14 flex-wrap">

                  {visibleImages <
                    images.length && (
                    <button
                      type="button"
                      onClick={loadMore}
                      className="bg-gradient-to-r from-green-700 to-green-900 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    >
                      📸 और देखें
                    </button>
                  )}

                  {visibleImages > 6 && (
                    <button
                      type="button"
                      onClick={seeLess}
                      className="border-2 border-green-700 text-green-700 bg-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-green-700 hover:text-white hover:scale-105 transition-all duration-300"
                    >
                      🔼 कम दिखाएँ
                    </button>
                  )}

                </div>

                {/* TOTAL */}

                <div className="text-center mt-10">

                  <p className="text-gray-500 text-sm">
                    कुल {images.length} तस्वीरें
                    उपलब्ध हैं
                  </p>

                </div>
              </>
            )}

        </div>
      </section>

      {/* ========================================
          FULL IMAGE MODAL
      ======================================== */}

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={closeImage}
        >

          {/* CLOSE */}

          <button
            type="button"
            onClick={closeImage}
            className="absolute top-5 right-5 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition"
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
              className="absolute left-3 md:left-8 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition"
            >
              <FaChevronLeft />
            </button>
          )}

          {/* FULL IMAGE */}

          <div
            className="relative max-w-7xl max-h-[92vh] flex flex-col items-center justify-center"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              src={selectedImage.image}
              alt={selectedImage.caption}
              className="max-w-[95vw] max-h-[82vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
            />

            {/* CAPTION */}

            {selectedImage.caption && (
              <div className="mt-4 text-center">

                <p className="text-white text-base md:text-lg font-medium">
                  {selectedImage.caption}
                </p>

                <p className="text-white/60 text-sm mt-1">
                  {selectedIndex + 1} /{" "}
                  {images.length}
                </p>

              </div>
            )}

          </div>

          {/* NEXT */}

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 md:right-8 z-30 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition"
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