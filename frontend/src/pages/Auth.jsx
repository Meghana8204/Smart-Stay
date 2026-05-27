import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const toggleAuthMode = () => setIsLogin((prev) => !prev);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        login(data);
        toast.success(`Welcome back, ${data?.user?.name || "User"}!`);
        if (data?.user?.role === "admin") {
          navigate("/admin/dashboard");
        } else if (data?.user?.role === "hotelOwner") {
          navigate("/owner/dashboard");
        } else {
          navigate("/");
        }
      } else {
        const { data } = await api.post("/auth/register", formData);
        toast.success(data.message);
        localStorage.setItem("verify-email", formData.email);
        navigate("/verify-otp");
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error?.response?.data?.message || "Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          font-family: 'Poppins', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #0d0d0d;
          overflow: hidden;
        }

        /* LEFT PANEL */
        .auth-left {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
          overflow: hidden;
          min-height: 320px;
        }

        .auth-left-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80') center/cover no-repeat;
          filter: brightness(0.45);
          transition: transform 8s ease;
        }
        .auth-left:hover .auth-left-bg {
          transform: scale(1.04);
        }

        .auth-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, transparent 30%, rgba(10,8,6,0.85) 100%);
        }

        .auth-left-content {
          position: relative;
          z-index: 2;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          padding: 0.4rem 1rem;
          margin-bottom: 2rem;
          width: fit-content;
        }

        .brand-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #c9a96e;
          animation: pulse-gold 2s infinite;
        }

        @keyframes pulse-gold {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }

        .brand-badge span {
          color: rgba(255,255,255,0.75);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .left-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          color: #fff;
          line-height: 1.15;
          margin-bottom: 1rem;
        }

        .left-headline em {
          font-style: italic;
          color: #c9a96e;
        }

        .left-sub {
          color: rgba(255,255,255,0.55);
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 1.7;
          max-width: 340px;
          margin-bottom: 2.5rem;
        }

        .feature-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .feature-pill {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(201,169,110,0.12);
          border: 1px solid rgba(201,169,110,0.25);
          border-radius: 100px;
          padding: 0.35rem 0.8rem;
          color: #c9a96e;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.03em;
        }

        .pill-icon { font-size: 0.85rem; }

        /* RIGHT PANEL */
        .auth-right {
          width: 460px;
          min-width: 0;
          background: #f7f4ef;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2.5rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .auth-right::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .auth-right::after {
          content: '';
          position: absolute;
          bottom: -60px; left: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .form-card {
          width: 100%;
          max-width: 380px;
          position: relative;
          z-index: 1;
        }

        /* Logo */
        .form-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 2rem;
        }

        .logo-icon {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          box-shadow: 0 4px 16px rgba(201,169,110,0.35);
        }

        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: -0.01em;
        }

        .logo-text span { color: #c9a96e; }

        /* Heading */
        .form-heading {
          margin-bottom: 0.4rem;
        }

        .form-heading h2 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .form-heading p {
          color: #888;
          font-size: 0.82rem;
          font-weight: 400;
          margin-top: 0.4rem;
          line-height: 1.5;
        }

        /* Tab switcher */
        .tab-switch {
          display: flex;
          background: #ece8e0;
          border-radius: 12px;
          padding: 4px;
          margin: 1.5rem 0;
          gap: 4px;
        }

        .tab-btn {
          flex: 1;
          padding: 0.55rem;
          border: none;
          border-radius: 9px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
          background: transparent;
          color: #999;
        }

        .tab-btn.active {
          background: #fff;
          color: #1a1a1a;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.2rem 0 1.2rem;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: #e0dbd0;
        }

        .divider-text {
          font-size: 0.72rem;
          color: #bbb;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Inputs */
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          margin-bottom: 1.2rem;
        }

        .input-wrap {
          position: relative;
        }

        .input-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: #555;
          margin-bottom: 0.35rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .input-field-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.9rem;
          font-size: 0.9rem;
          color: #bbb;
          pointer-events: none;
          z-index: 1;
        }

        .input-field {
          width: 100%;
          padding: 0.75rem 0.9rem 0.75rem 2.5rem;
          border: 1.5px solid #e5e0d6;
          border-radius: 12px;
          background: #fff;
          font-family: 'Poppins', sans-serif;
          font-size: 0.85rem;
          color: #1a1a1a;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-field::placeholder { color: #c5bfb4; }

        .input-field:focus {
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
        }

        .password-toggle {
          position: absolute;
          right: 0.9rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          color: #bbb;
          padding: 0;
          line-height: 1;
          z-index: 2;
        }

        .password-toggle:hover { color: #888; }

        /* Forgot */
        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -0.5rem;
          margin-bottom: 0.2rem;
        }

        .forgot-link {
          font-size: 0.75rem;
          color: #c9a96e;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          font-family: 'Poppins', sans-serif;
        }

        .forgot-link:hover { text-decoration: underline; }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(135deg, #c9a96e, #a07840);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.03em;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(201,169,110,0.4);
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 26px rgba(201,169,110,0.5);
        }

        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer note */
        .form-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.78rem;
          color: #aaa;
        }

        .form-footer strong {
          color: #1a1a1a;
          font-weight: 600;
        }

        /* Trust badges */
        .trust-row {
          display: flex;
          justify-content: center;
          gap: 1.2rem;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e8e2d8;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.68rem;
          color: #bbb;
          font-weight: 500;
        }

        .trust-icon { font-size: 0.8rem; }

        /* RESPONSIVE */
        @media (max-width: 820px) {
          .auth-root { flex-direction: column; }
          .auth-left { min-height: 42vh; flex: none; padding: 2rem; }
          .auth-right { width: 100%; padding: 2rem 1.5rem 3rem; }
          .left-headline { font-size: 1.8rem; }
        }

        @media (max-width: 480px) {
          .auth-left { min-height: 38vh; padding: 1.5rem; }
          .auth-right { padding: 1.5rem 1.2rem 2.5rem; }
          .form-card { max-width: 100%; }
          .feature-pills { gap: 0.4rem; }
          .left-sub { font-size: 0.8rem; }
          .trust-row { gap: 0.8rem; }
          .trust-item { font-size: 0.62rem; }
        }

        /* Animated slide-in for form content */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .form-card { animation: slideUp 0.45s ease both; }
      `}</style>

      <div className="auth-root">
        {/* ── LEFT PANEL ── */}
        <div className="auth-left">
          <div className="auth-left-bg" />
          <div className="auth-left-overlay" />
          <div className="auth-left-content">
            <div className="brand-badge">
              <div className="brand-dot" />
              <span>Luxury Stays Await</span>
            </div>

            <h1 className="left-headline">
              Where <em>Comfort</em><br />Meets Elegance
            </h1>

            <p className="left-sub">
              Join thousands of travelers who choose us for unforgettable stays crafted with attention to every detail.
            </p>

            <div className="feature-pills">
              <div className="feature-pill"><span className="pill-icon">✦</span> 500+ Premium Hotels</div>
              <div className="feature-pill"><span className="pill-icon">⬧</span> Best Rate Guarantee</div>
              <div className="feature-pill"><span className="pill-icon">✦</span> 24/7 Concierge</div>
              <div className="feature-pill"><span className="pill-icon">⬧</span> Free Cancellation</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="auth-right">
          <div className="form-card">
            {/* Logo */}
            <div className="form-logo">
              <div className="logo-icon">🏨</div>
              <div className="logo-text">Grand<span>Stay</span></div>
            </div>

            {/* Heading */}
            <div className="form-heading">
              <h2>{isLogin ? "Welcome back" : "Create account"}</h2>
              <p>
                {isLogin
                  ? "Sign in to manage your reservations & rewards."
                  : "Start your luxury journey — it only takes a moment."}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="tab-switch">
              <button
                type="button"
                className={`tab-btn ${isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`tab-btn ${!isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </div>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">
                {isLogin ? "with your credentials" : "create new account"}
              </span>
              <div className="divider-line" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                {!isLogin && (
                  <div className="input-wrap">
                    <label className="input-label">Full Name</label>
                    <div className="input-field-wrap">
                      <span className="input-icon">👤</span>
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="input-wrap">
                  <label className="input-label">Email Address</label>
                  <div className="input-field-wrap">
                    <span className="input-icon">✉</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="input-wrap">
                  <label className="input-label">Password</label>
                  <div className="input-field-wrap">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>
              </div>

              {isLogin && (
                <div className="forgot-row">
                  <button type="button" className="forgot-link">Forgot password?</button>
                </div>
              )}

              <button type="submit" disabled={loading} className="submit-btn" style={{ marginTop: "1rem" }}>
                <div className="btn-inner">
                  {loading && <div className="spinner" />}
                  {loading
                    ? "Processing…"
                    : isLogin
                    ? "Sign In to Your Account"
                    : "Create My Account"}
                </div>
              </button>
            </form>

            {/* Footer */}
            <div className="form-footer">
              {isLogin ? (
                <>New to GrandStay? <strong style={{ color: "#c9a96e", cursor: "pointer" }} onClick={toggleAuthMode}>Register free →</strong></>
              ) : (
                <>Already a member? <strong style={{ color: "#c9a96e", cursor: "pointer" }} onClick={toggleAuthMode}>Sign in →</strong></>
              )}
            </div>

            {/* Trust */}
            <div className="trust-row">
              <div className="trust-item"><span className="trust-icon">🔐</span> SSL Secured</div>
              <div className="trust-item"><span className="trust-icon">🛡</span> Privacy Safe</div>
              <div className="trust-item"><span className="trust-icon">⭐</span> 4.9 Rating</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Auth;