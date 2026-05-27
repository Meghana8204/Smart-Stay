import { Link, useNavigate } from "react-router-dom";

const QUICK_LINKS = [
  { to: "/my-bookings", icon: "📅", label: "My Bookings", sub: "View reservations" },
  { to: "/wishlist",    icon: "♡",  label: "Wishlist",    sub: "Saved hotels"    },
  { to: "/profile",     icon: "👤", label: "Profile",     sub: "Your account"    },
  { to: "/hotels",      icon: "🏨", label: "Hotels",      sub: "Browse all"      },
];

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        /* Escape any parent layout — own the full viewport */
        .nf-root {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          font-family: 'Poppins', sans-serif;
          overflow: hidden;
        }

        /* ── Left panel ── */
        .nf-left {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .nf-left-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80')
            center / cover no-repeat;
          filter: brightness(0.3);
          transform: scale(1);
          transition: transform 10s ease;
        }
        .nf-left:hover .nf-left-bg { transform: scale(1.05); }

        .nf-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(10, 8, 5, 0.1) 0%,
            rgba(10, 8, 5, 0.82) 100%
          );
        }

        .nf-left-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 2rem;
        }

        .nf-big-num {
          font-family: 'Playfair Display', serif;
          font-size: clamp(6rem, 14vw, 10rem);
          font-weight: 600;
          color: rgba(196, 155, 79, 0.18);
          line-height: 1;
          letter-spacing: -4px;
          user-select: none;
          margin-bottom: -1rem;
        }

        .nf-key-icon {
          width: 70px;
          height: 70px;
          background: rgba(196, 155, 79, 0.12);
          border: 1px solid rgba(196, 155, 79, 0.3);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 30px;
          margin: 0 auto 1.5rem;
        }

        .nf-left-tagline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.3rem, 2.8vw, 1.9rem);
          color: #fff;
          line-height: 1.25;
          max-width: 340px;
          margin: 0 auto 0.75rem;
        }
        .nf-left-tagline em {
          font-style: italic;
          color: #c9a96e;
        }

        .nf-left-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 300;
          line-height: 1.8;
          max-width: 300px;
          margin: 0 auto;
        }

        /* ── Right panel ── */
        .nf-right {
          width: 440px;
          min-width: 0;
          background: #f7f4ef;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem 2.5rem;
          overflow-y: auto;
        }

        .nf-card { width: 100%; max-width: 360px; }

        .nf-eyebrow {
          font-size: 11px;
          font-weight: 600;
          color: #c49b4f;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-align: center;
          margin-bottom: 0.75rem;
        }

        .nf-divider {
          width: 36px;
          height: 2px;
          background: #c49b4f;
          border-radius: 2px;
          margin: 0 auto 1.5rem;
        }

        .nf-heading {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: #1a1208;
          text-align: center;
          line-height: 1.2;
          margin-bottom: 0.6rem;
        }

        .nf-sub {
          font-size: 13px;
          color: #aaa;
          text-align: center;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        /* Buttons */
        .nf-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 1.5rem;
        }

        .nf-btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #1a1208;
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 13px 0;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .nf-btn-primary:hover {
          background: #2d2415;
          transform: translateY(-1px);
        }

        .nf-btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: transparent;
          color: #1a1208;
          border: 1.5px solid #e0dbd0;
          border-radius: 12px;
          padding: 12px 0;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .nf-btn-secondary:hover {
          border-color: #c49b4f;
          color: #c49b4f;
        }

        /* Quick links grid */
        .nf-quick {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .nf-quick-item {
          background: #fff;
          border: 1px solid #ece8e0;
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.2s, transform 0.15s;
        }
        .nf-quick-item:hover {
          border-color: #c49b4f;
          transform: translateY(-2px);
        }

        .nf-quick-icon {
          width: 32px;
          height: 32px;
          background: #f7f4ef;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        .nf-quick-label {
          font-size: 12px;
          font-weight: 500;
          color: #1a1208;
        }
        .nf-quick-sub {
          font-size: 10.5px;
          color: #bbb;
          margin-top: 1px;
        }

        /* ── Responsive ── */
        @media (max-width: 820px) {
          .nf-root { flex-direction: column; }
          .nf-left { flex: none; min-height: 40vh; }
          .nf-right { width: 100%; min-width: 0; padding: 2.5rem 1.5rem 3rem; }
        }

        @media (max-width: 480px) {
          .nf-left { display: none; }
          .nf-right {
            justify-content: flex-start;
            padding-top: 3.5rem;
          }
        }
      `}</style>

      <div className="nf-root">

        {/* ── Left panel ── */}
        <div className="nf-left">
          <div className="nf-left-bg" />
          <div className="nf-left-overlay" />
          <div className="nf-left-content">
            <div className="nf-big-num">404</div>
            <div className="nf-key-icon">🗝</div>
            <div className="nf-left-tagline">
              This room doesn't <em>exist</em> in our hotel.
            </div>
            <p className="nf-left-sub">
              Looks like you've wandered down a hallway that leads nowhere.
              Let us escort you back.
            </p>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="nf-right">
          <div className="nf-card">

            <div className="nf-eyebrow">✦ Lost & Found</div>
            <div className="nf-divider" />

            <h1 className="nf-heading">Page Not Found</h1>
            <p className="nf-sub">
              The page you're looking for has checked out or never existed.
              Let's get you somewhere familiar.
            </p>

            <div className="nf-links">
              <button
                className="nf-btn-primary"
                onClick={() => navigate(-1)}
              >
                ← Go Back
              </button>
              <Link to="/" className="nf-btn-secondary">
                Back to Lobby
              </Link>
            </div>

            <div className="nf-quick">
              {QUICK_LINKS.map(({ to, icon, label, sub }) => (
                <Link key={to} to={to} className="nf-quick-item">
                  <div className="nf-quick-icon">{icon}</div>
                  <div>
                    <div className="nf-quick-label">{label}</div>
                    <div className="nf-quick-sub">{sub}</div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </div>

      </div>
    </>
  );
}