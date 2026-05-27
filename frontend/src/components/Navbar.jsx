import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Hotels", path: "/hotels", icon: "🏨" },
    { name: "My Bookings", path: "/my-bookings", icon: "📅" },
    { name: "Wishlist", path: "/wishlist", icon: "❤️" },
  ];

  return (
    <>
      {/* Poppins font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        .smartstay-nav * {
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
        }

        .smartstay-nav .nav-link-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #1a4a8a;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
          border-radius: 2px;
        }
        .smartstay-nav .nav-link-underline:hover::after,
        .smartstay-nav .nav-link-underline.active-link::after {
          transform: scaleX(1);
        }

        .smartstay-nav .dropdown-menu {
          opacity: 0;
          visibility: hidden;
          transform: translateY(8px);
          transition: all 0.2s ease;
        }
        .smartstay-nav .dropdown-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .smartstay-nav .profile-menu {
          opacity: 0;
          visibility: hidden;
          transform: translateY(8px);
          transition: all 0.2s ease;
        }
        .smartstay-nav .profile-menu.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .smartstay-nav .mobile-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease;
        }
        .smartstay-nav .mobile-menu.open {
          max-height: 600px;
        }

        .smartstay-nav .mobile-search {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.25s ease;
        }
        .smartstay-nav .mobile-search.open {
          max-height: 80px;
        }

        .smartstay-nav .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: #374151;
          border-radius: 2px;
          transition: all 0.25s ease;
          transform-origin: center;
        }
        .smartstay-nav .hamburger.open span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }
        .smartstay-nav .hamburger.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .smartstay-nav .hamburger.open span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        @media (max-width: 768px) {
          .smartstay-nav .desktop-links { display: none !important; }
          .smartstay-nav .desktop-cta { display: none !important; }
          .smartstay-nav .mobile-toggle { display: flex !important; }
          .smartstay-nav .nav-search { display: none !important; }
          .smartstay-nav .topbar { display: none !important; }
        }
        @media (min-width: 769px) {
          .smartstay-nav .mobile-toggle { display: none !important; }
          .smartstay-nav .mobile-menu { display: none !important; }
          .smartstay-nav .mobile-search { display: none !important; }
        }
        @media (max-width: 1024px) {
          .smartstay-nav .nav-search { max-width: 200px !important; }
        }
      `}</style>

      <nav
        className={`smartstay-nav sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-sm"
        }`}
        style={{ background: "#ffffff" }}
      >
        {/* ── TOP UTILITY BAR ── */}
        <div
          className="topbar"
          style={{
            background: "#0f2d52",
            padding: "6px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <a
              href="tel:+919876543210"
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "12px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.75)")
              }
            >
              📞 +91 98765 43210
            </a>
            <a
              href="mailto:support@smartstay.com"
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "12px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.75)")
              }
            >
              ✉️ support@smartstay.com
            </a>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <a
              href="#"
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "12px",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.75)")
              }
            >
              🌐 EN / USD
            </a>
          </div>
        </div>

        {/* ── MAIN NAV ── */}
        <div
          style={{
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: isScrolled ? "60px" : "68px",
            transition: "height 0.3s ease",
            borderBottom: "0.5px solid #e5e7eb",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#1a4a8a",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              🏨
            </div>
            <div style={{ lineHeight: "1.15" }}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1a4a8a",
                  letterSpacing: "-0.3px",
                }}
              >
                SmartStay
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#9ca3af",
                  fontWeight: "400",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                }}
              >
                Premium Hotels
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div
            className="nav-search"
            style={{
              flex: 1,
              maxWidth: "300px",
              margin: "0 24px",
              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "16px",
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search destinations, hotels…"
              style={{
                width: "100%",
                padding: "9px 16px 9px 38px",
                borderRadius: "24px",
                border: "0.5px solid #d1d5db",
                background: "#f9fafb",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                color: "#111827",
                outline: "none",
                transition: "border 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#1a4a8a";
                e.target.style.boxShadow = "0 0 0 3px rgba(26,74,138,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#d1d5db";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Desktop Nav Links */}
          <div
            className="desktop-links"
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`nav-link-underline ${isActive(link.path) ? "active-link" : ""}`}
                style={{
                  position: "relative",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "13.5px",
                  fontWeight: isActive(link.path) ? "600" : "500",
                  color: isActive(link.path) ? "#1a4a8a" : "#374151",
                  background: isActive(link.path) ? "#eef3fb" : "transparent",
                  transition: "background 0.18s, color 0.18s",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.color = "#1a4a8a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#374151";
                  }
                }}
              >
                {link.icon} {link.name}
                {link.badge && (
                  <span
                    style={{
                      background: "#c0392b",
                      color: "#fff",
                      borderRadius: "99px",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "1px 6px",
                      lineHeight: "1.5",
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop CTA / Avatar */}
          <div
            className="desktop-cta"
            style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "16px", flexShrink: 0 }}
          >
            {user ? (
              <div ref={profileRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 12px 6px 6px",
                    border: "0.5px solid #e5e7eb",
                    borderRadius: "99px",
                    background: "transparent",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#1a4a8a";
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#1a4a8a",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: "700",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {(user?.user?.name || user?.user?.email || "U")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#374151",
                      fontFamily: "'Poppins', sans-serif",
                      maxWidth: "80px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.user?.name || "Profile"}
                  </span>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>▾</span>
                </button>

                <div
                  className={`profile-menu ${profileDropdownOpen ? "open" : ""}`}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: "0",
                    width: "220px",
                    background: "#ffffff",
                    border: "0.5px solid #e5e7eb",
                    borderRadius: "14px",
                    overflow: "hidden",
                    zIndex: 100,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      padding: "14px 16px",
                      borderBottom: "0.5px solid #f3f4f6",
                      background: "#f9fafb",
                    }}
                  >
                    <div
                      style={{ fontSize: "9px", color: "#9ca3af", fontWeight: "600", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "4px" }}
                    >
                      Signed in as
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                      {user?.user?.name || "User"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      {user?.user?.email || ""}
                    </div>
                  </div>

                  {[
                    { icon: "👤", label: "My Profile", path: "/profile" },
                    { icon: "📅", label: "My Bookings", path: "/my-bookings" },
                    { icon: "❤️", label: "Wishlist", path: "/wishlist" },
                    { icon: "⚙️", label: "Settings", path: "/settings" },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => setProfileDropdownOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 16px",
                        fontSize: "13px",
                        color: "#374151",
                        textDecoration: "none",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ fontSize: "15px" }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}

                  <div style={{ borderTop: "0.5px solid #f3f4f6" }} />
                  <button
                    onClick={() => { logout(); setProfileDropdownOpen(false); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 16px",
                      fontSize: "13px",
                      color: "#c0392b",
                      background: "transparent",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: "600",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fef5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    🚪 Log out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/auth"
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    border: "0.5px solid #d1d5db",
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#374151",
                    textDecoration: "none",
                    transition: "background 0.18s, border-color 0.18s",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f3f4f6";
                    e.currentTarget.style.borderColor = "#9ca3af";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "#d1d5db";
                  }}
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  style={{
                    padding: "8px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#1a4a8a",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: "600",
                    textDecoration: "none",
                    transition: "background 0.18s",
                    fontFamily: "'Poppins', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#0f2d52")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#1a4a8a")}
                >
                  Sign up free
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle row */}
          <div
            className="mobile-toggle"
            style={{ display: "none", alignItems: "center", gap: "10px" }}
          >
            <button
              onClick={() => { setMobileSearchOpen(!mobileSearchOpen); setMobileMenuOpen(false); }}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: "0.5px solid #e5e7eb",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
              }}
              aria-label="Toggle search"
            >
              🔍
            </button>
            <button
              onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMobileSearchOpen(false); }}
              className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: "0.5px solid #e5e7eb",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px",
              }}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        {/* ── MOBILE SEARCH ── */}
        <div
          className={`mobile-search ${mobileSearchOpen ? "open" : ""}`}
          style={{ borderTop: "0.5px solid #f3f4f6", padding: mobileSearchOpen ? "12px 16px" : "0 16px" }}
        >
          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "15px",
                pointerEvents: "none",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search destinations, hotels…"
              style={{
                width: "100%",
                padding: "10px 16px 10px 38px",
                borderRadius: "24px",
                border: "0.5px solid #d1d5db",
                background: "#f9fafb",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <div
          className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}
          style={{ borderTop: "0.5px solid #f3f4f6", background: "#fff" }}
        >
          <div style={{ padding: "8px 0" }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 20px",
                  fontSize: "14px",
                  fontWeight: isActive(link.path) ? "600" : "500",
                  color: isActive(link.path) ? "#1a4a8a" : "#374151",
                  textDecoration: "none",
                  background: isActive(link.path) ? "#eef3fb" : "transparent",
                  transition: "background 0.15s",
                }}
              >
                <span style={{ fontSize: "18px" }}>{link.icon}</span>
                {link.name}
                {link.badge && (
                  <span
                    style={{
                      background: "#c0392b",
                      color: "#fff",
                      borderRadius: "99px",
                      fontSize: "10px",
                      fontWeight: "700",
                      padding: "1px 6px",
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            <div style={{ borderTop: "0.5px solid #f3f4f6", margin: "8px 0" }} />

            {user ? (
              <>
                <div style={{ padding: "10px 20px 6px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "#111827" }}>
                    {user?.user?.name || "User"}
                  </div>
                  <div style={{ fontSize: "11px", color: "#9ca3af" }}>{user?.user?.email}</div>
                </div>
                {[
                  { icon: "👤", label: "My Profile", path: "/profile" },
                  { icon: "⚙️", label: "Settings", path: "/settings" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "11px 20px",
                      fontSize: "14px",
                      color: "#374151",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "11px 20px",
                    fontSize: "14px",
                    color: "#c0392b",
                    fontWeight: "600",
                    background: "transparent",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  🚪 Log out
                </button>
              </>
            ) : (
              <div style={{ padding: "10px 16px", display: "flex", gap: "10px" }}>
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    border: "0.5px solid #d1d5db",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#374151",
                    textDecoration: "none",
                    textAlign: "center",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Log in
                </Link>
                <Link
                  to="/auth?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "8px",
                    background: "#1a4a8a",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "600",
                    textDecoration: "none",
                    textAlign: "center",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;