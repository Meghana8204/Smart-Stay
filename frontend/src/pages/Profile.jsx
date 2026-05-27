import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyBookings } from "../services/bookingService";
import { getWishlist } from "../services/wishlistService";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const [bookingCount, setBookingCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) return;

    const fetchSummary = async () => {
      try {
        const [bookingData, wishlistData] = await Promise.all([
          getMyBookings(user.token),
          getWishlist(user.token),
        ]);
        const confirmed = bookingData.bookings?.filter(b => b.bookingStatus === "Confirmed") || [];
        setBookingCount(confirmed.length);
        setWishlistCount(wishlistData.wishlist?.length || 0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [user?.token]);

  const initial = user?.user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600&display=swap');

        .hp-page {
          min-height: 100vh;
          background: #f7f4ef;
          padding: 2rem 1rem;
          font-family: 'Poppins', sans-serif;
        }

        .hp-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* ── Hero Card ── */
        .hp-hero {
          background: #1a1208;
          border-radius: 20px;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
          color: #fff;
        }
        .hp-hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 220px; height: 220px;
          border-radius: 50%;
          background: rgba(196,155,79,0.12);
          pointer-events: none;
        }
        .hp-hero::after {
          content: '';
          position: absolute;
          bottom: -40px; left: 180px;
          width: 140px; height: 140px;
          border-radius: 50%;
          background: rgba(196,155,79,0.07);
          pointer-events: none;
        }

        .hp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(196,155,79,0.15);
          border: 1px solid rgba(196,155,79,0.3);
          border-radius: 30px;
          padding: 4px 14px;
          font-size: 11px;
          font-weight: 500;
          color: #c49b4f;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .hp-hero-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .hp-hero-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .hp-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c49b4f, #e8c97a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: #1a1208;
          flex-shrink: 0;
          font-family: 'Playfair Display', serif;
        }

        .hp-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: #fff;
          line-height: 1.2;
        }

        .hp-email {
          color: rgba(255,255,255,0.55);
          font-size: 0.85rem;
          margin-top: 4px;
        }

        .hp-role {
          display: inline-block;
          background: rgba(196,155,79,0.2);
          border: 1px solid rgba(196,155,79,0.4);
          color: #e8c97a;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 14px;
          border-radius: 20px;
          margin-top: 10px;
          letter-spacing: 0.5px;
          text-transform: capitalize;
        }

        .hp-logout {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: rgba(255,255,255,0.8);
          padding: 10px 22px;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .hp-logout:hover {
          background: rgba(220,50,50,0.2);
          border-color: rgba(220,50,50,0.5);
          color: #ff8080;
        }

        .hp-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 1.5rem 0 0;
        }

        .hp-quick-stats {
          display: flex;
          gap: 2rem;
          padding-top: 1rem;
          flex-wrap: wrap;
        }

        .hp-qs-item { display: flex; flex-direction: column; }

        .hp-qs-num {
          font-size: 1.5rem;
          font-weight: 700;
          color: #c49b4f;
          font-family: 'Playfair Display', serif;
        }

        .hp-qs-label {
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        /* ── Stats Grid ── */
        .hp-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .hp-stat-card {
          background: #fff;
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          border: 1px solid #ece8e0;
        }

        .hp-stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.5rem;
        }
        .hp-stat-icon.booking { background: #f0f9f4; color: #2e7d52; }
        .hp-stat-icon.wishlist { background: #fdf2f2; color: #c0392b; }

        .hp-stat-num {
          font-size: 2.2rem;
          font-weight: 700;
          color: #1a1208;
          font-family: 'Playfair Display', serif;
          line-height: 1;
        }
        .hp-stat-label { font-size: 13px; color: #888; margin-top: 4px; font-weight: 500; }
        .hp-stat-sub { font-size: 11px; color: #bbb; margin-top: 2px; }

        /* ── Settings Card ── */
        .hp-settings {
          background: #fff;
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid #ece8e0;
        }

        .hp-settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .hp-settings-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #1a1208;
        }

        .hp-soon-badge {
          font-size: 10px;
          font-weight: 600;
          background: #fdf6e9;
          color: #b8860b;
          border: 1px solid #f0d98a;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .hp-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          border-bottom: 1px solid #f5f0e8;
        }
        .hp-row:last-child { border-bottom: none; padding-bottom: 0; }

        .hp-row-left { display: flex; align-items: center; gap: 12px; }

        .hp-row-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #f7f4ef;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 1rem;
        }

        .hp-row-title { font-size: 14px; font-weight: 500; color: #2c2c2c; }
        .hp-row-sub { font-size: 12px; color: #aaa; margin-top: 1px; }

        .hp-row-action {
          font-size: 12px;
          color: #c49b4f;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          font-family: 'Poppins', sans-serif;
        }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .hp-stats-grid { grid-template-columns: 1fr; }
          .hp-hero-inner { flex-direction: column; align-items: flex-start; }
          .hp-hero-left { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .hp-logout { width: 100%; justify-content: center; }
          .hp-quick-stats { gap: 1.5rem; }
          .hp-page { padding: 1rem 0.75rem; }
        }
      `}</style>

      <div className="hp-page">
        <div className="hp-container">

          {/* ── Hero Card ── */}
          <div className="hp-hero">
            <div className="hp-badge">✦ Grand Member</div>

            <div className="hp-hero-inner">
              <div className="hp-hero-left">
                <div className="hp-avatar">{initial}</div>
                <div>
                  <div className="hp-name">{user?.user?.name}</div>
                  <div className="hp-email">{user?.user?.email}</div>
                  <span className="hp-role">✦ {user?.user?.role}</span>
                </div>
              </div>
              <button className="hp-logout" onClick={logout}>
                ↩ Logout
              </button>
            </div>

            <hr className="hp-divider" />

            <div className="hp-quick-stats">
              <div className="hp-qs-item">
                <span className="hp-qs-num">
                  {loading ? "—" : bookingCount}
                </span>
                <span className="hp-qs-label">Bookings</span>
              </div>
              <div className="hp-qs-item">
                <span className="hp-qs-num">
                  {loading ? "—" : wishlistCount}
                </span>
                <span className="hp-qs-label">Wishlist</span>
              </div>
              <div className="hp-qs-item">
                <span className="hp-qs-num">Gold</span>
                <span className="hp-qs-label">Tier</span>
              </div>
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div className="hp-stats-grid">
            <div className="hp-stat-card">
              <div className="hp-stat-icon booking">🗓</div>
              <div>
                <div className="hp-stat-num">
                  {loading ? "—" : bookingCount}
                </div>
                <div className="hp-stat-label">Total Bookings</div>
                <div className="hp-stat-sub">Upcoming & completed</div>
              </div>
            </div>
            <div className="hp-stat-card">
              <div className="hp-stat-icon wishlist">♡</div>
              <div>
                <div className="hp-stat-num">
                  {loading ? "—" : wishlistCount}
                </div>
                <div className="hp-stat-label">Wishlist Hotels</div>
                <div className="hp-stat-sub">Saved destinations</div>
              </div>
            </div>
          </div>

          {/* ── Settings Card ── */}
          <div className="hp-settings">
            <div className="hp-settings-header">
              <span className="hp-settings-title">Profile Settings</span>
              <span className="hp-soon-badge">Coming soon</span>
            </div>

            {[
              {
                icon: "👤",
                title: "Personal Information",
                sub: "Update your name, phone & address",
              },
              {
                icon: "🔒",
                title: "Password & Security",
                sub: "Change your login credentials",
              },
              {
                icon: "🔔",
                title: "Notifications",
                sub: "Manage booking alerts & offers",
              },
              {
                icon: "💳",
                title: "Payment Methods",
                sub: "Saved cards & billing info",
              },
            ].map((item) => (
              <div className="hp-row" key={item.title}>
                <div className="hp-row-left">
                  <div className="hp-row-icon">{item.icon}</div>
                  <div>
                    <div className="hp-row-title">{item.title}</div>
                    <div className="hp-row-sub">{item.sub}</div>
                  </div>
                </div>
                <button className="hp-row-action" onClick={() => navigate("/settings")}>
                  Edit ›
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}