import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase.js";


// ============================================
// COLLECTIONS
// ============================================

export const MEMBERSHIP_COLLECTION =
  "memberships";

export const SETTINGS_COLLECTION =
  "settings";

export const MEMBER_COUNT_DOC =
  "memberCount";


// ============================================
// CREATE MEMBERSHIP APPLICATION
// ============================================

export async function createMembershipApplication(
  applicationData
) {

  if (!applicationData) {

    throw new Error(
      "सदस्यता आवेदन की जानकारी नहीं मिली।"
    );

  }


  const {
    fullName,
    whatsappNumber,
    email,
    district,
    village,
    address,
    age,
  gender,
    reason,
    occupation,
  } = applicationData;


  if (!fullName?.trim()) {

    throw new Error(
      "कृपया पूरा नाम भरें।"
    );

  }


  if (!whatsappNumber?.trim()) {

    throw new Error(
      "कृपया WhatsApp नंबर भरें।"
    );

  }


  if (!district?.trim()) {

    throw new Error(
      "कृपया जिला भरें।"
    );

  }


  if (!village?.trim()) {

    throw new Error(
      "कृपया गांव / शहर का नाम भरें।"
    );

  }


  if (!address?.trim()) {

    throw new Error(
      "कृपया पूरा पता भरें।"
    );

  }


  if (!reason?.trim()) {

    throw new Error(
      "कृपया संस्था से जुड़ने का उद्देश्य बताएं।"
    );

  }


  // ==========================================
  // WHATSAPP VALIDATION
  // ==========================================

  const cleanWhatsapp =
    whatsappNumber.replace(
      /\D/g,
      ""
    );


  if (
    cleanWhatsapp.length !==
    10
  ) {

    throw new Error(
      "कृपया सही 10 अंकों का WhatsApp नंबर डालें।"
    );

  }


  // ==========================================
  // FIRESTORE DATA
  // ==========================================

  const membershipData = {
  fullName: fullName.trim(),

  whatsappNumber: cleanWhatsapp,

  email: email?.trim() || "",

  age: age || "",

  gender: gender?.trim() || "",

  district: district.trim(),

  village: village.trim(),

  address: address.trim(),

  reason: reason.trim(),

  occupation: occupation?.trim() || "",

  membershipStatus: "pending",

  approvedAt: null,

  approvedBy: "",

  rejectionReason: "",

  createdAt: serverTimestamp(),

  updatedAt: serverTimestamp(),
};


  // ==========================================
  // SAVE APPLICATION
  // ==========================================

  const membershipRef =
    await addDoc(
      collection(
        db,
        MEMBERSHIP_COLLECTION
      ),
      membershipData
    );


  return {

    id:
      membershipRef.id,

    ...membershipData,

  };

}


// ============================================
// GET ALL MEMBERSHIP APPLICATIONS
// ============================================

export async function getMembershipApplications() {

  const membershipQuery =
    query(
      collection(
        db,
        MEMBERSHIP_COLLECTION
      ),
      orderBy(
        "createdAt",
        "desc"
      )
    );


  const snapshot =
    await getDocs(
      membershipQuery
    );


  return snapshot.docs.map(
    (membershipDoc) => ({

      id:
        membershipDoc.id,

      ...membershipDoc.data(),

    })
  );

}


// ============================================
// GET MEMBER COUNT
// ============================================
// NOTE:
// Public/Admin count अब इस function पर depend
// नहीं करता। Actual approved documents count
// Membership.jsx और Hero.jsx से calculate होता है.
// ============================================

export async function getMemberCount() {

  const snapshot =
    await getDocs(
      collection(
        db,
        MEMBERSHIP_COLLECTION
      )
    );


  const approvedCount =
    snapshot.docs.filter(
      (membershipDoc) => {

        const data =
          membershipDoc.data();


        return (
          String(
            data?.membershipStatus ||
            ""
          )
            .trim()
            .toLowerCase() ===
          "approved"
        );

      }
    ).length;


  return approvedCount;

}


// ============================================
// UPDATE MEMBER COUNT
// ============================================
// Kept only for compatibility.
// Main website count does NOT use this.
// ============================================

export async function updateMemberCount(
  newCount
) {

  const numericCount =
    Number(newCount);


  if (
    !Number.isFinite(
      numericCount
    )
  ) {

    throw new Error(
      "Member count सही नहीं है।"
    );

  }


  if (
    numericCount < 0
  ) {

    throw new Error(
      "Member count 0 से कम नहीं हो सकता।"
    );

  }


  const countRef =
    doc(
      db,
      SETTINGS_COLLECTION,
      MEMBER_COUNT_DOC
    );


  await setDoc(
    countRef,
    {

      count:
        Math.floor(
          numericCount
        ),

      updatedAt:
        serverTimestamp(),

    },
    {
      merge: true,
    }
  );


  return Math.floor(
    numericCount
  );

}


// ============================================
// INCREASE MEMBER COUNT
// ============================================
// Kept only for old code compatibility.
// Do NOT use this for membership approval.
// ============================================

export async function increaseMemberCount(
  amount = 1
) {

  const currentCount =
    await getMemberCount();


  const newCount =
    currentCount +
    Number(amount);


  return await updateMemberCount(
    newCount
  );

}


// ============================================
// DECREASE MEMBER COUNT
// ============================================
// Kept only for old code compatibility.
// ============================================

export async function decreaseMemberCount(
  amount = 1
) {

  const currentCount =
    await getMemberCount();


  const newCount =
    currentCount -
    Number(amount);


  if (
    newCount < 0
  ) {

    throw new Error(
      "Member count 0 से कम नहीं हो सकता।"
    );

  }


  return await updateMemberCount(
    newCount
  );

}


// ============================================
// APPROVE MEMBERSHIP
// ============================================

export async function approveMembership(
  membershipId,
  adminEmail = ""
) {

  if (!membershipId) {

    throw new Error(
      "Membership ID नहीं मिला।"
    );

  }


  const membershipRef =
    doc(
      db,
      MEMBERSHIP_COLLECTION,
      membershipId
    );


  const membershipSnapshot =
    await getDoc(
      membershipRef
    );


  if (
    !membershipSnapshot.exists()
  ) {

    throw new Error(
      "सदस्यता आवेदन नहीं मिला।"
    );

  }


  const membershipData =
    membershipSnapshot.data();


  // ==========================================
  // ALREADY APPROVED CHECK
  // ==========================================

  if (
    String(
      membershipData.membershipStatus ||
      ""
    )
      .trim()
      .toLowerCase() ===
    "approved"
  ) {

    return true;

  }


  // ==========================================
  // APPROVE
  // ==========================================

  await updateDoc(
    membershipRef,
    {

      membershipStatus:
        "approved",

      approvedAt:
        serverTimestamp(),

      approvedBy:
        adminEmail || "",

      rejectionReason:
        "",

      updatedAt:
        serverTimestamp(),

    }
  );


  // ==================================================
  // IMPORTANT
  // ==================================================
  //
  // यहाँ memberCount +1 नहीं किया जाएगा.
  //
  // Approved count हमेशा memberships collection
  // के actual approved documents से calculate होगा.
  //
  // इससे deleted member दोबारा count नहीं होगा.
  //
  // ==================================================


  return true;

}


// ============================================
// REJECT MEMBERSHIP
// ============================================

export async function rejectMembership(
  membershipId,
  rejectionReason = "",
  adminEmail = ""
) {

  if (!membershipId) {

    throw new Error(
      "Membership ID नहीं मिला।"
    );

  }


  const membershipRef =
    doc(
      db,
      MEMBERSHIP_COLLECTION,
      membershipId
    );


  const membershipSnapshot =
    await getDoc(
      membershipRef
    );


  if (
    !membershipSnapshot.exists()
  ) {

    throw new Error(
      "सदस्यता आवेदन नहीं मिला।"
    );

  }


  await updateDoc(
    membershipRef,
    {

      membershipStatus:
        "rejected",

      rejectionReason:
        rejectionReason?.trim() ||
        "",

      approvedBy:
        adminEmail || "",

      approvedAt:
        null,

      updatedAt:
        serverTimestamp(),

    }
  );


  return true;

}