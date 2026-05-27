import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getWishlist, removeWishlist } from "../services/wishlistService";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop";

export default function Wishlist() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist(user.token);
      setWishlist(data.wishlist);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user?.token) fetchWishlist();
  }, [user?.token]);

  const handleRemove = async (id) => {
    try {
      setRemovingId(id);
      await removeWishlist(id, user.token);
      setWishlist((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        .wl-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 4rem;
          font-family: 'Poppins', sans-serif;
          background: #f7f4ef;
          min-height: 100vh;
        }

        /* ── Header ── */
        .wl-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .wl-eyebrow {
          font-size: 11px;
          font-weight: 600;
          color: #c49b4f;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .wl-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 600;
          color: #1a1208;
          line-height: 1.1;
        }

        .wl-count-badge {
          background: #1a1208;
          color: #c49b4f;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 16px;
          border-radius: 30px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        /* ── Grid ── */
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* ── Card ── */
        .wl-card {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #ece8e0;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .wl-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(26, 18, 8, 0.1);
        }

        /* Image */
        .wl-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .wl-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .wl-card:hover .wl-img { transform: scale(1.06); }

        .wl-tag {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(26, 18, 8, 0.75);
          color: #c49b4f;
          font-size: 10px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 1px;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
        }

        .wl-heart-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          background: rgba(255, 255, 255, 0.92);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #e05a5a;
        }

        /* Body */
        .wl-body {
          padding: 1.25rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .wl-hotel-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a1208;
          margin-bottom: 4px;
        }

        .wl-location {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12.5px;
          color: #999;
          margin-bottom: auto;
        }
        .wl-location-dot {
          width: 5px;
          height: 5px;
          background: #c49b4f;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .wl-price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin: 1rem 0 1.25rem;
        }
        .wl-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a1208;
        }
        .wl-price-unit {
          font-size: 11px;
          color: #bbb;
          font-weight: 400;
        }
        .wl-price.unavail {
          font-size: 13px;
          font-family: 'Poppins', sans-serif;
          color: #bbb;
          font-weight: 500;
        }

        /* Actions */
        .wl-actions { display: flex; gap: 10px; }

        .wl-view-btn {
          flex: 1;
          background: #1a1208;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 10px 0;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .wl-view-btn:hover { background: #2d2415; }

        .wl-remove-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #fdf2f2;
          border: 1px solid #fecaca;
          color: #c0392b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.15s;
        }
        .wl-remove-btn:hover:not(:disabled) {
          background: #fee2e2;
          transform: scale(1.08);
        }
        .wl-remove-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .wl-unavail-btn {
          flex: 1;
          background: #f5f5f3;
          color: #bbb;
          border: 1px solid #e8e4dc;
          border-radius: 10px;
          padding: 10px 0;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          cursor: not-allowed;
          text-align: center;
        }

        /* ── Empty state ── */
        .wl-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 5rem 1rem;
        }
        .wl-empty-icon {
          font-size: 3.5rem;
          margin-bottom: 1.25rem;
          opacity: 0.25;
        }
        .wl-empty-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #1a1208;
          margin-bottom: 0.5rem;
        }
        .wl-empty-sub {
          font-size: 13px;
          color: #bbb;
          margin-bottom: 1.5rem;
        }
        .wl-browse-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1a1208;
          color: #c49b4f;
          text-decoration: none;
          padding: 10px 24px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          transition: background 0.2s;
        }
        .wl-browse-btn:hover { background: #2d2415; }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .wl-title { font-size: 1.7rem; }
          .wl-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="wl-page">

        {/* Header */}
        <div className="wl-header">
          <div>
            <div className="wl-eyebrow">✦ My Collection</div>
            <h1 className="wl-title">Dream Stays</h1>
          </div>
          <div className="wl-count-badge">
            ♡ {wishlist.length} saved {wishlist.length === 1 ? "hotel" : "hotels"}
          </div>
        </div>

        {/* Grid */}
        <div className="wl-grid">
          {wishlist.length === 0 ? (
            <div className="wl-empty">
              <div className="wl-empty-icon">♡</div>
              <div className="wl-empty-title">Your wishlist is empty</div>
              <p className="wl-empty-sub">
                Save hotels you love and revisit them anytime.
              </p>
              <Link to="/hotels" className="wl-browse-btn">
                ✦ Browse Hotels
              </Link>
            </div>
          ) : (
            wishlist.map((item) => (
              <div key={item._id} className="wl-card">

                {/* Image */}
                <div className="wl-img-wrap">
                  <img
                    src={item.hotel?.images?.[0] || FALLBACK_IMAGE}
                    alt={item.hotel?.hotelName || "Hotel"}
                    className="wl-img"
                    loading="lazy"
                  />
                  {item.hotel?.category && (
                    <div className="wl-tag">{item.hotel.category}</div>
                  )}
                  <div className="wl-heart-overlay">♥</div>
                </div>

                {/* Body */}
                <div className="wl-body">
                  <div className="wl-hotel-name">
                    {item.hotel?.hotelName || "Hotel Unavailable"}
                  </div>

                  {item.hotel?.location && (
                    <div className="wl-location">
                      <div className="wl-location-dot" />
                      {item.hotel.location}
                    </div>
                  )}

                  <div className="wl-price-row">
                    {item.hotel?.pricePerNight ? (
                      <>
                        <span className="wl-price">
                          ${item.hotel.pricePerNight}
                        </span>
                        <span className="wl-price-unit">/ night</span>
                      </>
                    ) : (
                      <span className="wl-price unavail">
                        Price unavailable
                      </span>
                    )}
                  </div>

                  <div className="wl-actions">
                    {item.hotel ? (
                      <Link
                        to={`/hotel/${item.hotel._id}`}
                        className="wl-view-btn"
                      >
                        → View Hotel
                      </Link>
                    ) : (
                      <span className="wl-unavail-btn">Not Available</span>
                    )}

                    <button
                      className="wl-remove-btn"
                      onClick={() => handleRemove(item._id)}
                      disabled={removingId === item._id}
                      title="Remove from wishlist"
                      aria-label={`Remove ${item.hotel?.hotelName || "hotel"} from wishlist`}
                    >
                      {removingId === item._id ? "…" : "✕"}
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}