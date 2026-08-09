import { useEffect, useState } from "react";

import {
  getMembershipApplications,
  approveMembership,
  rejectMembership,
} from "../../firebase/volunteer.js";

function Membership({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    getMembershipApplications()
      .then((data) => {
        if (!mounted) return;

        const pending = (data || []).filter(
          (application) =>
            application.membershipStatus === "pending"
        );

        setApplications(pending);
      })
      .catch((error) => {
        console.error("Membership load error:", error);

        if (mounted) {
          setMessage("सदस्यता अनुरोध लोड नहीं हो सके।");
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

  async function handleApprove(application) {
    if (!application?.id) return;

    const confirmed = window.confirm(
      `क्या आप "${application.fullName}" का सदस्यता आवेदन स्वीकार करना चाहते हैं?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(application.id);
      setMessage("");

      await approveMembership(
        application.id,
        user?.email || "adityaverma1325@gmail.com"
      );

      setApplications((previous) =>
        previous.filter(
          (item) => item.id !== application.id
        )
      );

      setMessage(
        `${application.fullName} का सदस्यता आवेदन स्वीकार कर लिया गया। ✅`
      );
    } catch (error) {
      console.error("Approve membership error:", error);

      setMessage(
        error?.message ||
          "सदस्यता आवेदन स्वीकार नहीं किया जा सका।"
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(application) {
    if (!application?.id) return;

    const confirmed = window.confirm(
      `क्या आप "${application.fullName}" का सदस्यता आवेदन Reject करना चाहते हैं?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(application.id);
      setMessage("");

      await rejectMembership(
        application.id,
        "",
        user?.email || "adityaverma1325@gmail.com"
      );

      setApplications((previous) =>
        previous.filter(
          (item) => item.id !== application.id
        )
      );

      setMessage(
        `${application.fullName} का आवेदन Reject कर दिया गया।`
      );
    } catch (error) {
      console.error("Reject membership error:", error);

      setMessage(
        error?.message ||
          "सदस्यता आवेदन Reject नहीं किया जा सका।"
      );
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h2>📋 सदस्यता अनुरोध</h2>

          <p>
            यहाँ केवल Pending सदस्यता आवेदन दिखाई देंगे।
          </p>
        </div>

        <span className="admin-count">
          {applications.length}
        </span>
      </div>

      {message && (
        <div className="admin-message">
          {message}
        </div>
      )}

      {loading ? (
        <div className="admin-empty">
          <p>सदस्यता अनुरोध लोड हो रहे हैं...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📭</div>

          <h3>कोई Pending अनुरोध नहीं है</h3>

          <p>
            नए सदस्यता आवेदन यहाँ दिखाई देंगे।
          </p>
        </div>
      ) : (
        <div className="membership-list">
          {applications.map((application) => {
            const processing =
              actionLoading === application.id;

            return (
              <article
                key={application.id}
                className="membership-card"
              >
                <div className="membership-card-header">
                  <div>
                    <h3>
                      {application.fullName || "नाम उपलब्ध नहीं"}
                    </h3>

                    <small>
                      सदस्यता आवेदन
                    </small>
                  </div>

                  <span className="pending-badge">
                    Pending
                  </span>
                </div>

                <div className="membership-grid">
                  <div>
                    <strong>📱 WhatsApp</strong>
                    <span>
                      {application.whatsappNumber || "-"}
                    </span>
                  </div>

                  <div>
                    <strong>📧 Email</strong>
                    <span>
                      {application.email || "-"}
                    </span>
                  </div>

                  <div>
                    <strong>🎂 उम्र</strong>
                    <span>
                      {application.age || "-"}
                    </span>
                  </div>

                  <div>
                    <strong>⚧ लिंग</strong>
                    <span>
                      {application.gender || "-"}
                    </span>
                  </div>

                  <div>
                    <strong>📍 जिला</strong>
                    <span>
                      {application.district || "-"}
                    </span>
                  </div>

                  <div>
                    <strong>🏠 गांव / शहर</strong>
                    <span>
                      {application.village || "-"}
                    </span>
                  </div>

                  <div>
                    <strong>💼 व्यवसाय</strong>
                    <span>
                      {application.occupation || "-"}
                    </span>
                  </div>
                </div>

                <div className="membership-full-width">
                  <strong>पूरा पता</strong>
                  <p>
                    {application.address || "-"}
                  </p>
                </div>

                <div className="membership-full-width">
                  <strong>
                    संस्था से जुड़ने का उद्देश्य
                  </strong>

                  <p>
                    {application.reason || "-"}
                  </p>
                </div>

                <div className="membership-actions">
                  <button
                    type="button"
                    className="approve-button"
                    onClick={() =>
                      handleApprove(application)
                    }
                    disabled={processing}
                  >
                    {processing
                      ? "प्रक्रिया चल रही है..."
                      : "✅ Accept"}
                  </button>

                  <button
                    type="button"
                    className="reject-button"
                    onClick={() =>
                      handleReject(application)
                    }
                    disabled={processing}
                  >
                    ❌ Reject
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Membership;