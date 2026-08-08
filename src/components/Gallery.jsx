import { useEffect, useState } from "react";
import { FaImages } from "react-icons/fa";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase.js";

function Gallery() {
  const [images, setImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const galleryQuery = query(
          collection(db, "gallery"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(galleryQuery);

        const galleryImages = snapshot.docs.map((document) => ({
          id: document.id,
          image: document.data().imageUrl,
          caption:
            document.data().caption || "संस्था की गतिविधि",
        }));

        setImages(galleryImages);
      } catch (error) {
        console.error("Gallery load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  const loadMore = () => {
    setVisibleImages((previous) =>
      Math.min(previous + 6, images.length)
    );
  };

  const seeLess = () => {
    setVisibleImages(6);

    document.getElementById("gallery")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="gallery"
      className="py-24 bg-gradient-to-b from-white via-green-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-5">

        {/* Heading */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center shadow-xl">
            <FaImages className="text-4xl text-green-700" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mt-6">
            📸 हमारी गैलरी
          </h2>

          <p className="text-gray-600 mt-5 max-w-3xl mx-auto leading-8 text-lg">
            शिक्षा, स्वास्थ्य, पर्यावरण संरक्षण, समाज सेवा,
            रक्तदान, युवा कार्यक्रम एवं अन्य सामाजिक गतिविधियों
            की कुछ यादगार झलकियाँ।
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-green-700 text-lg">
              गैलरी लोड हो रही है...
            </p>
          </div>
        )}

        {/* Empty Gallery */}
        {!loading && images.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">
              अभी गैलरी में कोई तस्वीर उपलब्ध नहीं है।
            </p>
          </div>
        )}

        {/* Gallery */}
        {!loading && images.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.slice(0, visibleImages).map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-3xl shadow-xl bg-white cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.caption}
                    loading="lazy"
                    className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition duration-500 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xl font-semibold transition duration-500 text-center px-4">
                      {item.caption}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-center items-center gap-5 mt-14 flex-wrap">

              {visibleImages < images.length && (
                <button
                  onClick={loadMore}
                  className="bg-gradient-to-r from-green-700 to-green-900 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  📸 और देखें
                </button>
              )}

              {visibleImages > 6 && (
                <button
                  onClick={seeLess}
                  className="border-2 border-green-700 text-green-700 bg-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-green-700 hover:text-white hover:scale-105 transition-all duration-300"
                >
                  🔼 कम दिखाएँ
                </button>
              )}

            </div>

            {/* Total */}
            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm">
                कुल {images.length} तस्वीरें उपलब्ध हैं
              </p>
            </div>
          </>
        )}

      </div>
    </section>
  );
}

export default Gallery;