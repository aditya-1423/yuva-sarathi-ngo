import { useEffect, useState } from "react";

import {
  createEvent,
  getEvents,
  deleteEvent,
} from "../../firebase/events.js";

const MAX_EVENT_IMAGES = 5;
const MAX_FILE_SIZE = 15 * 1024 * 1024;

function Events() {
  const [events, setEvents] = useState([]);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteLoading, setDeleteLoading] =
    useState(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    getEvents()
      .then((data) => {
        if (!mounted) return;

        setEvents(data || []);
      })
      .catch((error) => {
        console.error("Events load error:", error);

        if (mounted) {
          setMessage(
            "कार्यक्रम लोड नहीं हो सके।"
          );
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  function handleImageSelect(event) {
    const files = Array.from(
      event.target.files || []
    );

    setMessage("");

    if (files.length === 0) {
      setImages([]);
      return;
    }

    if (files.length > MAX_EVENT_IMAGES) {
      setImages([]);

      setMessage(
        "एक कार्यक्रम में अधिकतम 5 तस्वीरें ही चुन सकते हैं।"
      );

      event.target.value = "";
      return;
    }

    for (const file of files) {
      if (
        !file.type ||
        !file.type.startsWith("image/")
      ) {
        setImages([]);

        setMessage(
          `${file.name} image नहीं है।`
        );

        event.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setImages([]);

        setMessage(
          `${file.name} 15 MB से बड़ी है।`
        );

        event.target.value = "";
        return;
      }
    }

    setImages(files);

    setMessage(
      `${files.length} तस्वीरें चुनी गई हैं।`
    );
  }

  async function handleCreateEvent(event) {
    event.preventDefault();

    setMessage("");

    if (!title.trim()) {
      setMessage(
        "कृपया कार्यक्रम का नाम डालें।"
      );
      return;
    }

    if (!date) {
      setMessage(
        "कृपया कार्यक्रम की तारीख चुनें।"
      );
      return;
    }

    if (!location.trim()) {
      setMessage(
        "कृपया कार्यक्रम का स्थान डालें।"
      );
      return;
    }

    if (!description.trim()) {
      setMessage(
        "कृपया कार्यक्रम का विवरण डालें।"
      );
      return;
    }

    if (images.length === 0) {
      setMessage(
        "कृपया कम से कम 1 कार्यक्रम की तस्वीर चुनें।"
      );
      return;
    }

    try {
      setUploading(true);

      await createEvent({
        title: title.trim(),
        date,
        location: location.trim(),
        description: description.trim(),
        imageFiles: images,
      });

      setTitle("");
      setDate("");
      setLocation("");
      setDescription("");
      setImages([]);

      event.target.reset();

      const updatedEvents = await getEvents();

      setEvents(updatedEvents || []);

      setMessage(
        "कार्यक्रम और उसकी सभी तस्वीरें सफलतापूर्वक जोड़ दी गईं! 🎉"
      );
    } catch (error) {
      console.error(
        "Create event error:",
        error
      );

      setMessage(
        error?.message ||
          "कार्यक्रम नहीं जोड़ा जा सका।"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteEvent(eventId) {
    if (!eventId) return;

    const confirmed = window.confirm(
      "क्या आप यह पूरा कार्यक्रम हटाना चाहते हैं?"
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(eventId);
      setMessage("");

      await deleteEvent(eventId);

      setEvents((previous) =>
        previous.filter(
          (item) => item.id !== eventId
        )
      );

      setMessage(
        "कार्यक्रम सफलतापूर्वक हटा दिया गया।"
      );
    } catch (error) {
      console.error(
        "Delete event error:",
        error
      );

      setMessage(
        error?.message ||
          "कार्यक्रम हटाया नहीं जा सका।"
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h2>🎉 कार्यक्रम / Karyakram</h2>

          <p>
            संस्था के कार्यक्रम यहाँ जोड़ें और मैनेज करें।
          </p>
        </div>
      </div>

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      <form
        className="admin-form"
        onSubmit={handleCreateEvent}
      >
        <div className="form-group">
          <label>कार्यक्रम का नाम</label>

          <input
            type="text"
            placeholder="जैसे - वृक्षारोपण अभियान"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            required
          />
        </div>

        <div className="form-group">
          <label>कार्यक्रम की तारीख</label>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
            required
          />
        </div>

        <div className="form-group">
          <label>कार्यक्रम का स्थान</label>

          <input
            type="text"
            placeholder="कार्यक्रम का स्थान"
            value={location}
            onChange={(event) =>
              setLocation(event.target.value)
            }
            required
          />
        </div>

        <div className="form-group">
          <label>कार्यक्रम का विवरण</label>

          <textarea
            rows="5"
            placeholder="कार्यक्रम के बारे में जानकारी..."
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            required
          />
        </div>

        <div className="form-group">
          <label>
            कार्यक्रम की तस्वीरें
          </label>

          <p className="form-help">
            अधिकतम 5 तस्वीरें • प्रत्येक image
            अधिकतम 15 MB
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            required
          />
        </div>

        {images.length > 0 && (
          <div className="selected-images">
            <h4>
              चुनी गई तस्वीरें ({images.length})
            </h4>

            <div className="image-preview-grid">
              {images.map((file, index) => {
                const preview =
                  URL.createObjectURL(file);

                return (
                  <div
                    className="image-preview"
                    key={`${file.name}-${index}`}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                    />

                    <span>
                      {index === 0
                        ? "Cover"
                        : `Image ${index + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={uploading}
        >
          {uploading
            ? "कार्यक्रम अपलोड हो रहा है..."
            : "➕ कार्यक्रम जोड़ें"}
        </button>
      </form>

      <div className="admin-list-section">
        <h2>जोड़े गए कार्यक्रम</h2>

        {loading ? (
          <div className="admin-empty">
            <p>कार्यक्रम लोड हो रहे हैं...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">
              🎉
            </div>

            <h3>
              अभी कोई कार्यक्रम नहीं है।
            </h3>
          </div>
        ) : (
          <div className="events-admin-grid">
            {events.map((eventItem) => (
              <article
                key={eventItem.id}
                className="event-admin-card"
              >
                {eventItem.image && (
                  <img
                    src={eventItem.image}
                    alt={
                      eventItem.title ||
                      "कार्यक्रम"
                    }
                    className="event-admin-image"
                  />
                )}

                <div className="event-admin-content">
                  <h3>
                    {eventItem.title}
                  </h3>

                  <p>
                    <strong>📅 तारीख:</strong>{" "}
                    {eventItem.date || "-"}
                  </p>

                  <p>
                    <strong>📍 स्थान:</strong>{" "}
                    {eventItem.location || "-"}
                  </p>

                  <p>
                    <strong>📝 विवरण:</strong>{" "}
                    {eventItem.description || "-"}
                  </p>

                  {eventItem.galleryImages?.length >
                    0 && (
                    <p>
                      📷{" "}
                      {
                        eventItem.galleryImages
                          .length
                      }{" "}
                      तस्वीरें
                    </p>
                  )}

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDeleteEvent(
                        eventItem.id
                      )
                    }
                    disabled={
                      deleteLoading ===
                      eventItem.id
                    }
                  >
                    {deleteLoading ===
                    eventItem.id
                      ? "हटा रहे हैं..."
                      : "🗑️ कार्यक्रम हटाएँ"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Events;