import "../../assets/logo.png";

function AdminNavbar({
  activeSection,
  setActiveSection,
  onLogout,
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "membership", label: "Membership", icon: "📋" },
    { id: "events", label: "Events", icon: "🎉" },
    { id: "gallery", label: "Gallery", icon: "🖼️" },
  ];

  return (
    <header className="admin-navbar">
      <div className="admin-brand">
        <img
          src="/src/assets/logo.png"
          alt="Yuva Sarathi"
          className="admin-logo"
        />

        <div className="admin-brand-text">
          <h1>युवा सारथी</h1>
          <span>Admin Panel</span>
        </div>
      </div>

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
            onClick={() => setActiveSection(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}

        <button
          type="button"
          className="admin-logout-button"
          onClick={onLogout}
        >
          🚪 Logout
        </button>
      </nav>
    </header>
  );
}

export default AdminNavbar;