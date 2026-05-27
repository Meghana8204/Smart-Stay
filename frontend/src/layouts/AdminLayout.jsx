import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/admin/hotels", label: "Hotels", icon: "🏨" },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/create-owner", label: "Create Owner", icon: "🔑" },
];

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const currentPage =
    NAV_ITEMS.find((n) => location.pathname.startsWith(n.to))?.label || "Admin";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        .al-root * {
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .al-root {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
        }

        /* ── SIDEBAR ── */
        .al-sidebar {
          width: 260px;
          background: #0f2d52;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: width 0.28s ease;
          position: relative;
          z-index: 40;
        }

        .al-sidebar.collapsed { width: 72px; }

        /* ── LOGO ── */
        .al-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 22px 20px 18px;
          border-bottom: 0.5px solid rgba(255,255,255,0.08);
          overflow: hidden;
          flex-shrink: 0;
        }

        .al-logo-icon {
          width: 36px;
          height: 36px;
          background: #1a4a8a;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .al-logo-text {
          overflow: hidden;
          white-space: nowrap;
          transition: opacity 0.2s, width 0.28s;
        }

        .al-sidebar.collapsed .al-logo-text {
          opacity: 0;
          width: 0;
        }

        .al-logo-name {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.3px;
          line-height: 1.2;
        }

        .al-logo-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.4);
          font-weight: 400;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        /* ── COLLAPSE TOGGLE ── */
        .al-collapse-btn {
          position: absolute;
          top: 22px;
          right: -12px;
          width: 24px;
          height: 24px;
          background: #1a4a8a;
          border: 2px solid #0f2d52;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 10px;
          color: #fff;
          transition: background 0.18s, transform 0.28s;
          z-index: 50;
        }

        .al-collapse-btn:hover { background: #2563a8; }
        .al-sidebar.collapsed .al-collapse-btn { transform: rotate(180deg); }

        /* ── NAV SECTION ── */
        .al-nav-section {
          padding: 16px 12px 8px;
          overflow: hidden;
        }

        .al-nav-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          padding: 0 8px;
          margin-bottom: 6px;
          white-space: nowrap;
          transition: opacity 0.2s;
        }

        .al-sidebar.collapsed .al-nav-label { opacity: 0; }

        .al-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.6);
          font-size: 13.5px;
          font-weight: 500;
          transition: background 0.18s, color 0.18s;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
        }

        .al-nav-link:hover {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.9);
        }

        .al-nav-link.active {
          background: #1a4a8a;
          color: #fff;
          font-weight: 600;
        }

        .al-nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 20%;
          height: 60%;
          width: 3px;
          background: #60a5fa;
          border-radius: 0 3px 3px 0;
        }

        .al-nav-icon {
          font-size: 17px;
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }

        .al-nav-label-text {
          transition: opacity 0.2s;
          overflow: hidden;
        }

        .al-sidebar.collapsed .al-nav-label-text { opacity: 0; }

        /* Tooltip on collapsed */
        .al-sidebar.collapsed .al-nav-link {
          position: relative;
        }
        .al-sidebar.collapsed .al-nav-link:hover::after {
          content: attr(data-label);
          position: absolute;
          left: 60px;
          top: 50%;
          transform: translateY(-50%);
          background: #1a4a8a;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 7px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 100;
          font-family: 'Poppins', sans-serif;
        }

        /* ── USER CARD ── */
        .al-user-card {
          margin: 12px;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          border: 0.5px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .al-user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #1a4a8a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
          border: 1.5px solid rgba(255,255,255,0.15);
        }

        .al-user-info {
          overflow: hidden;
          transition: opacity 0.2s;
          flex: 1;
        }

        .al-sidebar.collapsed .al-user-info { opacity: 0; }

        .al-user-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .al-user-role {
          font-size: 10.5px;
          color: rgba(255,255,255,0.4);
          white-space: nowrap;
        }

        /* ── LOGOUT ── */
        .al-logout {
          margin: 8px 12px 16px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 0.5px solid rgba(192,57,43,0.4);
          background: rgba(192,57,43,0.12);
          color: #fca5a5;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: background 0.18s, color 0.18s;
          overflow: hidden;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .al-logout:hover {
          background: rgba(192,57,43,0.25);
          color: #fff;
        }

        .al-logout-icon { font-size: 16px; flex-shrink: 0; }

        .al-sidebar.collapsed .al-logout-text { opacity: 0; }

        /* ── MAIN ── */
        .al-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* ── TOPBAR ── */
        .al-topbar {
          background: #fff;
          border-bottom: 0.5px solid #e5e7eb;
          padding: 0 28px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          gap: 16px;
        }

        .al-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .al-mobile-menu-btn {
          display: none;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 0.5px solid #e5e7eb;
          background: transparent;
          cursor: pointer;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .al-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .al-breadcrumb-home {
          font-size: 12.5px;
          color: #9ca3af;
          text-decoration: none;
        }

        .al-breadcrumb-sep {
          font-size: 12px;
          color: #d1d5db;
        }

        .al-breadcrumb-current {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
        }

        .al-topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .al-topbar-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 0.5px solid #e5e7eb;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          position: relative;
          transition: background 0.18s;
        }

        .al-topbar-icon-btn:hover { background: #f3f4f6; }

        .al-notif-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 7px;
          height: 7px;
          background: #c0392b;
          border-radius: 50%;
          border: 1.5px solid #fff;
        }

        .al-topbar-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #1a4a8a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          border: 2px solid #e5e7eb;
          cursor: pointer;
          transition: border-color 0.18s;
          font-family: 'Poppins', sans-serif;
        }

        .al-topbar-avatar:hover { border-color: #1a4a8a; }

        /* ── CONTENT ── */
        .al-content {
          flex: 1;
          padding: 28px;
          overflow-y: auto;
        }

        /* ── MOBILE OVERLAY ── */
        .al-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 30;
        }

        @media (max-width: 768px) {
          .al-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            transition: transform 0.28s ease;
            width: 260px !important;
            z-index: 40;
          }
          .al-sidebar.mobile-open {
            transform: translateX(0);
          }
          .al-collapse-btn { display: none; }
          .al-mobile-menu-btn { display: flex !important; }
          .al-overlay { display: block; }
          .al-overlay.hidden { display: none; }
          .al-content { padding: 16px; }
          .al-topbar { padding: 0 16px; }
          .al-nav-label-text { opacity: 1 !important; }
        }
      `}</style>

      {/* Mobile overlay */}
      <div
        className={`al-overlay ${mobileOpen ? "" : "hidden"}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className="al-root">
        {/* ── SIDEBAR ── */}
        <aside
          className={`al-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
        >
          {/* Collapse toggle (desktop) */}
          <button
            className="al-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            ◀
          </button>

          {/* Logo */}
          <div className="al-logo">
            <div className="al-logo-icon">🏨</div>
            <div className="al-logo-text">
              <div className="al-logo-name">SmartStay</div>
              <div className="al-logo-sub">Admin Panel</div>
            </div>
          </div>

          {/* Nav */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            <div className="al-nav-section">
              <div className="al-nav-label">Main Menu</div>
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  data-label={item.label}
                  className={({ isActive }) =>
                    `al-nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="al-nav-icon">{item.icon}</span>
                  <span className="al-nav-label-text">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* User card */}
          <div className="al-user-card">
            <div className="al-user-avatar">
              {(user?.user?.name || user?.user?.email || "A")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="al-user-info">
              <div className="al-user-name">
                {user?.user?.name || "Admin"}
              </div>
              <div className="al-user-role">
                {user?.user?.role === "admin"
                  ? "Super Administrator"
                  : user?.user?.role === "hotelOwner"
                  ? "Hotel Owner"
                  : "User"}
              </div>
            </div>
          </div>

          {/* Logout */}
          <button className="al-logout" onClick={handleLogout}>
            <span className="al-logout-icon">🚪</span>
            <span className="al-logout-text">Log out</span>
          </button>
        </aside>

        {/* ── MAIN ── */}
        <div className="al-main">
          {/* Topbar */}
          <header className="al-topbar">
            <div className="al-topbar-left">
              <button
                className="al-mobile-menu-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                ☰
              </button>
              <nav className="al-breadcrumb" aria-label="Breadcrumb">
                <span className="al-breadcrumb-home">Admin</span>
                <span className="al-breadcrumb-sep">›</span>
                <span className="al-breadcrumb-current">{currentPage}</span>
              </nav>
            </div>

            <div className="al-topbar-right">
              <button className="al-topbar-icon-btn" aria-label="Notifications">
                🔔
                <span className="al-notif-dot" />
              </button>
              <button className="al-topbar-icon-btn" aria-label="Settings">
                ⚙️
              </button>
              <div
                className="al-topbar-avatar"
                title={user?.user?.name || "Admin"}
              >
                {(user?.user?.name || user?.user?.email || "A")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="al-content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminLayout;