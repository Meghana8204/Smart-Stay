import { Link } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/hotels", label: "Browse Hotels", icon: "🏨" },
  { to: "/my-bookings", label: "My Bookings", icon: "📅" },
  { to: "/wishlist", label: "Wishlist", icon: "♡" },
  { to: "/profile", label: "My Profile", icon: "👤" },
];

const COMPANY_LINKS = ["About Us", "Careers", "Press", "Blog", "Partners"];

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        .sf-footer {
          background: #12100d;
          font-family: 'Poppins', sans-serif;
          padding: 4rem 1.5rem 0;
          margin-top: 3rem;
        }

        .sf-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        .sf-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1fr;
          gap: 3rem;
        }

        /* Brand */
        .sf-brand-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(196,155,79,0.12);
          border: 1px solid rgba(196,155,79,0.25);
          border-radius: 30px;
          padding: 3px 12px;
          font-size: 10px;
          font-weight: 500;
          color: #c49b4f;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }

        .sf-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 1.25rem;
          text-decoration: none;
        }

        .sf-logo-icon {
          width: 42px;
          height: 42px;
          background: rgba(196,155,79,0.15);
          border: 1px solid rgba(196,155,79,0.3);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c49b4f;
          font-size: 20px;
        }

        .sf-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.5px;
        }

        .sf-logo-text span { color: #c49b4f; }

        .sf-desc {
          font-size: 13px;
          line-height: 1.8;
          color: rgba(255,255,255,0.4);
          max-width: 280px;
          margin-bottom: 1.75rem;
        }

        /* Socials */
        .sf-socials { display: flex; gap: 10px; }

        .sf-soc {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.45);
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sf-soc:hover { border-color: rgba(196,155,79,0.5); color: #c49b4f; }

        /* Newsletter */
        .sf-newsletter { margin-top: 1.5rem; }

        .sf-nl-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.3);
          letter-spacing: 1.4px;
          text-transform: uppercase;
          margin-bottom: 0.65rem;
        }

        .sf-nl-form { display: flex; max-width: 280px; }

        .sf-nl-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-right: none;
          border-radius: 8px 0 0 8px;
          padding: 0 12px;
          height: 36px;
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          color: #fff;
          outline: none;
        }
        .sf-nl-input::placeholder { color: rgba(255,255,255,0.25); }
        .sf-nl-input:focus { border-color: rgba(196,155,79,0.4); }

        .sf-nl-btn {
          background: #c49b4f;
          border: none;
          border-radius: 0 8px 8px 0;
          padding: 0 14px;
          height: 36px;
          color: #12100d;
          font-family: 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .sf-nl-btn:hover { background: #e8c97a; }

        /* Columns */
        .sf-col-title {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          letter-spacing: 1.8px;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }

        .sf-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .sf-links li a {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s;
        }
        .sf-links li a:hover { color: #c49b4f; }

        /* Contact */
        .sf-contact { display: flex; flex-direction: column; gap: 1rem; }

        .sf-contact-item { display: flex; align-items: flex-start; gap: 10px; }

        .sf-contact-icon {
          width: 30px;
          height: 30px;
          border-radius: 7px;
          background: rgba(196,155,79,0.1);
          border: 1px solid rgba(196,155,79,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c49b4f;
          font-size: 13px;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .sf-contact-text {
          font-size: 12.5px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
        }
        .sf-contact-text a { color: rgba(255,255,255,0.45); text-decoration: none; }
        .sf-contact-text a:hover { color: #c49b4f; }

        /* Bottom bar */
        .sf-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 3rem 0 0;
        }

        .sf-bottom {
          max-width: 1100px;
          margin: 0 auto;
          padding: 1.25rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .sf-copy { font-size: 11.5px; color: rgba(255,255,255,0.25); }
        .sf-copy span { color: rgba(196,155,79,0.7); }

        .sf-bottom-links { display: flex; gap: 1.25rem; }

        .sf-bottom-links a {
          font-size: 11.5px;
          color: rgba(255,255,255,0.25);
          text-decoration: none;
          transition: color 0.2s;
        }
        .sf-bottom-links a:hover { color: rgba(196,155,79,0.7); }

        /* Responsive */
        @media (max-width: 900px) {
          .sf-grid { grid-template-columns: 1.5fr 1fr 1fr; }
          .sf-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 600px) {
          .sf-grid { grid-template-columns: 1fr 1fr; }
          .sf-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 380px) {
          .sf-grid { grid-template-columns: 1fr; }
          .sf-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="sf-footer">
        <div className="sf-inner">
          <div className="sf-grid">

            {/* Brand */}
            <div className="sf-brand">
              <div className="sf-brand-tag">★ Luxury Travel</div>

              <Link to="/" className="sf-logo">
                <div className="sf-logo-icon">🏨</div>
                <div className="sf-logo-text">
                  Smart<span>Stay</span>
                </div>
              </Link>

              <p className="sf-desc">
                Handpicked luxury hotels, private resorts, and boutique hideaways
                curated by our travel experts — at prices that never compromise.
              </p>

              <div className="sf-socials">
                {["Instagram", "Twitter/X", "Facebook", "LinkedIn"].map((s) => (
                  <div className="sf-soc" key={s} title={s}>
                    {s === "Instagram" ? "📸" : s === "Twitter/X" ? "𝕏" : s === "Facebook" ? "f" : "in"}
                  </div>
                ))}
              </div>

              <div className="sf-newsletter">
                <div className="sf-nl-label">Exclusive Offers</div>
                <div className="sf-nl-form">
                  <input
                    className="sf-nl-input"
                    type="email"
                    placeholder="Your email address"
                  />
                  <button className="sf-nl-btn">Subscribe</button>
                </div>
              </div>
            </div>

            {/* Navigate */}
            <div>
              <div className="sf-col-title">Navigate</div>
              <ul className="sf-links">
                {NAV_LINKS.map(({ to, label, icon }) => (
                  <li key={to}>
                    <Link to={to}>
                      <span>{icon}</span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <div className="sf-col-title">Company</div>
              <ul className="sf-links">
                {COMPANY_LINKS.map((label) => (
                  <li key={label}>
                    <Link to="#">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="sf-col-title">Contact</div>
              <div className="sf-contact">
                <div className="sf-contact-item">
                  <div className="sf-contact-icon">📍</div>
                  <div className="sf-contact-text">
                    123 Luxury Avenue,<br />New York, NY 10001
                  </div>
                </div>
                <div className="sf-contact-item">
                  <div className="sf-contact-icon">📞</div>
                  <div className="sf-contact-text">+1 800 SMARTSTAY</div>
                </div>
                <div className="sf-contact-item">
                  <div className="sf-contact-icon">✉</div>
                  <div className="sf-contact-text">
                    <a href="mailto:support@smartstay.com">
                      support@smartstay.com
                    </a>
                  </div>
                </div>
                <div className="sf-contact-item">
                  <div className="sf-contact-icon">🕐</div>
                  <div className="sf-contact-text">Mon – Fri, 9am – 6pm EST</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <hr className="sf-divider" />

        <div className="sf-bottom">
          <div className="sf-copy">
            &copy; {new Date().getFullYear()} <span>SmartStay</span>. All rights reserved.
          </div>
          <div className="sf-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}