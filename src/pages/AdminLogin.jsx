import { useState } from "react";

import {
  adminLogin,
  sendAdminResetLink,
} from "../firebase/auth.js";

import "./AdminLogin.css";

const ADMIN_EMAIL = "adityaverma1325@gmail.com";

function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  async function handleLogin(event) {
    event.preventDefault();

    setError("");
    setResetMessage("");

    if (
      email.trim().toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {
      setError(
        "केवल अधिकृत एडमिन ही लॉगिन कर सकता है।"
      );
      return;
    }

    try {
      setLoading(true);

      const result = await adminLogin(
        email.trim(),
        password
      );

      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    } catch (loginError) {
      console.error("Login error:", loginError);

      setError(
        "ईमेल या पासवर्ड गलत है।"
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // PASSWORD RESET
  // =====================================================

  async function handlePasswordReset() {
    const resetEmail =
      email.trim().toLowerCase();

    if (
      resetEmail !==
      ADMIN_EMAIL.toLowerCase()
    ) {
      setError(
        "पहले अधिकृत एडमिन ईमेल डालें।"
      );
      return;
    }

    try {
      setError("");
      setResetMessage("");

      await sendAdminResetLink(resetEmail);

      setResetMessage(
        "पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।"
      );
    } catch (err) {
      console.error(
        "Password reset error:",
        err
      );

      setError(
        `रीसेट में समस्या आई: ${
          err.code || "Unknown error"
        }`
      );
    }
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="admin-page">
      <form
        className="admin-card"
        onSubmit={handleLogin}
      >
        <p className="admin-label">
          YUVA SARATHI NGO
        </p>

        <h1>
          एडमिन लॉगिन
        </h1>

        <p className="admin-subtitle">
          वेबसाइट को मैनेज करने के लिए लॉगिन करें।
        </p>

        <label>
          ईमेल
        </label>

        <input
          type="email"
          placeholder="एडमिन ईमेल"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          required
        />

        <label>
          पासवर्ड
        </label>

        <input
          type="password"
          placeholder="पासवर्ड डालें"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          required
        />

        {error && (
          <p className="admin-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "लॉगिन हो रहा है..."
            : "लॉगिन करें"}
        </button>

        <button
          type="button"
          className="reset-button"
          onClick={handlePasswordReset}
        >
          पासवर्ड भूल गए? रीसेट करें
        </button>

        {resetMessage && (
          <p className="reset-message">
            {resetMessage}
          </p>
        )}

        <a
          className="back-home"
          href="#"
        >
          ← वेबसाइट पर वापस जाएँ
        </a>
      </form>
    </main>
  );
}

export default AdminLogin;