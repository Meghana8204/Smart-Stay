import { Link } from "react-router-dom";
import { useState } from "react";

function HotelCard({ hotel }) {
  const [wished, setWished] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fallback =
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop";

  const stars = hotel.stars || hotel.rating || 4;
  const reviewCount = hotel.reviewCount || 128;
  const discount = hotel.discount || null;
  const originalPrice = discount
    ? Math.round(hotel.pricePerNight / (1 - discount / 100))
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .hotel-card * {
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
        }

        .hotel-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 0.5px solid #e5e7eb;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .hotel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .hotel-card .img-wrap {
          position: relative;
          overflow: hidden;
          height: 220px;
          flex-shrink: 0;
        }

        .hotel-card .img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .hotel-card:hover .img-wrap img {
          transform: scale(1.06);
        }

        .hotel-card .wish-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: transform 0.2s, background 0.2s;
          backdrop-filter: blur(4px);
          z-index: 2;
        }

        .hotel-card .wish-btn:hover {
          transform: scale(1.15);
          background: #fff;
        }

        .hotel-card .type-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(15, 45, 82, 0.85);
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          letter-spacing: 0.3px;
          backdrop-filter: blur(4px);
        }

        .hotel-card .discount-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          background: #c0392b;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 9px;
          border-radius: 6px;
        }

        .hotel-card .body {
          padding: 16px 18px 18px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .hotel-card .name-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 4px;
        }

        .hotel-card .hotel-name {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          line-height: 1.3;
          margin: 0;
        }

        .hotel-card .stars {
          display: flex;
          gap: 1px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .hotel-card .star {
          font-size: 12px;
        }

        .hotel-card .location {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6b7280;
          font-size: 12.5px;
          margin-bottom: 8px;
        }

        .hotel-card .location span {
          font-size: 13px;
        }

        .hotel-card .desc {
          font-size: 12.5px;
          color: #9ca3af;
          line-height: 1.6;
          flex: 1;
          margin-bottom: 14px;
        }

        .hotel-card .amenities {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .hotel-card .amenity-tag {
          display: flex;
          align-items: center;
          gap: 3px;
          background: #f3f4f6;
          color: #4b5563;
          font-size: 11px;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 5px;
        }

        .hotel-card .amenity-tag span {
          font-size: 12px;
        }

        .hotel-card .divider {
          height: 0.5px;
          background: #f3f4f6;
          margin-bottom: 14px;
        }

        .hotel-card .footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .hotel-card .price-block {}

        .hotel-card .price-original {
          font-size: 11px;
          color: #9ca3af;
          text-decoration: line-through;
          display: block;
          line-height: 1;
          margin-bottom: 2px;
        }

        .hotel-card .price-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .hotel-card .price-amount {
          font-size: 20px;
          font-weight: 700;
          color: #1a4a8a;
        }

        .hotel-card .price-night {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 400;
        }

        .hotel-card .rating-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          background: #eef3fb;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 600;
          color: #1a4a8a;
        }

        .hotel-card .view-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #1a4a8a;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 600;
          padding: 9px 18px;
          border-radius: 9px;
          text-decoration: none;
          transition: background 0.18s, transform 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .hotel-card .view-btn:hover {
          background: #0f2d52;
          transform: scale(1.03);
        }

        .hotel-card .view-btn span {
          font-size: 14px;
          transition: transform 0.2s;
        }

        .hotel-card .view-btn:hover span {
          transform: translateX(3px);
        }
      `}</style>

      <div className="hotel-card">
        {/* Image */}
        <div className="img-wrap">
          <img
            src={imgError ? fallback : hotel?.images?.[0] || fallback}
            alt={hotel.hotelName}
            onError={() => setImgError(true)}
            loading="lazy"
          />

          {/* Wishlist button */}
          <button
            className="wish-btn"
            onClick={() => setWished(!wished)}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wished ? "❤️" : "🤍"}
          </button>

          {/* Type badge */}
          {(hotel.type || "Hotel") && (
            <div className="type-badge">{hotel.type || "Hotel"}</div>
          )}

          {/* Discount badge */}
          {discount && (
            <div className="discount-badge">{discount}% OFF</div>
          )}
        </div>

        {/* Body */}
        <div className="body">
          {/* Name + Stars */}
          <div className="name-row">
            <h2 className="hotel-name">{hotel.hotelName}</h2>
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="star">
                  {i < stars ? "⭐" : "☆"}
                </span>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="location">
            <span>📍</span>
            {hotel.location}
          </div>

          {/* Description */}
          <p className="desc">
            {hotel.description?.slice(0, 90) || "Experience comfort and luxury at its finest."}
            {hotel.description?.length > 90 ? "…" : ""}
          </p>

          {/* Amenity tags */}
          {(hotel.amenities?.length > 0) && (
            <div className="amenities">
              {(hotel.amenities.slice(0, 4)).map((a) => (
                <div key={a} className="amenity-tag">
                  <span>
                    {a === "WiFi" ? "📶"
                      : a === "Pool" ? "🏊"
                      : a === "Gym" ? "💪"
                      : a === "Spa" ? "🧖"
                      : a === "Parking" ? "🅿️"
                      : a === "Restaurant" ? "🍽️"
                      : "✓"}
                  </span>
                  {a}
                </div>
              ))}
            </div>
          )}

          <div className="divider" />

          {/* Footer */}
          <div className="footer">
            <div>
              <div className="price-block">
                {originalPrice && (
                  <span className="price-original">₹{originalPrice.toLocaleString()}</span>
                )}
                <div className="price-row">
                  <span className="price-amount">₹{Number(hotel.pricePerNight).toLocaleString()}</span>
                  <span className="price-night">/ night</span>
                </div>
              </div>
              <div className="rating-pill" style={{ marginTop: "6px", display: "inline-flex" }}>
                ⭐ {hotel.averageRating?.toFixed(1) || "4.5"}
                <span style={{ fontWeight: 400, color: "#6b7280", marginLeft: "2px" }}>
                  ({reviewCount})
                </span>
              </div>
            </div>

            <Link to={`/hotel/${hotel._id}`} className="view-btn">
              View Details <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default HotelCard;