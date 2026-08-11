import logo from "../../assets/logo.png";

function AdminNavbar({
  activeSection,
  setActiveSection,
  onLogout,
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "🏠",
    },
    {
      id: "membership",
      label: "Membership",
      icon: "📋",
    },
    {
      id: "events",
      label: "Events",
      icon: "🎉",
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: "🖼️",
    },
  ];

  const handleNavigation = (section) => {
    console.log("Navbar clicked:", section);

    if (typeof setActiveSection === "function") {
      setActiveSection(section);
    }
  };

  return (
    <header className="admin-navbar">

      {/* =====================================
          BRAND
      ====================================== */}

      <div className="admin-brand">

        <img
          src={logo}
          alt="युवा सारथी"
          className="admin-logo"
        />

        <div className="admin-brand-text">
          <h1>युवा सारथी</h1>
          <span>Admin Panel</span>
        </div>

      </div>

      {/* =====================================
          NAVIGATION
      ====================================== */}

      <nav className="admin-nav">

        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={
              activeSection === item.id
                ? "admin-nav-button active"
                : "admin-nav-button"
            }
            onClick={() =>
              handleNavigation(item.id)
            }
          >
            <span className="admin-nav-icon">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </button>
        ))}

        {/* =====================================
            LOGOUT
        ====================================== */}

        <button
          type="button"
          className="admin-logout-button"
          onClick={() => {
            console.log("Admin logout clicked");

            if (typeof onLogout === "function") {
              onLogout();
            }
          }}
        >
          🚪 Logout
        </button>

      </nav>

    </header>
  );
}

export default AdminNavbar;