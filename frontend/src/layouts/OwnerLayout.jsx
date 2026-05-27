import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/owner/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/owner/hotels", label: "My Hotels", icon: "🏨" },
  { to: "/owner/rooms", label: "Rooms", icon: "🛏️" },
  { to: "/owner/bookings", label: "Bookings", icon: "📅" },
];

function OwnerLayout() {
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
    NAV_ITEMS.find((n) => location.pathname.startsWith(n.to))?.label ||
    "Owner Portal";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        .ol-root * {
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .ol-root {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
        }

        /* ── SIDEBAR ── */
        .ol-sidebar {
          width: 255px;
          background: linear-gradient(175deg, #0c2340 0%, #1a4a8a 100%);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: width 0.28s ease;
          position: relative;
          z-index: 40;
        }

        .ol-sidebar.collapsed { width: 70px; }

        /* ── COLLAPSE BTN ── */
        .ol-collapse-btn {
          position: absolute;
          top: 22px;
          right: -12px;
          width: 24px;
          height: 24px;
          background: #1a4a8a;
          border: 2px solid #f1f5f9;
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
        .ol-collapse-btn:hover { background: #2563a8; }
        .ol-sidebar.collapsed .ol-collapse-btn { transform: rotate(180deg); }

        /* ── LOGO ── */
        .ol-logo {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 22px 18px 18px;
          border-bottom: 0.5px solid rgba(255,255,255,0.1);
          overflow: hidden;
          flex-shrink: 0;
        }

        .ol-logo-icon {
          width: 38px;
          height: 38px;
          background: rgba(255,255,255,0.12);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          flex-shrink: 0;
          border: 0.5px solid rgba(255,255,255,0.2);
        }

        .ol-logo-text {
          overflow: hidden;
          white-space: nowrap;
          transition: opacity 0.2s;
        }
        .ol-sidebar.collapsed .ol-logo-text { opacity: 0; }

        .ol-logo-name {
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.2px;
          line-height: 1.2;
        }
        .ol-logo-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.45);
          font-weight: 400;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        /* ── STATS MINI ── */
        .ol-mini-stats {
          display: flex;
          gap: 8px;
          padding: 14px 14px 10px;
          overflow: hidden;
          flex-shrink: 0;
          transition: opacity 0.2s, max-height 0.28s;
          max-height: 80px;
        }
        .ol-sidebar.collapsed .ol-mini-stats {
          opacity: 0;
          max-height: 0;
          padding: 0;
        }

        .ol-stat {
          flex: 1;
          background: rgba(255,255,255,0.07);
          border-radius: 9px;
          padding: 8px 6px;
          text-align: center;
          border: 0.5px solid rgba(255,255,255,0.1);
        }
        .ol-stat-num {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          display: block;
          line-height: 1;
        }
        .ol-stat-label {
          font-size: 9.5px;
          color: rgba(255,255,255,0.4);
          display: block;
          margin-top: 3px;
          white-space: nowrap;
        }

        /* ── NAV ── */
        .ol-nav-section {
          padding: 10px 10px 8px;
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
        }
        .ol-nav-section::-webkit-scrollbar { display: none; }

        .ol-nav-group-label {
          font-size: 10px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          padding: 0 8px;
          margin-bottom: 5px;
          white-space: nowrap;
          transition: opacity 0.2s;
        }
        .ol-sidebar.collapsed .ol-nav-group-label { opacity: 0; }

        .ol-nav-link {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.55);
          font-size: 13px;
          font-weight: 500;
          transition: background 0.18s, color 0.18s;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          position: relative;
        }

        .ol-nav-link:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.9);
        }

        .ol-nav-link.active {
          background: rgba(255,255,255,0.14);
          color: #fff;
          font-weight: 600;
        }

        .ol-nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 18%;
          height: 64%;
          width: 3px;
          background: #93c5fd;
          border-radius: 0 3px 3px 0;
        }

        .ol-nav-icon {
          font-size: 17px;
          flex-shrink: 0;
          width: 20px;
          text-align: center;
        }

        .ol-nav-label-text {
          transition: opacity 0.2s;
        }
        .ol-sidebar.collapsed .ol-nav-label-text { opacity: 0; }

        /* Tooltip */
        .ol-sidebar.collapsed .ol-nav-link:hover::after {
          content: attr(data-label);
          position: absolute;
          left: 58px;
          top: 50%;
          transform: translateY(-50%);
          background: #0c2340;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 7px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 100;
          font-family: 'Poppins', sans-serif;
          border: 0.5px solid rgba(255,255,255,0.15);
        }

        /* ── USER CARD ── */
        .ol-user-card {
          margin: 8px 10px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.06);
          border-radius: 11px;
          border: 0.5px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .ol-user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
          border: 1.5px solid rgba(255,255,255,0.2);
        }

        .ol-user-info {
          overflow: hidden;
          transition: opacity 0.2s;
          flex: 1;
          min-width: 0;
        }
        .ol-sidebar.collapsed .ol-user-info { opacity: 0; }

        .ol-user-name {
          font-size: 12.5px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ol-user-role {
          font-size: 10.5px;
          color: rgba(255,255,255,0.4);
          white-space: nowrap;
        }

        /* ── LOGOUT ── */
        .ol-logout {
          margin: 6px 10px 16px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 0.5px solid rgba(252,165,165,0.3);
          background: rgba(192,57,43,0.1);
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
          text-align: left;
        }
        .ol-logout:hover {
          background: rgba(192,57,43,0.22);
          color: #fff;
        }
        .ol-logout-icon { font-size: 16px; flex-shrink: 0; }
        .ol-sidebar.collapsed .ol-logout-text { opacity: 0; }

        /* ── MAIN ── */
        .ol-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        /* ── TOPBAR ── */
        .ol-topbar {
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

        .ol-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ol-mobile-btn {
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

        .ol-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ol-breadcrumb-root {
          font-size: 12.5px;
          color: #9ca3af;
        }
        .ol-breadcrumb-sep { font-size: 12px; color: #d1d5db; }
        .ol-breadcrumb-page {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
        }

        .ol-topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ol-icon-btn {
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
        .ol-icon-btn:hover { background: #f3f4f6; }

        .ol-notif-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 7px;
          height: 7px;
          background: #c0392b;
          border-radius: 50%;
          border: 1.5px solid #fff;
        }

        .ol-topbar-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 12px 5px 6px;
          border-radius: 99px;
          border: 0.5px solid #e5e7eb;
          background: transparent;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s;
        }
        .ol-topbar-pill:hover {
          border-color: #1a4a8a;
          background: #f8faff;
        }

        .ol-topbar-ava {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #1a4a8a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
        }

        .ol-topbar-name {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          font-family: 'Poppins', sans-serif;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ── CONTENT ── */
        .ol-content {
          flex: 1;
          padding: 28px;
          overflow-y: auto;
        }

        /* ── OVERLAY ── */
        .ol-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 30;
        }

        @media (max-width: 768px) {
          .ol-sidebar {
            position: fixed;
            top: 0; left: 0; bottom: 0;
            transform: translateX(-100%);
            transition: transform 0.28s ease;
            width: 255px !important;
            z-index: 40;
          }
          .ol-sidebar.mobile-open { transform: translateX(0); }
          .ol-collapse-btn { display: none; }
          .ol-mobile-btn { display: flex !important; }
          .ol-overlay { display: block; }
          .ol-overlay.hidden { display: none; }
          .ol-content { padding: 16px; }
          .ol-topbar { padding: 0 16px; }
          .ol-nav-label-text { opacity: 1 !important; }
          .ol-mini-stats { opacity: 1 !important; max-height: 80px !important; padding: 14px 14px 10px !important; }
          .ol-topbar-name { display: none; }
        }
      `}</style>

      {/* Mobile overlay */}
      <div
        className={`ol-overlay ${mobileOpen ? "" : "hidden"}`}
        onClick={() => setMobileOpen(false)}
      />

      <div className="ol-root">
        {/* ── SIDEBAR ── */}
        <aside
          className={`ol-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
        >
          <button
            className="ol-collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            ◀
          </button>

          {/* Logo */}
          <div className="ol-logo">
            <div className="ol-logo-icon">🏨</div>
            <div className="ol-logo-text">
              <div className="ol-logo-name">SmartStay</div>
              <div className="ol-logo-sub">Owner Portal</div>
            </div>
          </div>

          {/* Mini stats */}
          <div className="ol-mini-stats">
            <div className="ol-stat">
              <span className="ol-stat-num">12</span>
              <span className="ol-stat-label">Hotels</span>
            </div>
            <div className="ol-stat">
              <span className="ol-stat-num">48</span>
              <span className="ol-stat-label">Bookings</span>
            </div>
            <div className="ol-stat">
              <span className="ol-stat-num">4.8</span>
              <span className="ol-stat-label">Rating</span>
            </div>
          </div>

          {/* Nav */}
          <div className="ol-nav-section">
            <div className="ol-nav-group-label">Navigation</div>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                data-label={item.label}
                className={({ isActive }) =>
                  `ol-nav-link ${isActive ? "active" : ""}`
                }
                onClick={() => setMobileOpen(false)}
              >
                <span className="ol-nav-icon">{item.icon}</span>
                <span className="ol-nav-label-text">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* User card */}
          <div className="ol-user-card">
            <div className="ol-user-avatar">
              {(user?.user?.name || user?.user?.email || "O")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="ol-user-info">
              <div className="ol-user-name">
                {user?.user?.name || "Owner"}
              </div>
              <div className="ol-user-role">Hotel Owner</div>
            </div>
          </div>

          {/* Logout */}
          <button className="ol-logout" onClick={handleLogout}>
            <span className="ol-logout-icon">🚪</span>
            <span className="ol-logout-text">Log out</span>
          </button>
        </aside>

        {/* ── MAIN ── */}
        <div className="ol-main">
          {/* Topbar */}
          <header className="ol-topbar">
            <div className="ol-topbar-left">
              <button
                className="ol-mobile-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                ☰
              </button>
              <nav className="ol-breadcrumb" aria-label="Breadcrumb">
                <span className="ol-breadcrumb-root">Owner</span>
                <span className="ol-breadcrumb-sep">›</span>
                <span className="ol-breadcrumb-page">{currentPage}</span>
              </nav>
            </div>

            <div className="ol-topbar-right">
              <button className="ol-icon-btn" aria-label="Notifications">
                🔔
                <span className="ol-notif-dot" />
              </button>
              <button className="ol-icon-btn" aria-label="Settings">
                ⚙️
              </button>
              <div className="ol-topbar-pill">
                <div className="ol-topbar-ava">
                  {(user?.user?.name || user?.user?.email || "O")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <span className="ol-topbar-name">
                  {user?.user?.name || "Owner"}
                </span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="ol-content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default OwnerLayout;