import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getHotels, searchHotels } from "../services/hotelService";

const AMENITY_OPTIONS = ["WiFi", "Pool", "Spa", "Gym", "AC", "Fine Dining", "Concierge"];
const TYPE_OPTIONS = ["All", "Luxury", "Resort", "Villa", "Boutique", "Hostel", "Eco", "Hotel"];
const PRICE_OPTIONS = [
  { label: "Any Price", value: "" },
  { label: "Under ₹10k", value: "0-10000" },
  { label: "₹10k – ₹20k", value: "10000-20000" },
  { label: "₹20k+", value: "20000+" },
  { label: "Price: Low → High", value: "low" },
  { label: "Price: High → Low", value: "high" },
];
// ─────────────────────────────────────────────────────────────────────────────

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [originalHotels, setOriginalHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({ type: "All", price: "", amenities: [] });
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState("Any Price");
  const [view, setView] = useState("grid"); // grid | list
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialHotels = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search");
        const typeQuery = params.get("type");
        let data;
        if (searchQuery) {
          setSearch(searchQuery);
          data = await searchHotels(searchQuery);
        } else {
          data = await getHotels(typeQuery);
        }
        const fetchedHotels = data?.hotels || (Array.isArray(data) ? data : []);
        setOriginalHotels(fetchedHotels);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialHotels();
  }, [location.search]);

  // Sync URL "type" parameter to the active filters state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get("type") || "All";
    setActiveFilters(f => ({ ...f, type: typeParam }));
  }, [location.search]);

  // Apply filters
  useEffect(() => {
    let filtered = [...originalHotels];
    const { type, price, amenities } = activeFilters;

    if (type && type !== "All") filtered = filtered.filter(h => (h.type || "Hotel").toLowerCase() === type.toLowerCase());

    if (price === "low") filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (price === "high") filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
    else if (price.includes("-")) {
      const [min, max] = price.split("-").map(Number);
      filtered = filtered.filter(h => h.pricePerNight >= min && h.pricePerNight <= max);
    } else if (price.endsWith("+")) {
      const min = Number(price.replace("+", ""));
      filtered = filtered.filter(h => h.pricePerNight >= min);
    }

    if (amenities?.length > 0) {
      filtered = filtered.filter(h =>
        amenities.every(a => h.amenities?.some(ha => typeof ha === "string" && ha.toLowerCase().includes(a.toLowerCase())))
      );
    }

    setHotels(filtered);
  }, [originalHotels, activeFilters]);

  const handlePriceFilter = (val, label) => {
    setActiveFilters(f => ({ ...f, price: val }));
    setSortLabel(label);
  };

  const handleTypeFilter = (t) => {
    setActiveFilters(f => ({ ...f, type: t }));
    const params = new URLSearchParams(location.search);
    if (t === "All") {
      params.delete("type");
    } else {
      params.set("type", t);
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const toggleAmenity = (a) => {
    setActiveFilters(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }));
  };

  const clearFilters = () => {
    setActiveFilters({ type: "All", price: "", amenities: [] });
    setSortLabel("Any Price");
    setSearch("");
    navigate("/hotels", { replace: true });
  };

  const activeFilterCount = [
    activeFilters.type !== "All" ? 1 : 0,
    activeFilters.price ? 1 : 0,
    activeFilters.amenities.length,
  ].reduce((a, b) => a + b, 0);

  const handleSearchSubmit = () => {
    if (search.trim()) {
      navigate(`/hotels?search=${encodeURIComponent(search)}`);
    } else {
      navigate(`/hotels`);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ht-root {
          font-family: 'Poppins', sans-serif;
          background: #f5f2ed;
          min-height: 100vh;
          padding-bottom: 6rem;
        }

        /* ── HERO BANNER ── */
        .ht-banner {
          position: relative;
          height: 260px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }

        .ht-banner-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1800&q=80') center/cover no-repeat;
          filter: brightness(0.3);
          transform: scale(1.05);
          transition: transform 10s ease;
        }

        .ht-banner:hover .ht-banner-bg { transform: scale(1.02); }

        .ht-banner-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(10,8,6,0.55) 0%, rgba(10,8,6,0.2) 60%, rgba(10,8,6,0.75) 100%);
        }

        .ht-banner-content {
          position: relative;
          z-index: 2;
          padding: 2.5rem 3rem;
          width: 100%;
        }

        .banner-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .banner-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #c9a96e;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        .banner-eyebrow span {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c9a96e;
        }

        .ht-banner h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
        }

        .ht-banner h1 em { font-style: italic; color: #c9a96e; }

        .ht-banner p {
          color: rgba(255,255,255,0.5);
          font-size: 0.82rem;
          font-weight: 300;
          margin-top: 0.4rem;
        }

        /* ── BODY ── */
        .ht-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* ── SEARCH + CONTROLS ── */
        .ht-controls {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          padding: 1.4rem 1.8rem;
          margin-top: -2.5rem;
          position: relative;
          z-index: 20;
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-wrap {
          flex: 1;
          min-width: 200px;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          font-size: 0.9rem;
          color: #ccc;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.72rem 1rem 0.72rem 2.6rem;
          border: 1.5px solid #ede8de;
          border-radius: 12px;
          background: #faf8f4;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .search-input::placeholder { color: #c5bfb4; }
        .search-input:focus { border-color: #c9a96e; box-shadow: 0 0 0 3px rgba(201,169,110,0.1); }

        .search-btn {
          padding: 0.72rem 1.6rem;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 3px 14px rgba(201,169,110,0.35);
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .search-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        .ctrl-divider {
          width: 1px; height: 32px;
          background: #ede8de;
          flex-shrink: 0;
        }

        .view-toggle {
          display: flex;
          gap: 0.3rem;
        }

        .view-btn {
          width: 36px; height: 36px;
          border-radius: 9px;
          border: 1.5px solid #ede8de;
          background: transparent;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          color: #ccc;
        }

        .view-btn.active { background: #faf8f4; border-color: #c9a96e; color: #c9a96e; }

        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.1rem;
          border: 1.5px solid #ede8de;
          border-radius: 12px;
          background: #faf8f4;
          font-family: 'Poppins', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          color: #777;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          position: relative;
        }

        .filter-toggle-btn:hover { border-color: #c9a96e; color: #c9a96e; }
        .filter-toggle-btn.open { border-color: #c9a96e; color: #c9a96e; background: #fdf9f3; }

        .filter-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #c9a96e;
          color: #fff;
          font-size: 0.6rem;
          font-weight: 700;
        }

        /* ── FILTER PANEL ── */
        .filter-panel {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #ede8de;
          padding: 1.8rem;
          margin-top: 1rem;
          animation: slideDown 0.25s ease;
          position: relative;
          z-index: 15;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .filter-row {
          display: flex;
          gap: 2.5rem;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .filter-group { display: flex; flex-direction: column; gap: 0.6rem; }

        .filter-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #bbb;
        }

        .filter-pills { display: flex; flex-wrap: wrap; gap: 0.4rem; }

        .filter-pill {
          padding: 0.38rem 0.9rem;
          border-radius: 100px;
          border: 1.5px solid #ede8de;
          background: #faf8f4;
          font-family: 'Poppins', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          color: #888;
          cursor: pointer;
          transition: all 0.18s;
        }

        .filter-pill:hover { border-color: #c9a96e; color: #c9a96e; }
        .filter-pill.active { background: linear-gradient(135deg, #c9a96e, #a07840); border-color: transparent; color: #fff; box-shadow: 0 2px 8px rgba(201,169,110,0.3); }

        .filter-clear {
          margin-left: auto;
          padding: 0.38rem 0.9rem;
          border: none;
          background: none;
          font-family: 'Poppins', sans-serif;
          font-size: 0.72rem;
          font-weight: 600;
          color: #e06060;
          cursor: pointer;
          border-radius: 100px;
          transition: background 0.2s;
        }

        .filter-clear:hover { background: #fff0f0; }

        /* ── RESULTS META ── */
        .results-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 1.8rem 0 1.2rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .results-count {
          font-size: 0.82rem;
          color: #aaa;
          font-weight: 500;
        }

        .results-count strong { color: #1a1a1a; font-weight: 700; }

        /* ── GRID ── */
        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.4rem;
        }

        .hotels-grid.list-view {
          grid-template-columns: 1fr;
        }

        /* ── HOTEL CARD ── */
        .hc {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          transition: transform 0.25s, box-shadow 0.25s;
          animation: cardIn 0.4s ease both;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .hotels-grid.list-view .hc {
          flex-direction: row;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hc:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 36px rgba(0,0,0,0.12);
        }

        .hc-img-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .hotels-grid.list-view .hc-img-wrap {
          width: 280px;
          height: auto;
          min-height: 180px;
        }

        .hc-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.55s ease;
        }

        .hc:hover .hc-img { transform: scale(1.07); }

        .hc-type-badge {
          position: absolute;
          top: 0.8rem; left: 0.8rem;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.28rem 0.7rem;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .hc-rating-badge {
          position: absolute;
          top: 0.8rem; right: 0.8rem;
          background: rgba(201,169,110,0.9);
          backdrop-filter: blur(8px);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.28rem 0.65rem;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .hc-body {
          padding: 1.4rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .hc-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
          line-height: 1.2;
        }

        .hc-location {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          color: #aaa;
          font-weight: 500;
          margin-bottom: 0.8rem;
        }

        .hc-desc {
          font-size: 0.8rem;
          color: #999;
          font-weight: 300;
          line-height: 1.65;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hc-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 1.2rem;
        }

        .hc-amenity {
          padding: 0.2rem 0.6rem;
          background: #f5f2ed;
          border-radius: 100px;
          font-size: 0.65rem;
          font-weight: 600;
          color: #888;
          border: 1px solid #ede8de;
        }

        .hc-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 1px solid #f0ebe2;
        }

        .hc-price {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .hc-price span {
          font-family: 'Poppins', sans-serif;
          font-size: 0.68rem;
          color: #bbb;
          font-weight: 400;
        }

        .hc-btn {
          padding: 0.55rem 1.1rem;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(201,169,110,0.3);
          transition: opacity 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .hc-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        /* ── EMPTY STATE ── */
        .empty-state {
          grid-column: span 3;
          text-align: center;
          padding: 5rem 2rem;
          background: #fff;
          border-radius: 20px;
          border: 2px dashed #ede8de;
        }

        .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; opacity: 0.35; }
        .empty-state h3 { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #555; margin-bottom: 0.5rem; }
        .empty-state p { font-size: 0.82rem; color: #bbb; }

        /* ── LOADING SKELETON ── */
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.4rem;
          margin-top: 0;
        }

        .skeleton-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }

        .skeleton-img {
          height: 200px;
          background: linear-gradient(90deg, #f0ebe2 25%, #e8e2d8 50%, #f0ebe2 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .skeleton-body { padding: 1.4rem; display: flex; flex-direction: column; gap: 0.7rem; }

        .skeleton-line {
          height: 14px;
          border-radius: 8px;
          background: linear-gradient(90deg, #f0ebe2 25%, #e8e2d8 50%, #f0ebe2 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hotels-grid { grid-template-columns: repeat(2, 1fr); }
          .hotels-grid.list-view .hc { flex-direction: column; }
          .hotels-grid.list-view .hc-img-wrap { width: 100%; height: 200px; }
          .skeleton-grid { grid-template-columns: repeat(2, 1fr); }
          .empty-state { grid-column: span 2; }
          .ht-banner-content { padding: 1.8rem 1.5rem; }
          .filter-row { gap: 1.5rem; }
        }

        @media (max-width: 580px) {
          .hotels-grid, .skeleton-grid { grid-template-columns: 1fr; }
          .empty-state { grid-column: span 1; }
          .ht-body { padding: 0 1rem; }
          .ht-controls { flex-wrap: wrap; gap: 0.7rem; }
          .ctrl-divider { display: none; }
          .view-toggle { display: none; }
          .ht-banner { height: 220px; }
        }
      `}</style>

      <div className="ht-root">

        {/* ── BANNER ── */}
        <div className="ht-banner">
          <div className="ht-banner-bg" />
          <div className="ht-banner-overlay" />
          <div className="ht-banner-content">
            <div className="banner-eyebrow">
              <div className="banner-dot" />
              <span>GrandStay Collection</span>
            </div>
            <h1>Discover <em>Luxury</em> Hotels</h1>
          <p>Browse our handpicked selection of world-class stays across 500+ destinations</p>
          </div>
        </div>

        <div className="ht-body">

          {/* ── CONTROLS ── */}
          <div className="ht-controls">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search by hotel name or location…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearchSubmit()}
              />
            </div>

            <button className="search-btn" onClick={handleSearchSubmit}>Search</button>

            <div className="ctrl-divider" />

            <div className="view-toggle">
              <button className={`view-btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")} title="Grid view">⊞</button>
              <button className={`view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")} title="List view">☰</button>
            </div>

            <button
              className={`filter-toggle-btn ${filterOpen ? "open" : ""}`}
              onClick={() => setFilterOpen(o => !o)}
            >
              ⚙ Filters
              {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
            </button>
          </div>

          {/* ── FILTER PANEL ── */}
          {filterOpen && (
            <div className="filter-panel">
              <div className="filter-row">
                <div className="filter-group">
                  <span className="filter-label">Property Type</span>
                  <div className="filter-pills">
                    {TYPE_OPTIONS.map(t => (
                      <button
                        key={t}
                        className={`filter-pill ${activeFilters.type === t ? "active" : ""}`}
                        onClick={() => handleTypeFilter(t)}
                      >{t}</button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <span className="filter-label">Price Range</span>
                  <div className="filter-pills">
                    {PRICE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        className={`filter-pill ${activeFilters.price === opt.value ? "active" : ""}`}
                        onClick={() => handlePriceFilter(opt.value, opt.label)}
                      >{opt.label}</button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <span className="filter-label">Amenities</span>
                  <div className="filter-pills">
                    {AMENITY_OPTIONS.map(a => (
                      <button
                        key={a}
                        className={`filter-pill ${activeFilters.amenities.includes(a) ? "active" : ""}`}
                        onClick={() => toggleAmenity(a)}
                      >{a}</button>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button className="filter-clear" onClick={clearFilters}>✕ Clear all</button>
                )}
              </div>
            </div>
          )}

          {/* ── RESULTS META ── */}
          <div className="results-meta">
            <p className="results-count">
              Showing <strong>{hotels.length}</strong> {hotels.length === 1 ? "property" : "properties"}
              {search && <> for "<strong>{search}</strong>"</>}
              {activeFilters.type !== "All" && <> · <strong>{activeFilters.type}</strong></>}
            </p>
          </div>

          {/* ── HOTEL GRID / LIST ── */}
          {loading ? (
            <div className="skeleton-grid">
              {[1,2,3,4,5,6].map(i => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton-img" style={{ animationDelay: `${i * 0.1}s` }} />
                  <div className="skeleton-body">
                    <div className="skeleton-line" style={{ width: "65%" }} />
                    <div className="skeleton-line" style={{ width: "45%" }} />
                    <div className="skeleton-line" style={{ width: "80%" }} />
                    <div className="skeleton-line" style={{ width: "55%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`hotels-grid ${view === "list" ? "list-view" : ""}`}>
              {hotels.length > 0 ? hotels.map((hotel, i) => (
                <div
                  className="hc"
                  key={hotel._id}
                  style={{ animationDelay: `${i * 0.07}s` }}
                  onClick={() => navigate(`/hotel/${hotel._id}`)}
                >
                  <div className="hc-img-wrap">
                    <img
                      className="hc-img"
                      src={hotel.images?.[0]?.startsWith("http") ? hotel.images[0] : (hotel.images?.[0] ? `http://localhost:5000${hotel.images[0]}` : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80")}
                      alt={hotel.hotelName}
                    loading="lazy"
                    />
                    <div className="hc-type-badge">{hotel.type || "Hotel"}</div>
                    <div className="hc-rating-badge">★ {hotel.rating?.toFixed(1) || "0.0"}</div>
                  </div>

                  <div className="hc-body">
                    <div className="hc-name">{hotel.hotelName}</div>
                    <div className="hc-location"><span>📍</span>{hotel.location}</div>
                    <p className="hc-desc">{hotel.description}</p>
                    <div className="hc-amenities">
                      {hotel.amenities?.slice(0, 4).map((a, j) => (
                        <span className="hc-amenity" key={j}>{a}</span>
                      ))}
                      {hotel.amenities?.length > 4 && (
                        <span className="hc-amenity">+{hotel.amenities.length - 4}</span>
                      )}
                    </div>

                    <div className="hc-footer">
                      <div>
                        <div className="hc-price">
                          ₹{hotel.pricePerNight?.toLocaleString() || "0"} <span>/night</span>
                        </div>
                      </div>
                      <button className="hc-btn">View Hotel →</button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <span className="empty-icon">🏨</span>
                  <h3>No properties found</h3>
                  <p>Try adjusting your search or filters to explore more options.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Hotels;