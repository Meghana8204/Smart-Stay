import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STATS = [
  { value: "500+", label: "Luxury Hotels" },
  { value: "80+", label: "Destinations" },
  { value: "4.9★", label: "Average Rating" },
  { value: "24/7", label: "Concierge" },
];

const FEATURES = [
  {
    icon: "✦",
    title: "Curated Selection",
    desc: "Every property is handpicked and verified by our luxury travel experts for uncompromising quality.",
  },
  {
    icon: "⬧",
    title: "Best Rate Guarantee",
    desc: "Find a lower price anywhere else and we'll match it — no questions asked.",
  },
  {
    icon: "✦",
    title: "Free Cancellation",
    desc: "Plans change. Enjoy flexible booking with free cancellation on most stays.",
  },
  {
    icon: "⬧",
    title: "Exclusive Rewards",
    desc: "Earn points on every stay and unlock complimentary upgrades, spa credits, and more.",
  },
];

const DESTINATIONS = [
  { name: "Paris",    tag: "City Escape",   img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80" },
  { name: "Maldives", tag: "Island Retreat", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80" },
  { name: "Kyoto",    tag: "Cultural Gem",   img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80" },
  { name: "New York", tag: "Urban Luxury",   img: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80" },
  { name: "Santorini",tag: "Clifftop Bliss", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80" },
  { name: "Dubai",    tag: "Modern Marvel",  img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80" },
];

const TESTIMONIALS = [
  { name: "Anika Sharma", role: "Frequent Traveller", quote: "GrandStay turned a business trip into a true luxury experience. The concierge service was remarkable.", avatar: "AS" },
  { name: "James O'Brien", role: "Honeymooner", quote: "We booked our honeymoon suite through GrandStay and every single detail was perfect. Highly recommend.", avatar: "JO" },
  { name: "Priya Menon", role: "Solo Explorer", quote: "Best hotel booking platform I've used. Clean interface, great prices, and genuinely curated listings.", avatar: "PM" },
];

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [searchForm, setSearchForm] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 2,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchForm.destination) params.append("search", searchForm.destination);
    if (searchForm.checkIn) params.append("checkIn", searchForm.checkIn);
    if (searchForm.checkOut) params.append("checkOut", searchForm.checkOut);
    if (searchForm.guests) params.append("guests", searchForm.guests);
    
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hm-root {
          font-family: 'Poppins', sans-serif;
          background: #f5f2ed;
          color: #1a1a1a;
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hm-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }

        .hm-hero-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=80') center/cover no-repeat;
          filter: brightness(0.28);
          transform: scale(1.06);
          transition: transform 12s ease;
        }

        .hm-hero:hover .hm-hero-bg { transform: scale(1.02); }

        .hm-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(10,8,6,0.5) 0%, rgba(10,8,6,0.15) 50%, rgba(10,8,6,0.7) 100%);
        }

        /* Decorative grain */
        .hm-hero-grain {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
        }

        .hm-hero-content {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 8rem 2rem 6rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-left { display: flex; flex-direction: column; }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(201,169,110,0.12);
          border: 1px solid rgba(201,169,110,0.3);
          border-radius: 100px;
          padding: 0.4rem 1rem;
          width: fit-content;
          margin-bottom: 2rem;
          animation: fadeUp 0.6s ease both;
        }

        .hero-eyebrow-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #c9a96e;
          animation: pulse-gold 2s infinite;
        }

        @keyframes pulse-gold {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }

        .hero-eyebrow span {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c9a96e;
        }

        .hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 5.5vw, 4.5rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.08;
          margin-bottom: 1.5rem;
          animation: fadeUp 0.6s 0.1s ease both;
        }

        .hero-h1 em {
          font-style: italic;
          color: #c9a96e;
          display: block;
        }

        .hero-desc {
          color: rgba(255,255,255,0.55);
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.75;
          max-width: 420px;
          margin-bottom: 2.5rem;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .hero-cta-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #fff;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.02em;
          box-shadow: 0 4px 22px rgba(201,169,110,0.45);
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          position: relative;
          overflow: hidden;
        }

        .btn-gold::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
        }

        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201,169,110,0.55);
        }

        .btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          border: 1.5px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
          color: #fff;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }

        /* Hero right — search card */
        .hero-card {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 2rem;
          animation: fadeUp 0.7s 0.25s ease both;
        }

        .hero-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          color: #fff;
          font-weight: 600;
          margin-bottom: 1.4rem;
        }

        .search-field {
          margin-bottom: 1rem;
        }

        .search-label {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 0.4rem;
          display: block;
        }

        .search-input {
          width: 100%;
          padding: 0.7rem 1rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          color: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .search-input::placeholder { color: rgba(255,255,255,0.3); }
        .search-input:focus { border-color: #c9a96e; background: rgba(255,255,255,0.12); }

        .search-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }

        .search-btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.85rem;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.03em;
          box-shadow: 0 4px 18px rgba(201,169,110,0.4);
          transition: opacity 0.2s, transform 0.15s;
        }

        .search-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        /* Hero stats bar */
        .hero-stats {
          position: relative;
          z-index: 2;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        .hero-stat {
          padding: 1.6rem 2rem;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.08);
          animation: fadeUp 0.5s ease both;
        }

        .hero-stat:last-child { border-right: none; }

        .hero-stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #c9a96e;
          line-height: 1;
          margin-bottom: 0.3rem;
        }

        .hero-stat-label {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── SECTION SHARED ── */
        .section {
          padding: 6rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .section-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .eyebrow-line {
          width: 32px; height: 2px;
          background: linear-gradient(90deg, #c9a96e, transparent);
        }

        .eyebrow-text {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c9a96e;
        }

        .section-h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.15;
          margin-bottom: 0.75rem;
        }

        .section-h2 em { font-style: italic; color: #c9a96e; }

        .section-sub {
          color: #999;
          font-size: 0.88rem;
          font-weight: 300;
          line-height: 1.7;
          max-width: 480px;
        }

        /* ── FEATURES ── */
        .features-bg {
          background: #fff;
          padding: 6rem 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .feature-card {
          background: #faf8f4;
          border: 1px solid #ede8de;
          border-radius: 20px;
          padding: 2rem;
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 3px;
          background: linear-gradient(90deg, #c9a96e, transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .feature-card:hover::before { transform: scaleX(1); }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.07);
          border-color: #d4ccbe;
        }

        .feature-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #f5ede0, #ede0c8);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #c9a96e;
          margin-bottom: 1.2rem;
          box-shadow: 0 2px 10px rgba(201,169,110,0.15);
        }

        .feature-title {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .feature-desc {
          font-size: 0.82rem;
          color: #999;
          font-weight: 300;
          line-height: 1.7;
        }

        /* ── DESTINATIONS ── */
        .dest-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          margin-top: 3rem;
        }

        .dest-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4/5;
          cursor: pointer;
          group: true;
        }

        .dest-card:nth-child(2) { aspect-ratio: 4/5; margin-top: 2rem; }
        .dest-card:nth-child(5) { aspect-ratio: 4/5; margin-top: -2rem; }

        .dest-img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .dest-card:hover .dest-img { transform: scale(1.08); }

        .dest-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
          transition: opacity 0.3s;
        }

        .dest-card:hover .dest-overlay { opacity: 0.85; }

        .dest-info {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          z-index: 2;
        }

        .dest-tag {
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 0.3rem;
        }

        .dest-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
        }

        .dest-explore {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.6rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.3s, transform 0.3s;
        }

        .dest-card:hover .dest-explore {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── TESTIMONIALS ── */
        .testimonials-bg {
          background: #1a1714;
          padding: 6rem 2rem;
        }

        .test-inner {
          max-width: 760px;
          margin: 0 auto;
          text-align: center;
        }

        .test-quote {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.2rem, 2.5vw, 1.65rem);
          font-style: italic;
          color: rgba(255,255,255,0.85);
          line-height: 1.65;
          margin: 2.5rem 0 2rem;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.4s;
        }

        .test-author {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.9rem;
          margin-bottom: 2.5rem;
        }

        .test-avatar {
          width: 46px; height: 46px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.05em;
        }

        .test-name {
          font-weight: 600;
          color: #fff;
          font-size: 0.88rem;
        }

        .test-role {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.4);
          font-weight: 400;
        }

        .test-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .test-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          cursor: pointer;
          transition: background 0.3s, transform 0.2s;
          border: none;
          padding: 0;
        }

        .test-dot.active {
          background: #c9a96e;
          transform: scale(1.3);
        }

        /* ── CTA BANNER ── */
        .cta-section {
          padding: 6rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .cta-card {
          background: linear-gradient(135deg, #1a1714 60%, #2a2118);
          border-radius: 28px;
          padding: 4rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .cta-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%);
        }

        .cta-h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 0.75rem;
        }

        .cta-h2 em { font-style: italic; color: #c9a96e; }

        .cta-sub {
          color: rgba(255,255,255,0.45);
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 1.7;
          max-width: 420px;
        }

        .cta-btns {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hm-hero-content { grid-template-columns: 1fr; gap: 2.5rem; padding: 7rem 1.5rem 4rem; }
          .hero-card { display: none; }
          .hero-stats { grid-template-columns: repeat(2, 1fr); }
          .features-grid { grid-template-columns: 1fr; }
          .dest-grid { grid-template-columns: repeat(2, 1fr); }
          .dest-card:nth-child(2), .dest-card:nth-child(5) { margin-top: 0; }
          .cta-card { grid-template-columns: 1fr; padding: 2.5rem; }
          .cta-btns { flex-direction: row; }
        }

        @media (max-width: 580px) {
          .hero-stats { grid-template-columns: repeat(2, 1fr); }
          .dest-grid { grid-template-columns: 1fr 1fr; }
          .hero-h1 { font-size: 2.4rem; }
          .section { padding: 4rem 1.2rem; }
          .features-bg { padding: 4rem 0; }
          .testimonials-bg { padding: 4rem 1.2rem; }
          .cta-section { padding: 3rem 1.2rem; }
          .cta-btns { flex-direction: column; }
          .hero-cta-row { flex-direction: column; }
          .btn-gold, .btn-outline { justify-content: center; }
        }

        @media (max-width: 400px) {
          .dest-grid { grid-template-columns: 1fr; }
          .hero-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="hm-root">

        {/* ══ HERO ══ */}
        <section className="hm-hero">
          <div className="hm-hero-bg" />
          <div className="hm-hero-overlay" />
          <div className="hm-hero-grain" />

          <div className="hm-hero-content">
            {/* Left */}
            <div className="hero-left">
              <div className="hero-eyebrow">
                <div className="hero-eyebrow-dot" />
                <span>World-Class Hospitality</span>
              </div>

              <h1 className="hero-h1">
                Find Your
                <em>Perfect Stay</em>
              </h1>

              <p className="hero-desc">
                Discover handpicked luxury hotels, private resorts, and boutique hideaways
                curated by GrandStay's travel experts — at prices that never compromise.
              </p>

              <div className="hero-cta-row">
                <Link to="/hotels" className="btn-gold">
                  ✦ Explore Hotels
                </Link>
                {!user && (
                  <Link to="/auth" className="btn-outline">
                    Get Started →
                  </Link>
                )}
              </div>
            </div>

            {/* Right — Search Card */}
            <div className="hero-card">
              <div className="hero-card-title">Find Your Room</div>

              <div className="search-field">
                <label className="search-label">Destination</label>
                <input 
                  className="search-input" 
                  type="text" 
                  placeholder="Paris, Maldives, Tokyo…" 
                  value={searchForm.destination}
                  onChange={(e) => setSearchForm({ ...searchForm, destination: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <div className="search-row">
                <div className="search-field">
                  <label className="search-label">Check-in</label>
                  <input 
                    className="search-input" 
                    type="date" 
                    value={searchForm.checkIn}
                    onChange={(e) => setSearchForm({ ...searchForm, checkIn: e.target.value })}
                  />
                </div>
                <div className="search-field">
                  <label className="search-label">Check-out</label>
                  <input 
                    className="search-input" 
                    type="date" 
                    value={searchForm.checkOut}
                    onChange={(e) => setSearchForm({ ...searchForm, checkOut: e.target.value })}
                  />
                </div>
              </div>

              <div className="search-field">
                <label className="search-label">Guests</label>
                <input 
                  className="search-input" 
                  type="number" 
                  placeholder="2 guests" 
                  min="1" 
                  value={searchForm.guests}
                  onChange={(e) => setSearchForm({ ...searchForm, guests: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <button className="search-btn" onClick={handleSearch}>Search Available Rooms</button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="hero-stats">
            {STATS.map((s, i) => (
              <div className="hero-stat" key={i} style={{ animationDelay: `${i * 0.1 + 0.4}s` }}>
                <div className="hero-stat-val">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ FEATURES ══ */}
        <div className="features-bg">
          <div className="section" style={{ padding: "0 2rem" }}>
            <div className="section-eyebrow">
              <div className="eyebrow-line" />
              <span className="eyebrow-text">Why GrandStay</span>
            </div>
            <h2 className="section-h2">Travel smarter,<br />stay <em>better</em></h2>
            <p className="section-sub">Every feature is designed to make your luxury experience seamless from first click to checkout.</p>

            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div className="feature-card" key={i}>
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ DESTINATIONS ══ */}
        <div className="section">
          <div className="section-eyebrow">
            <div className="eyebrow-line" />
            <span className="eyebrow-text">Top Destinations</span>
          </div>
          <h2 className="section-h2">Where will you go <em>next?</em></h2>
          <p className="section-sub">From cliff-top villas in Santorini to jungle retreats in Bali — your next chapter starts here.</p>

          <div className="dest-grid">
            {DESTINATIONS.map((d, i) => (
              <div className="dest-card" key={i}>
                <img className="dest-img" src={d.img} alt={d.name} loading="lazy" />
                <div className="dest-overlay" />
                <div className="dest-info">
                  <div className="dest-tag">{d.tag}</div>
                  <div className="dest-name">{d.name}</div>
                  <div className="dest-explore">Explore stays →</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ TESTIMONIALS ══ */}
        <div className="testimonials-bg">
          <div className="test-inner">
            <div className="section-eyebrow" style={{ justifyContent: "center" }}>
              <div className="eyebrow-line" />
              <span className="eyebrow-text" style={{ color: "#c9a96e" }}>Guest Stories</span>
              <div className="eyebrow-line" style={{ background: "linear-gradient(90deg, transparent, #c9a96e)" }} />
            </div>
            <h2 className="section-h2" style={{ color: "#fff", textAlign: "center" }}>
              Loved by <em>travellers</em> worldwide
            </h2>

            <div className="test-quote">
              "{TESTIMONIALS[activeTestimonial].quote}"
            </div>

            <div className="test-author">
              <div className="test-avatar">{TESTIMONIALS[activeTestimonial].avatar}</div>
              <div>
                <div className="test-name">{TESTIMONIALS[activeTestimonial].name}</div>
                <div className="test-role">{TESTIMONIALS[activeTestimonial].role}</div>
              </div>
            </div>

            <div className="test-dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`test-dot ${i === activeTestimonial ? "active" : ""}`}
                  onClick={() => setActiveTestimonial(i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ══ CTA ══ */}
        <div className="cta-section">
          <div className="cta-card">
            <div>
              <h2 className="cta-h2">Ready for your next<br /><em>luxury escape?</em></h2>
              <p className="cta-sub">Join over 200,000 travellers who trust GrandStay for exceptional stays, exclusive rates, and memories that last a lifetime.</p>
            </div>
            <div className="cta-btns">
              <Link to="/hotels" className="btn-gold">Browse Hotels</Link>
              {!user && (
                <Link to="/auth" className="btn-outline" style={{ borderColor: "rgba(255,255,255,0.2)" }}>Create Account</Link>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Home;