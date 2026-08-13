import { useEffect, useMemo, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase/firebase.js";

import {
  approveMembership,
  rejectMembership,
} from "../../firebase/volunteer.js";

import "./membership.css";


// =====================================================
// HELPERS
// =====================================================

function getTimeValue(value) {

  if (!value) {
    return 0;
  }

  try {

    if (
      typeof value === "object" &&
      typeof value.toDate === "function"
    ) {

      return value.toDate().getTime();

    }

    const date =
      new Date(value);

    return Number.isNaN(
      date.getTime()
    )
      ? 0
      : date.getTime();

  } catch {

    return 0;

  }

}


function formatDate(value) {

  if (!value) {
    return "उपलब्ध नहीं";
  }

  try {

    if (
      typeof value === "object" &&
      typeof value.toDate === "function"
    ) {

      return value
        .toDate()
        .toLocaleString("hi-IN");

    }

    const date =
      new Date(value);

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {

      return date.toLocaleString(
        "hi-IN"
      );

    }

    return String(value);

  } catch {

    return String(value);

  }

}


function formatFieldName(key) {

  const labels = {

    fullName: "पूरा नाम",

    whatsappNumber:
      "WhatsApp Number",

    email:
      "Email",

    age:
      "उम्र",

    gender:
      "लिंग",

    district:
      "जिला",

    village:
      "गांव",

    city:
      "शहर",

    villageCity:
      "गांव / शहर",

    occupation:
      "व्यवसाय",

    address:
      "पता",

    fullAddress:
      "पूरा पता",

    reason:
      "संस्था से जुड़ने का उद्देश्य",

    joinReason:
      "संस्था से जुड़ने का उद्देश्य",

    purpose:
      "उद्देश्य",

    objective:
      "उद्देश्य",

    membershipStatus:
      "सदस्यता स्थिति",

    createdAt:
      "आवेदन दिनांक",

    updatedAt:
      "अपडेट दिनांक",

    approvedAt:
      "स्वीकृति दिनांक",

    approvedBy:
      "स्वीकृत द्वारा",

    rejectionReason:
      "अस्वीकृति कारण",

  };


  if (labels[key]) {

    return labels[key];

  }


  return key
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /^./,
      (char) =>
        char.toUpperCase()
    );

}


// =====================================================
// DETAIL ITEM
// =====================================================

function DetailItem({
  label,
  value,
}) {

  let finalValue =
    value;


  if (
    value &&
    typeof value === "object" &&
    typeof value.toDate ===
      "function"
  ) {

    finalValue =
      formatDate(value);

  } else if (
    value &&
    typeof value === "object"
  ) {

    try {

      finalValue =
        JSON.stringify(
          value
        );

    } catch {

      finalValue =
        String(value);

    }

  }


  return (
    <div className="membership-detail-item">

      <span className="membership-detail-label">
        {label}
      </span>


      <strong className="membership-detail-value">

        {finalValue !==
          undefined &&
        finalValue !==
          null &&
        String(
          finalValue
        ).trim() !== ""
          ? String(
              finalValue
            )
          : "उपलब्ध नहीं"}

      </strong>

    </div>
  );

}


// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({
  status,
}) {

  const value =
    String(
      status || ""
    ).toLowerCase();


  if (
    value ===
    "approved"
  ) {

    return (
      <span className="membership-status approved">
        ✓ Approved
      </span>
    );

  }


  if (
    value ===
    "rejected"
  ) {

    return (
      <span className="membership-status rejected">
        ✕ Rejected
      </span>
    );

  }


  return (
    <span className="membership-status pending">
      Pending
    </span>
  );

}


// =====================================================
// SECTION CARD
// =====================================================

function SectionCard({
  type,
  title,
  description,
  count,
  icon,
  active,
  onClick,
}) {

  return (
    <button
      type="button"
      className={`membership-section-card ${type} ${
        active
          ? "active"
          : ""
      }`}
      onClick={onClick}
    >

      <div className="membership-section-icon">
        {icon}
      </div>


      <div className="membership-section-content">

        <span>
          MEMBERSHIP
        </span>


        <h2>
          {title}
        </h2>


        <p>
          {description}
        </p>

      </div>


      <div className="membership-section-count">
        {count}
      </div>


      <div className="membership-section-arrow">
        →
      </div>

    </button>
  );

}


// =====================================================
// PENDING REQUEST ROW
// =====================================================

function PendingRequestRow({
  member,
  onView,
  onApprove,
  onReject,
  actionLoading,
}) {

  const name =
    member.fullName ||
    "नाम उपलब्ध नहीं";


  return (
    <div className="membership-pending-row">

      <div className="membership-member-info">

        <div className="membership-member-avatar">

          {name
            .trim()
            .charAt(0)
            .toUpperCase()}

        </div>


        <div className="membership-member-main">

          <strong>
            {name}
          </strong>


          <span>

            {member.whatsappNumber ||
              "WhatsApp उपलब्ध नहीं"}

          </span>

        </div>

      </div>


      <div className="membership-member-location">

        {member.district ||
          "-"}

      </div>


      <div className="membership-member-date">

        {formatDate(
          member.createdAt
        )}

      </div>


      <div className="membership-pending-actions">

        <button
          type="button"
          className="membership-view-button"
          onClick={() =>
            onView(member)
          }
          disabled={
            actionLoading
          }
        >
          View Full Detail
        </button>


        <button
          type="button"
          className="membership-approve-button"
          onClick={() =>
            onApprove(member)
          }
          disabled={
            actionLoading
          }
        >
          {actionLoading
            ? "..."
            : "✓ Accept"}
        </button>


        <button
          type="button"
          className="membership-reject-button"
          onClick={() =>
            onReject(member)
          }
          disabled={
            actionLoading
          }
        >
          {actionLoading
            ? "..."
            : "✕ Reject"}
        </button>

      </div>

    </div>
  );

}


// =====================================================
// MEMBER ROW
// =====================================================

function MemberRow({
  member,
  onView,
}) {

  const name =
    member.fullName ||
    "नाम उपलब्ध नहीं";


  return (
    <div className="membership-member-row">

      <div className="membership-member-info">

        <div className="membership-member-avatar">

          {name
            .trim()
            .charAt(0)
            .toUpperCase()}

        </div>


        <div className="membership-member-main">

          <strong>
            {name}
          </strong>


          <span>

            {member.whatsappNumber ||
              member.email ||
              "Contact उपलब्ध नहीं"}

          </span>

        </div>

      </div>


      <div className="membership-member-location">

        {member.district ||
          "-"}

      </div>


      <div className="membership-member-date">

        {formatDate(
          member.createdAt
        )}

      </div>


      <div className="membership-member-action">

        <button
          type="button"
          className="membership-view-button"
          onClick={() =>
            onView(member)
          }
        >

          View Full Detail

          <span>
            →
          </span>

        </button>

      </div>

    </div>
  );

}


// =====================================================
// MEMBER DETAIL MODAL
// =====================================================

function MemberDetailModal({
  member,
  onClose,
  onApprove,
  onReject,
  showActions = false,
  actionLoading = false,
}) {

  if (!member) {
    return null;
  }


  const ignoredFields = [

    "id",
    "fullName",
    "whatsappNumber",
    "email",
    "age",
    "gender",
    "district",
    "village",
    "city",
    "villageCity",
    "occupation",
    "address",
    "fullAddress",
    "reason",
    "joinReason",
    "purpose",
    "objective",
    "membershipStatus",
    "createdAt",
    "updatedAt",
    "approvedAt",
    "approvedBy",
    "rejectionReason",

  ];


  const extraFields =
    Object.entries(
      member
    ).filter(
      ([key]) =>
        !ignoredFields.includes(
          key
        )
    );


  return (
    <div
      className="membership-modal-overlay"
      onClick={onClose}
    >

      <div
        className="membership-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <div className="membership-modal-header">

          <div>

            <span className="membership-modal-eyebrow">
              MEMBER DETAILS
            </span>


            <h2>
              {member.fullName ||
                "सदस्य विवरण"}
            </h2>


            <StatusBadge
              status={
                member.membershipStatus
              }
            />

          </div>


          <button
            type="button"
            className="membership-modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <div className="membership-modal-body">

          <div className="membership-detail-grid">

            <DetailItem
              label="पूरा नाम"
              value={
                member.fullName
              }
            />


            <DetailItem
              label="WhatsApp Number"
              value={
                member.whatsappNumber
              }
            />


            <DetailItem
              label="Email"
              value={
                member.email
              }
            />


            <DetailItem
              label="उम्र"
              value={
                member.age
              }
            />


            <DetailItem
              label="लिंग"
              value={
                member.gender
              }
            />


            <DetailItem
              label="जिला"
              value={
                member.district
              }
            />


            <DetailItem
              label="गांव / शहर"
              value={
                member.villageCity ||
                member.village ||
                member.city
              }
            />


            <DetailItem
              label="व्यवसाय"
              value={
                member.occupation
              }
            />


            <DetailItem
              label="पता"
              value={
                member.address ||
                member.fullAddress
              }
            />


            <DetailItem
              label="संस्था से जुड़ने का उद्देश्य"
              value={
                member.reason ||
                member.joinReason ||
                member.purpose ||
                member.objective
              }
            />


            <DetailItem
              label="सदस्यता स्थिति"
              value={
                member.membershipStatus
              }
            />


            <DetailItem
              label="आवेदन दिनांक"
              value={
                formatDate(
                  member.createdAt
                )
              }
            />


            <DetailItem
              label="अपडेट दिनांक"
              value={
                formatDate(
                  member.updatedAt
                )
              }
            />


            {member.rejectionReason && (

              <DetailItem
                label="अस्वीकृति कारण"
                value={
                  member.rejectionReason
                }
              />

            )}

          </div>


          {extraFields.length > 0 && (

            <div className="membership-extra-section">

              <div className="membership-extra-title">
                अन्य जानकारी
              </div>


              <div className="membership-extra-grid">

                {extraFields.map(
                  ([key, value]) => (

                    <DetailItem
                      key={key}
                      label={
                        formatFieldName(
                          key
                        )
                      }
                      value={value}
                    />

                  )
                )}

              </div>

            </div>

          )}

        </div>


        <div className="membership-modal-footer">

          {showActions &&
            String(
              member.membershipStatus ||
              ""
            ).toLowerCase() ===
              "pending" && (

              <>

                <button
                  type="button"
                  className="membership-approve-button"
                  onClick={() =>
                    onApprove(
                      member
                    )
                  }
                  disabled={
                    actionLoading
                  }
                >

                  {actionLoading
                    ? "Processing..."
                    : "✓ Accept Application"}

                </button>


                <button
                  type="button"
                  className="membership-reject-button"
                  onClick={() =>
                    onReject(
                      member
                    )
                  }
                  disabled={
                    actionLoading
                  }
                >

                  {actionLoading
                    ? "Processing..."
                    : "✕ Reject Application"}

                </button>

              </>

            )}


          <button
            type="button"
            className="membership-close-button"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );

}


// =====================================================
// MAIN MEMBERSHIP
// =====================================================

function Membership() {

  const [members, setMembers] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [search, setSearch] =
    useState("");


  const [activeSection, setActiveSection] =
    useState("pending");


  const [selectedMember, setSelectedMember] =
    useState(null);


  const [actionLoadingId, setActionLoadingId] =
    useState(null);


  // ===================================================
  // LOAD MEMBERS
  // ===================================================

  async function loadMembers() {

    try {

      setError("");


      const snapshot =
        await getDocs(
          collection(
            db,
            "memberships"
          )
        );


      const data =
        snapshot.docs.map(
          (item) => ({

            id: item.id,

            ...item.data(),

          })
        );


      data.sort(
        (a, b) =>
          getTimeValue(
            b.createdAt
          ) -
          getTimeValue(
            a.createdAt
          )
      );


      setMembers(data);

    } catch (err) {

      console.error(
        "Membership load error:",
        err
      );


      setError(
        err?.message ||
        "Membership data load नहीं हो सका।"
      );

    } finally {

      setLoading(false);

    }

  }


  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {

    let cancelled =
      false;


    async function initialLoad() {

      try {

        const snapshot =
          await getDocs(
            collection(
              db,
              "memberships"
            )
          );


        if (cancelled) {
          return;
        }


        const data =
          snapshot.docs.map(
            (item) => ({

              id: item.id,

              ...item.data(),

            })
          );


        data.sort(
          (a, b) =>
            getTimeValue(
              b.createdAt
            ) -
            getTimeValue(
              a.createdAt
            )
        );


        setMembers(data);

        setError("");

      } catch (err) {

        if (!cancelled) {

          console.error(
            "Membership load error:",
            err
          );


          setError(
            err?.message ||
            "Membership data load नहीं हो सका।"
          );

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    }


    void initialLoad();


    return () => {

      cancelled = true;

    };

  }, []);


  // ===================================================
  // PENDING
  // ===================================================

  const pendingMembers =
    useMemo(
      () =>
        members.filter(
          (member) =>
            String(
              member.membershipStatus ||
              ""
            )
              .trim()
              .toLowerCase() ===
            "pending"
        ),
      [members]
    );


  // ===================================================
  // APPROVED
  // THIS IS THE MASTER COUNT
  // ===================================================

  const approvedMembers =
    useMemo(
      () =>
        members.filter(
          (member) =>
            String(
              member.membershipStatus ||
              ""
            )
              .trim()
              .toLowerCase() ===
            "approved"
        ),
      [members]
    );


  // ===================================================
  // REJECTED
  // ===================================================

  const rejectedMembers =
    useMemo(
      () =>
        members.filter(
          (member) =>
            String(
              member.membershipStatus ||
              ""
            )
              .trim()
              .toLowerCase() ===
            "rejected"
        ),
      [members]
    );


  // ===================================================
  // SEARCH
  // ===================================================

  const searchText =
    search
      .trim()
      .toLowerCase();


  function filterMembers(
    list
  ) {

    if (!searchText) {

      return list;

    }


    return list.filter(
      (member) => {

        const name =
          String(
            member.fullName ||
            ""
          ).toLowerCase();


        const whatsapp =
          String(
            member.whatsappNumber ||
            ""
          ).toLowerCase();


        const email =
          String(
            member.email ||
            ""
          ).toLowerCase();


        const district =
          String(
            member.district ||
            ""
          ).toLowerCase();


        return (
          name.includes(
            searchText
          ) ||
          whatsapp.includes(
            searchText
          ) ||
          email.includes(
            searchText
          ) ||
          district.includes(
            searchText
          )
        );

      }
    );

  }


  const visiblePending =
    filterMembers(
      pendingMembers
    );


  const visibleApproved =
    filterMembers(
      approvedMembers
    );


  const visibleRejected =
    filterMembers(
      rejectedMembers
    );


  // ===================================================
  // ACCEPT
  // ===================================================

  async function handleApprove(
    member
  ) {

    if (!member?.id) {
      return;
    }


    const confirmed =
      window.confirm(
        `क्या आप "${member.fullName}" का membership application Accept करना चाहते हैं?`
      );


    if (!confirmed) {
      return;
    }


    try {

      setActionLoadingId(
        member.id
      );


      setError("");


      await approveMembership(
        member.id,
        "Admin"
      );


      setSelectedMember(
        null
      );


      await loadMembers();

    } catch (err) {

      console.error(
        "Approve membership error:",
        err
      );


      setError(
        err?.message ||
        "Application approve नहीं हो सका।"
      );

    } finally {

      setActionLoadingId(
        null
      );

    }

  }


  // ===================================================
  // REJECT
  // ===================================================

  async function handleReject(
    member
  ) {

    if (!member?.id) {
      return;
    }


    const reason =
      window.prompt(
        "Reject करने का कारण लिखें (optional):"
      );


    if (reason === null) {
      return;
    }


    try {

      setActionLoadingId(
        member.id
      );


      setError("");


      await rejectMembership(
        member.id,
        reason,
        "Admin"
      );


      setSelectedMember(
        null
      );


      await loadMembers();

    } catch (err) {

      console.error(
        "Reject membership error:",
        err
      );


      setError(
        err?.message ||
        "Application reject नहीं हो सका।"
      );

    } finally {

      setActionLoadingId(
        null
      );

    }

  }


  // ===================================================
  // ACTIVE LIST
  // ===================================================

  const visibleMembers =
    activeSection ===
      "pending"
      ? visiblePending
      : activeSection ===
          "approved"
        ? visibleApproved
        : activeSection ===
            "rejected"
          ? visibleRejected
          : [];


  // ===================================================
  // UI
  // ===================================================

  return (
    <section className="membership-page">

      {/* HEADER */}

      <div className="membership-page-header">

        <div>

          <span className="panel-eyebrow">
            MEMBER MANAGEMENT
          </span>


          <h1>
            Membership
          </h1>


          <p>
            Pending applications को approve/reject
            करें और members manage करें।
          </p>

        </div>


        <button
          type="button"
          className="membership-refresh-button"
          onClick={() => {

            setLoading(true);

            void loadMembers();

          }}
          disabled={loading}
        >

          {loading
            ? "Loading..."
            : "↻ Refresh"}

        </button>

      </div>


      {/* ERROR */}

      {error && (

        <div className="membership-error">

          ⚠️ {error}

        </div>

      )}


      {/* LOADING */}

      {loading ? (

        <div className="membership-loading">

          <div className="loading-spinner"></div>


          <h3>
            Membership लोड हो रहा है...
          </h3>


          <p>
            कृपया थोड़ा इंतजार करें।
          </p>

        </div>

      ) : (

        <>

          {/* SECTION CARDS */}

          <div className="membership-section-grid">

            <SectionCard
              type="pending"
              title="Pending Requests"
              description="समीक्षा के लिए लंबित आवेदन"
              count={
                pendingMembers.length
              }
              icon="📋"
              active={
                activeSection ===
                "pending"
              }
              onClick={() => {

                setSearch("");

                setActiveSection(
                  "pending"
                );

              }}
            />


            <SectionCard
              type="approved"
              title="Approved Members"
              description="संस्था के स्वीकृत सदस्य"
              count={
                approvedMembers.length
              }
              icon="✓"
              active={
                activeSection ===
                "approved"
              }
              onClick={() => {

                setSearch("");

                setActiveSection(
                  "approved"
                );

              }}
            />


            <SectionCard
              type="rejected"
              title="Rejected Members"
              description="अस्वीकृत सदस्य आवेदन"
              count={
                rejectedMembers.length
              }
              icon="✕"
              active={
                activeSection ===
                "rejected"
              }
              onClick={() => {

                setSearch("");

                setActiveSection(
                  "rejected"
                );

              }}
            />

          </div>


          {/* LIST PANEL */}

          <div className="membership-list-panel">

            <div className="membership-list-header">

              <div>

                <span className="panel-eyebrow">

                  {activeSection ===
                    "pending"
                    ? "PENDING REQUESTS"
                    : activeSection ===
                        "approved"
                      ? "APPROVED MEMBERS"
                      : "REJECTED MEMBERS"}

                </span>


                <h2>

                  {activeSection ===
                    "pending"
                    ? "Pending Membership Requests"
                    : activeSection ===
                        "approved"
                      ? "Approved Members"
                      : "Rejected Members"}

                </h2>

              </div>


              <div className="membership-list-count">

                {visibleMembers.length}
                {" "}
                Members

              </div>

            </div>


            {/* SEARCH */}

            <div className="membership-search-wrapper">

              <span>
                🔎
              </span>


              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="नाम, WhatsApp, Email या जिला खोजें..."
              />


              {search && (

                <button
                  type="button"
                  className="membership-search-clear"
                  onClick={() =>
                    setSearch("")
                  }
                >
                  ×
                </button>

              )}

            </div>


            {/* LIST */}

            <div className="membership-member-list">

              {visibleMembers.length ===
              0 ? (

                <div className="membership-no-results">

                  <div>
                    {activeSection ===
                    "pending"
                      ? "📋"
                      : "👥"}
                  </div>


                  <h3>

                    {activeSection ===
                    "pending"
                      ? "कोई Pending Request नहीं है"
                      : "कोई member नहीं मिला"}

                  </h3>


                  <p>
                    अभी इस section में कोई
                    application उपलब्ध नहीं है।
                  </p>

                </div>

              ) : (

                visibleMembers.map(
                  (member) => {

                    if (
                      activeSection ===
                      "pending"
                    ) {

                      return (
                        <PendingRequestRow
                          key={
                            member.id
                          }
                          member={
                            member
                          }
                          onView={
                            setSelectedMember
                          }
                          onApprove={
                            handleApprove
                          }
                          onReject={
                            handleReject
                          }
                          actionLoading={
                            actionLoadingId ===
                            member.id
                          }
                        />
                      );

                    }


                    return (
                      <MemberRow
                        key={
                          member.id
                        }
                        member={
                          member
                        }
                        onView={
                          setSelectedMember
                        }
                      />
                    );

                  }
                )

              )}

            </div>

          </div>

        </>

      )}


      {/* DETAIL MODAL */}

      {selectedMember && (

        <MemberDetailModal
          member={
            selectedMember
          }
          onClose={() =>
            setSelectedMember(
              null
            )
          }
          showActions={
            String(
              selectedMember.membershipStatus ||
              ""
            )
              .trim()
              .toLowerCase() ===
            "pending"
          }
          onApprove={
            handleApprove
          }
          onReject={
            handleReject
          }
          actionLoading={
            actionLoadingId ===
            selectedMember.id
          }
        />

      )}

    </section>
  );

}


export default Membership;