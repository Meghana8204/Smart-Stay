import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AMENITIES = [
  { value: "wifi", label: "WiFi", icon: "📶" },
  { value: "pool", label: "Pool", icon: "🏊" },
  { value: "parking", label: "Parking", icon: "🅿️" },
  { value: "ac", label: "AC", icon: "❄️" },
  { value: "gym", label: "Gym", icon: "💪" },
  { value: "spa", label: "Spa", icon: "🧖" },
  { value: "restaurant", label: "Restaurant", icon: "🍽️" },
  { value: "bar", label: "Bar", icon: "🍸" },
];

const TYPES = [
  { value: "", label: "All Types", icon: "🏨" },
  { value: "Hotel", label: "Hotel", icon: "🏢" },
  { value: "Resort", label: "Resort", icon: "🏖️" },
  { value: "Villa", label: "Villa", icon: "🏡" },
  { value: "Boutique", label: "Boutique", icon: "✨" },
  { value: "Hostel", label: "Hostel", icon: "🛏️" },
  { value: "Eco", label: "Eco Stay", icon: "🌿" },
  { value: "Luxury", label: "Luxury", icon: "💎" },
];

const PRICES = [
  { value: "", label: "Any Price" },
  { value: "low", label: "Price: Low → High" },
  { value: "high", label: "Price: High → Low" },
  { value: "0-1000", label: "Under ₹1,000" },
  { value: "1000-3000", label: "₹1,000 – ₹3,000" },
  { value: "3000-10000", label: "₹3,000 – ₹10,000" },
  { value: "10000+", label: "₹10,000+" },
];

const RATINGS = [
  { value: "", label: "Any Rating" },
  { value: "4.5", label: "4.5+ ⭐" },
  { value: "4", label: "4.0+ ⭐" },
  { value: "3.5", label: "3.5+ ⭐" },
];

function HotelFilter({ onFilter }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getFiltersFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return {
      type: params.get("type") || "",
      price: params.get("price") || "",
      amenities: params.getAll("amenities"),
      rating: params.get("rating") || "",
    };
  };

  const [type, setType] = useState(() => getFiltersFromUrl().type);
  const [price, setPrice] = useState(() => getFiltersFromUrl().price);
  const [amenities, setAmenities] = useState(() => getFiltersFromUrl().amenities);
  const [rating, setRating] = useState(() => getFiltersFromUrl().rating);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const filtersFromUrl = getFiltersFromUrl();
    setType(filtersFromUrl.type);
    setPrice(filtersFromUrl.price);
    setAmenities(filtersFromUrl.amenities);
    setRating(filtersFromUrl.rating);
    onFilter(filtersFromUrl);
  }, [location.search]);

  const activeCount =
    (type ? 1 : 0) +
    (price ? 1 : 0) +
    (rating ? 1 : 0) +
    amenities.length;

  const triggerFilter = (updates) => {
    const newParams = { type, price, amenities, rating, ...updates };
    onFilter(newParams);
    
    const searchParams = new URLSearchParams(location.search);
    if (newParams.type) searchParams.set("type", newParams.type);
    else searchParams.delete("type");
    if (newParams.price) searchParams.set("price", newParams.price);
    else searchParams.delete("price");
    if (newParams.rating) searchParams.set("rating", newParams.rating);
    else searchParams.delete("rating");
    
    searchParams.delete("amenities");
    newParams.amenities.forEach(a => searchParams.append("amenities", a));
    
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  const handleType = (val) => {
    setType(val);
    triggerFilter({ type: val });
  };

  const handlePrice = (e) => {
    const val = e.target.value;
    setPrice(val);
    triggerFilter({ price: val });
  };

  const handleRating = (e) => {
    const val = e.target.value;
    setRating(val);
    triggerFilter({ rating: val });
  };

  const handleAmenity = (val) => {
    const next = amenities.includes(val)
      ? amenities.filter((a) => a !== val)
      : [...amenities, val];
    setAmenities(next);
    triggerFilter({ amenities: next });
  };

  const handleReset = () => {
    setType("");
    setPrice("");
    setRating("");
    setAmenities([]);
    onFilter({ type: "", price: "", amenities: [], rating: "" });
    navigate({ search: "" }, { replace: true });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        .hf-root * {
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
        }

        .hf-root {
          background: #fff;
          border: 0.5px solid #e5e7eb;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .hf-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 0.5px solid #f3f4f6;
          cursor: pointer;
          user-select: none;
          background: #fafafa;
          transition: background 0.15s;
        }
        .hf-header:hover { background: #f3f4f6; }

        .hf-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hf-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }
        .hf-badge {
          background: #1a4a8a;
          color: #fff;
          border-radius: 99px;
          font-size: 11px;
          font-weight: 700;
          padding: 1px 8px;
          line-height: 1.6;
        }
        .hf-chevron {
          font-size: 12px;
          color: #6b7280;
          transition: transform 0.25s ease;
        }
        .hf-chevron.open { transform: rotate(180deg); }

        .hf-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease;
        }
        .hf-body.open { max-height: 600px; }

        .hf-inner {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* ── Section label ── */
        .hf-section-label {
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          letter-spacing: 0.7px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        /* ── Type pills ── */
        .hf-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .hf-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 13px;
          border-radius: 99px;
          border: 0.5px solid #e5e7eb;
          background: transparent;
          font-size: 12.5px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'Poppins', sans-serif;
        }
        .hf-pill:hover {
          border-color: #1a4a8a;
          color: #1a4a8a;
          background: #eef3fb;
        }
        .hf-pill.active {
          background: #1a4a8a;
          border-color: #1a4a8a;
          color: #fff;
        }

        /* ── Selects ── */
        .hf-selects {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .hf-select-wrap {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .hf-select {
          padding: 9px 12px;
          border-radius: 9px;
          border: 0.5px solid #e5e7eb;
          background: #f9fafb;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          color: #374151;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 28px;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .hf-select:focus {
          border-color: #1a4a8a;
          box-shadow: 0 0 0 3px rgba(26,74,138,0.1);
          background-color: #fff;
        }

        /* ── Amenity checkboxes ── */
        .hf-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .hf-amenity {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 0.5px solid #e5e7eb;
          background: transparent;
          font-size: 12.5px;
          font-weight: 500;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'Poppins', sans-serif;
        }
        .hf-amenity:hover {
          border-color: #1a4a8a;
          color: #1a4a8a;
          background: #eef3fb;
        }
        .hf-amenity.active {
          background: #eef3fb;
          border-color: #1a4a8a;
          color: #1a4a8a;
          font-weight: 600;
        }
        .hf-amenity.active .hf-check {
          opacity: 1;
        }
        .hf-check {
          font-size: 11px;
          opacity: 0;
          transition: opacity 0.15s;
        }

        /* ── Footer ── */
        .hf-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 0.5px solid #f3f4f6;
        }
        .hf-active-text {
          font-size: 12px;
          color: #6b7280;
        }
        .hf-reset {
          padding: 7px 16px;
          border-radius: 8px;
          border: 0.5px solid #e5e7eb;
          background: transparent;
          font-family: 'Poppins', sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: #c0392b;
          cursor: pointer;
          transition: background 0.18s;
        }
        .hf-reset:hover { background: #fef5f5; border-color: #c0392b; }
        .hf-reset:disabled { opacity: 0.4; cursor: default; }
        .hf-reset:disabled:hover { background: transparent; border-color: #e5e7eb; }

        @media (max-width: 600px) {
          .hf-selects { grid-template-columns: 1fr; }
          .hf-inner { padding: 14px 14px 16px; }
          .hf-header { padding: 12px 14px; }
        }
      `}</style>

      <div className="hf-root">
        {/* Header toggle */}
        <div
          className="hf-header"
          onClick={() => setExpanded(!expanded)}
          role="button"
          aria-expanded={expanded}
        >
          <div className="hf-header-left">
            <span style={{ fontSize: "16px" }}>🔧</span>
            <span className="hf-title">Filters</span>
            {activeCount > 0 && (
              <span className="hf-badge">{activeCount} active</span>
            )}
          </div>
          <span className={`hf-chevron ${expanded ? "open" : ""}`}>▾</span>
        </div>

        {/* Body */}
        <div className={`hf-body ${expanded ? "open" : ""}`}>
          <div className="hf-inner">

            {/* Type */}
            <div>
              <div className="hf-section-label">Property type</div>
              <div className="hf-pills">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => handleType(t.value)}
                    className={`hf-pill ${type === t.value ? "active" : ""}`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price + Rating selects */}
            <div>
              <div className="hf-section-label">Sort &amp; Budget</div>
              <div className="hf-selects">
                <div className="hf-select-wrap">
                  <select
                    className="hf-select"
                    value={price}
                    onChange={handlePrice}
                    aria-label="Price filter"
                  >
                    {PRICES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div className="hf-select-wrap">
                  <select
                    className="hf-select"
                    value={rating}
                    onChange={handleRating}
                    aria-label="Rating filter"
                  >
                    {RATINGS.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <div className="hf-section-label">Amenities</div>
              <div className="hf-amenities">
                {AMENITIES.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => handleAmenity(a.value)}
                    className={`hf-amenity ${amenities.includes(a.value) ? "active" : ""}`}
                  >
                    {a.icon} {a.label}
                    <span className="hf-check">✓</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="hf-footer">
              <span className="hf-active-text">
                {activeCount === 0
                  ? "No filters applied"
                  : `${activeCount} filter${activeCount > 1 ? "s" : ""} applied`}
              </span>
              <button
                className="hf-reset"
                onClick={handleReset}
                disabled={activeCount === 0}
              >
                Reset all
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default HotelFilter;