import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMyBookings, downloadBill } from "../services/bookingService";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  Confirmed: { bg: "#e8f5e9", color: "#2e7d32", dot: "#43a047", label: "Confirmed" },
  Pending:   { bg: "#fff8e1", color: "#f57f17", dot: "#ffb300", label: "Pending"   },
  Cancelled: { bg: "#fce4ec", color: "#c62828", dot: "#e53935", label: "Cancelled" },
};

const fmt = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

function Bookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getMyBookings(user.token);
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchBookings();
    }
  }, [user]);

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const handleDownloadInvoice = async (bookingId) => {
    try {
      const blob = await downloadBill(bookingId, user.token);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Failed to download bill:", err);
      toast.error("Failed to download bill");
    }
  };

  const filters = ["All", "Confirmed", "Pending", "Cancelled"];
  const filtered =
    filter === "All" ? bookings : bookings.filter((b) => b.bookingStatus === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bk-root {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          background: #f5f2ed;
          padding-bottom: 4rem;
        }

        /* ── HERO BANNER ── */
        .bk-hero {
          position: relative;
          height: 240px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          padding: 2.5rem 3rem;
        }

        .bk-hero-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=80') center/cover no-repeat;
          filter: brightness(0.35);
          transform: scale(1.05);
        }

        .bk-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(10,8,6,0.7) 0%, rgba(10,8,6,0.2) 100%);
        }

        .bk-hero-content {
          position: relative;
          z-index: 2;
        }

        .bk-hero-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.6rem;
        }

        .bk-hero-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #c9a96e;
        }

        .bk-hero-eyebrow span {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c9a96e;
        }

        .bk-hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          color: #fff;
          font-weight: 600;
          line-height: 1.1;
        }

        .bk-hero p {
          color: rgba(255,255,255,0.55);
          font-size: 0.82rem;
          margin-top: 0.4rem;
          font-weight: 300;
        }

        /* ── BODY ── */
        .bk-body {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── STATS ROW ── */
        .bk-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: -2.5rem;
          margin-bottom: 2rem;
          position: relative;
          z-index: 10;
        }

        .stat-card {
          background: #fff;
          border-radius: 16px;
          padding: 1.2rem 1.4rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border-top: 3px solid transparent;
          transition: transform 0.2s;
        }

        .stat-card:nth-child(1) { border-top-color: #c9a96e; }
        .stat-card:nth-child(2) { border-top-color: #43a047; }
        .stat-card:nth-child(3) { border-top-color: #ffb300; }

        .stat-card:hover { transform: translateY(-2px); }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.72rem;
          color: #aaa;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* ── FILTER TABS ── */
        .bk-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.8rem;
          align-items: center;
        }

        .bk-filters-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: #bbb;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-right: 0.3rem;
        }

        .filter-btn {
          padding: 0.45rem 1.1rem;
          border-radius: 100px;
          border: 1.5px solid #e0dbd0;
          background: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.76rem;
          font-weight: 600;
          color: #999;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }

        .filter-btn:hover { border-color: #c9a96e; color: #c9a96e; }

        .filter-btn.active {
          background: linear-gradient(135deg, #c9a96e, #a07840);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 3px 12px rgba(201,169,110,0.35);
        }

        /* ── BOOKING CARD ── */
        .booking-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          margin-bottom: 1.2rem;
          overflow: hidden;
          transition: box-shadow 0.25s, transform 0.2s;
          animation: cardIn 0.4s ease both;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .booking-card:hover {
          box-shadow: 0 6px 30px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }

        .card-main {
          display: flex;
          align-items: stretch;
          gap: 0;
        }

        /* Gold side accent */
        .card-accent {
          width: 5px;
          flex-shrink: 0;
          background: linear-gradient(180deg, #c9a96e, #a07840);
          border-radius: 0 0 0 0;
        }

        .card-body {
          flex: 1;
          padding: 1.5rem 1.8rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        /* Hotel icon / thumb */
        .card-icon {
          width: 54px; height: 54px;
          border-radius: 14px;
          background: linear-gradient(135deg, #f5ede0, #ede0c8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(201,169,110,0.15);
        }

        .card-info { flex: 1; min-width: 180px; }

        .card-hotel {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.15rem;
        }

        .card-location {
          font-size: 0.78rem;
          color: #aaa;
          font-weight: 400;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .card-meta {
          display: grid;
          grid-template-columns: repeat(2, auto);
          gap: 0.4rem 2rem;
          align-items: center;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
        }

        .meta-key {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #ccc;
          margin-bottom: 0.1rem;
        }

        .meta-val {
          font-size: 0.82rem;
          font-weight: 600;
          color: #333;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.75rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 600;
        }

        .status-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          animation: pulseDot 2s infinite;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .card-price {
          text-align: right;
          flex-shrink: 0;
        }

        .price-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #ccc;
          font-weight: 600;
        }

        .price-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.1;
        }

        .price-nights {
          font-size: 0.7rem;
          color: #bbb;
          font-weight: 400;
        }

        /* Actions */
        .card-actions {
          padding: 0 1.8rem 1.4rem 1.8rem;
          display: flex;
          gap: 0.7rem;
          flex-wrap: wrap;
          padding-left: calc(1.8rem + 5px);
        }

        .btn-invoice {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.2rem;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 3px 12px rgba(201,169,110,0.35);
          letter-spacing: 0.02em;
        }

        .btn-invoice:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 5px 18px rgba(201,169,110,0.45);
        }

        .btn-detail {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.2rem;
          background: #f5f2ed;
          color: #666;
          border: 1.5px solid #e8e2d8;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }

        .btn-detail:hover { background: #ece8e0; border-color: #d4ccbe; color: #444; }

        /* Expanded panel */
        .card-expanded {
          border-top: 1px dashed #ede8de;
          margin: 0 1.8rem 1.4rem;
          padding-top: 1.2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .expanded-item {
          background: #faf8f4;
          border-radius: 12px;
          padding: 0.9rem 1rem;
          border: 1px solid #ede8de;
        }

        .expanded-key {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.09em;
          color: #bbb;
          font-weight: 600;
          margin-bottom: 0.3rem;
        }

        .expanded-val {
          font-size: 0.88rem;
          font-weight: 600;
          color: #333;
        }

        /* ── EMPTY STATE ── */
        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }

        .empty-icon {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          display: block;
          opacity: 0.4;
        }

        .empty-state h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          font-size: 0.85rem;
          color: #bbb;
          font-weight: 300;
        }

        /* ── LOADING ── */
        .loading-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          gap: 1.2rem;
        }

        .loading-spinner {
          width: 42px; height: 42px;
          border: 3px solid #ede8de;
          border-top-color: #c9a96e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .loading-text {
          font-size: 0.82rem;
          color: #bbb;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 700px) {
          .bk-hero { padding: 1.5rem; height: 200px; }
          .bk-stats { grid-template-columns: repeat(3, 1fr); gap: 0.6rem; }
          .stat-card { padding: 0.9rem 0.8rem; }
          .stat-value { font-size: 1.4rem; }
          .card-body { padding: 1.2rem 1rem; gap: 1rem; }
          .card-actions { padding: 0 1rem 1.2rem; }
          .card-meta { grid-template-columns: 1fr 1fr; gap: 0.4rem 1rem; }
          .card-price { display: none; }
        }

        @media (max-width: 480px) {
          .bk-hero { height: 180px; }
          .bk-stats { grid-template-columns: 1fr 1fr; }
          .bk-stats .stat-card:last-child { grid-column: span 2; }
          .card-body { flex-direction: column; align-items: flex-start; gap: 0.8rem; }
          .bk-body { padding: 0 1rem; }
        }
      `}</style>

      <div className="bk-root">
        {/* HERO */}
        <div className="bk-hero">
          <div className="bk-hero-bg" />
          <div className="bk-hero-overlay" />
          <div className="bk-hero-content">
            <div className="bk-hero-eyebrow">
              <div className="bk-hero-dot" />
              <span>GrandStay Portal</span>
            </div>
            <h1>My Reservations</h1>
            <p>Manage all your upcoming and past hotel stays in one place</p>
          </div>
        </div>

        <div className="bk-body">
          {loading ? (
            <div className="loading-wrap">
              <div className="loading-spinner" />
              <div className="loading-text">Fetching your reservations…</div>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "#c62828", fontWeight: 500 }}>
              ⚠ {error}
            </div>
          ) : (
            <>
              {/* STATS */}
              <div className="bk-stats">
                <div className="stat-card">
                  <div className="stat-value">{bookings.length}</div>
                  <div className="stat-label">Total Bookings</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{bookings.filter(b => b.bookingStatus === "Confirmed").length}</div>
                  <div className="stat-label">Confirmed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{bookings.filter(b => b.bookingStatus === "Pending").length}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>

              {/* FILTERS */}
              <div className="bk-filters">
                <span className="bk-filters-label">Filter:</span>
                {filters.map((f) => (
                  <button
                    key={f}
                    className={`filter-btn ${filter === f ? "active" : ""}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* CARDS */}
              {filtered.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🏨</span>
                  <h3>No reservations found</h3>
                  <p>Try a different filter or start planning your next luxury stay.</p>
                </div>
              ) : (
                filtered.map((booking, i) => {
                  const status = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG["Pending"];
                  const isExpanded = expandedId === booking._id;
                  const nights = calculateNights(booking.checkInDate, booking.checkOutDate);
                  return (
                    <div
                      key={booking._id}
                      className="booking-card"
                      style={{ animationDelay: `${i * 0.07}s` }}
                    >
                      <div className="card-main">
                        <div className="card-accent" />
                        <div className="card-body">
                          <div className="card-icon">🏨</div>

                          <div className="card-info">
                            <div className="card-hotel">{booking.hotel?.hotelName || "Hotel"}</div>
                            <div className="card-location">
                              <span>📍</span> {booking.hotel?.location}
                            </div>
                          </div>

                          <div className="card-meta">
                            <div className="meta-item">
                              <span className="meta-key">Check-in</span>
                              <span className="meta-val">{fmt(booking.checkInDate)}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-key">Check-out</span>
                              <span className="meta-val">{fmt(booking.checkOutDate)}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-key">Room</span>
                              <span className="meta-val">{booking.room?.roomType}</span>
                            </div>
                            <div className="meta-item">
                              <span className="meta-key">Status</span>
                              <span
                                className="status-badge"
                                style={{ background: status.bg, color: status.color }}
                              >
                                <span
                                  className="status-dot"
                                  style={{ background: status.dot }}
                                />
                                {status.label}
                              </span>
                            </div>
                          </div>

                          <div className="card-price">
                            <div className="price-label">Total</div>
                            <div className="price-value">₹{booking.totalPrice?.toLocaleString("en-IN")}</div>
                            <div className="price-nights">{nights} nights</div>
                          </div>
                        </div>
                      </div>

                      {/* EXPANDED */}
                      {isExpanded && (
                        <div className="card-expanded">
                          <div className="expanded-item">
                            <div className="expanded-key">Booking ID</div>
                            <div className="expanded-val" style={{ fontSize: "0.75rem", fontFamily: "monospace" }}>#{booking._id}</div>
                          </div>
                          <div className="expanded-item">
                            <div className="expanded-key">Room No.</div>
                            <div className="expanded-val">{booking.room?.roomNumber}</div>
                          </div>
                          <div className="expanded-item">
                            <div className="expanded-key">Duration</div>
                            <div className="expanded-val">{nights} Night{nights > 1 ? "s" : ""}</div>
                          </div>
                          <div className="expanded-item">
                            <div className="expanded-key">Per Night</div>
                            <div className="expanded-val">₹{Math.round(booking.totalPrice / nights).toLocaleString("en-IN")}</div>
                          </div>
                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="card-actions">
                        <button
                          className="btn-invoice"
                          onClick={() => handleDownloadInvoice(booking._id)}
                        >
                          ⬇ Download Invoice
                        </button>
                        <button
                          className="btn-detail"
                          onClick={() => setExpandedId(isExpanded ? null : booking._id)}
                        >
                          {isExpanded ? "▲ Hide Details" : "▼ View Details"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Bookings;