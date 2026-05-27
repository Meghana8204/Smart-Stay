import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [digits, setDigits] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);

  const inputRefs = useRef([]);
  const email = localStorage.getItem("verify-email");
  const otp = digits.join("");

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const next = Array(6).fill("");
    paste.split("").forEach((ch, i) => (next[i] = ch));
    setDigits(next);
    inputRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      login(data);
      toast.success("Account verified successfully!");
      localStorage.removeItem("verify-email");
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "OTP Verification Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      setError("");
      setSuccess("");
      const { data } = await api.post("/auth/resend-otp", { email });
      setSuccess(data.message || "A new OTP has been sent.");
      setDigits(Array(6).fill(""));
      setSecondsLeft(60);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        /* ── CRITICAL: escape any parent layout wrapper ── */
        .vo-root {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          font-family: 'Poppins', sans-serif;
          overflow: hidden;
        }

        /* ── LEFT panel ── */
        .vo-left {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3.5rem;
          overflow: hidden;
        }

        .vo-left-bg {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1400&q=80')
            center / cover no-repeat;
          filter: brightness(0.38);
          transform: scale(1);
          transition: transform 10s ease;
        }
        .vo-left:hover .vo-left-bg { transform: scale(1.05); }

        .vo-left-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(10, 8, 5, 0.15) 0%,
            rgba(10, 8, 5, 0.88) 100%
          );
        }

        .vo-left-bottom {
          position: relative;
          z-index: 2;
        }

        .vo-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201, 169, 110, 0.12);
          border: 1px solid rgba(201, 169, 110, 0.3);
          border-radius: 30px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 500;
          color: #c9a96e;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }

        .vo-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 3.2vw, 2.8rem);
          color: #fff;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .vo-headline em {
          font-style: italic;
          color: #c9a96e;
        }

        .vo-sub {
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.85rem;
          font-weight: 300;
          line-height: 1.8;
          max-width: 360px;
          margin-bottom: 2.5rem;
        }

        .vo-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .vo-feat {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.5);
        }

        .vo-feat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c9a96e;
          flex-shrink: 0;
        }

        /* ── RIGHT panel ── */
        .vo-right {
          width: 480px;
          min-width: 320px;
          background: #f7f4ef;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2.5rem 2rem;
          overflow-y: auto;
        }

        .vo-card { width: 100%; max-width: 380px; }

        /* Logo mark */
        .vo-logo-mark {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 2rem;
        }
        .vo-logo-icon {
          width: 44px;
          height: 44px;
          background: #1a1208;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        .vo-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 600;
          color: #1a1208;
        }
        .vo-logo-text span { color: #c9a96e; }

        .vo-divider {
          width: 40px;
          height: 2px;
          background: #c9a96e;
          border-radius: 2px;
          margin: 0 auto 1.75rem;
        }

        .vo-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 600;
          color: #1a1208;
          text-align: center;
          margin-bottom: 0.4rem;
        }

        .vo-subtitle {
          font-size: 13px;
          color: #999;
          text-align: center;
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .vo-email-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: rgba(201, 169, 110, 0.1);
          border: 1px solid rgba(201, 169, 110, 0.25);
          border-radius: 30px;
          padding: 5px 14px;
          font-size: 12px;
          font-weight: 600;
          color: #a07840;
          width: fit-content;
          margin: 0 auto 1.75rem;
        }

        /* OTP boxes */
        .vo-otp-row {
          display: flex;
          gap: 10px;
          margin-bottom: 0.75rem;
          flex-wrap: nowrap;
          justify-content: space-between;
        }

        .vo-digit {
          flex: 1;
          min-width: 0;
          height: 58px;
          border: 1.5px solid #e5e0d6;
          border-radius: 12px;
          background: #fff;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          color: #1a1208;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          caret-color: transparent;
        }

        .vo-digit:focus {
          border-color: #c9a96e;
          box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.15);
        }

        /* Progress bar */
        .vo-progress-wrap {
          height: 3px;
          background: #e8e2d8;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .vo-progress-bar {
          height: 100%;
          background: #c9a96e;
          border-radius: 2px;
          transition: width 1s linear;
        }

        /* Alerts */
        .vo-alert {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          font-weight: 500;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
        }
        .vo-alert.error {
          background: #fdf2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }
        .vo-alert.success {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #86efac;
        }

        /* Verify button */
        .vo-verify-btn {
          width: 100%;
          padding: 0.9rem;
          background: #1a1208;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: background 0.2s, transform 0.15s;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .vo-verify-btn:hover:not(:disabled) {
          background: #2d2415;
          transform: translateY(-1px);
        }
        .vo-verify-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Gold accent bar on button */
        .vo-btn-accent {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .vo-btn-line {
          width: 18px;
          height: 2px;
          background: #c9a96e;
          border-radius: 1px;
        }

        /* Resend */
        .vo-resend-wrap {
          text-align: center;
          font-size: 13px;
          color: #aaa;
        }

        .vo-timer-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fdf6e9;
          border: 1px solid #f0d98a;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 12px;
          color: #b8860b;
          font-weight: 600;
        }

        .vo-resend-btn {
          font-weight: 600;
          color: #c9a96e;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s;
        }
        .vo-resend-btn:hover:not(:disabled) { color: #a07840; }
        .vo-resend-btn:disabled { color: #ccc; cursor: not-allowed; }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .vo-root { flex-direction: column; }
          .vo-left {
            flex: none;
            min-height: 35vh;
            padding: 2rem 2rem 2.5rem;
          }
          .vo-right {
            width: 100%;
            min-width: 0;
            padding: 2.5rem 1.5rem 3rem;
          }
        }

        @media (max-width: 480px) {
          .vo-left { display: none; }
          .vo-right {
            padding: 2rem 1.25rem 2.5rem;
            justify-content: flex-start;
            padding-top: 3rem;
          }
          .vo-digit { height: 50px; font-size: 1.3rem; border-radius: 10px; }
          .vo-otp-row { gap: 7px; }
          .vo-card { max-width: 100%; }
        }
      `}</style>

      <div className="vo-root">
        {/* ── LEFT PANEL ── */}
        <div className="vo-left">
          <div className="vo-left-bg" />
          <div className="vo-left-overlay" />
          <div className="vo-left-bottom">
            <div className="vo-brand">✦ SmartStay Premium</div>
            <h1 className="vo-headline">
              One final step to <em>unlock</em> your journey.
            </h1>
            <p className="vo-sub">
              Verify your email to access exclusive rates, manage your bookings,
              and curate your personal collection of dream destinations.
            </p>
            <div className="vo-features">
              {[
                "Instant booking confirmation",
                "Access to member-only rates",
                "Personalised hotel wishlist",
                "24/7 concierge support",
              ].map((f) => (
                <div className="vo-feat" key={f}>
                  <div className="vo-feat-dot" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="vo-right">
          <div className="vo-card">

            {/* Logo */}
            <div className="vo-logo-mark">
              <div className="vo-logo-icon">🏨</div>
              <div className="vo-logo-text">
                Smart<span>Stay</span>
              </div>
            </div>

            <div className="vo-divider" />

            <h2 className="vo-title">Verify Your Email</h2>
            <p className="vo-subtitle">
              Enter the 6-digit code sent to:
            </p>

            <div className="vo-email-chip">
              ✉ {email}
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="vo-alert error">
                  ⚠ {error}
                </div>
              )}
              {success && (
                <div className="vo-alert success">
                  ✓ {success}
                </div>
              )}

              {/* OTP inputs */}
              <div className="vo-otp-row" onPaste={handlePaste}>
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    className="vo-digit"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    aria-label={`OTP digit ${i + 1}`}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                  />
                ))}
              </div>

              {/* Countdown progress bar */}
              <div className="vo-progress-wrap">
                <div
                  className="vo-progress-bar"
                  style={{ width: `${(secondsLeft / 60) * 100}%` }}
                />
              </div>

              <button
                type="submit"
                className="vo-verify-btn"
                disabled={otp.length < 6 || loading}
              >
                <div className="vo-btn-accent">
                  <div className="vo-btn-line" />
                  {loading ? "Verifying…" : "Verify Account"}
                  <div className="vo-btn-line" />
                </div>
              </button>
            </form>

            {/* Resend */}
            <div className="vo-resend-wrap">
              {secondsLeft > 0 ? (
                <span className="vo-timer-badge">
                  🕐 Resend in {secondsLeft}s
                </span>
              ) : (
                <span>
                  Didn't receive it?{" "}
                  <button
                    className="vo-resend-btn"
                    onClick={handleResend}
                    disabled={resendLoading}
                  >
                    {resendLoading ? "Sending…" : "Resend Code"}
                  </button>
                </span>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}