import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createHotelOwner } from "../services/adminService";

const INITIAL = { name: "", email: "", password: "" };

const iStyle = {
  fontFamily: "'Poppins',sans-serif", fontSize: 13,
  border: "1.5px solid #e8ecf0", borderRadius: 10,
  padding: "11px 14px", outline: "none", color: "#1a2332",
  background: "#fafbfc", width: "100%", boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const Field = ({ label, children }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
    <label style={{ fontSize:11, fontWeight:600, color:"#8B9EA8", letterSpacing:"0.08em", textTransform:"uppercase" }}>
      {label}
    </label>
    {children}
  </div>
);

function CreateOwner() {
  const { user } = useAuth();
  const [formData, setFormData] = useState(INITIAL);
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess]   = useState("");

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    try {
      const data = await createHotelOwner(formData, user.token);
      setSuccess(data.message || "Owner created successfully");
      setFormData(INITIAL);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Owner creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .co-root { font-family:'Poppins',sans-serif; color:#1a2332; display:flex; flex-direction:column; gap:24px; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .co-root { animation:fadeIn 0.35s ease; }

        .co-title { font-size:28px; font-weight:800; letter-spacing:-0.5px; line-height:1.1; }
        .co-sub   { font-size:13px; color:#8B9EA8; margin-top:4px; }
        .co-gold  { display:block; width:36px; height:3px; background:#C9A96E; border-radius:2px; margin-top:8px; }

        .co-card {
          background:#fff; border-radius:18px; padding:32px;
          box-shadow:0 8px 40px rgba(44,62,80,0.09);
          border-top:4px solid #C9A96E;
          max-width:520px;
          animation:fadeUp 0.4s ease both;
        }

        .co-card-title {
          font-size:15px; font-weight:700; color:#1a2332;
          margin-bottom:22px; display:flex; align-items:center; gap:8px;
        }

        .co-fields { display:flex; flex-direction:column; gap:16px; }

        .co-pass-wrap { position:relative; }
        .co-pass-wrap input { padding-right:44px; }
        .co-eye-btn {
          position:absolute; right:12px; top:50%; transform:translateY(-50%);
          background:none; border:none; cursor:pointer; color:#8B9EA8;
          font-size:16px; padding:0; line-height:1; transition:color 0.2s;
        }
        .co-eye-btn:hover { color:#1a2332; }

        input:focus, select:focus {
          border-color:#C9A96E !important; background:#fff !important;
          box-shadow:0 0 0 3px rgba(201,169,110,0.12) !important;
        }

        .co-submit {
          background:#1a2332; color:#C9A96E; border:none;
          font-family:'Poppins',sans-serif; font-size:14px; font-weight:600;
          padding:13px; border-radius:12px; cursor:pointer; width:100%;
          transition:all 0.2s; letter-spacing:0.3px; margin-top:6px;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .co-submit:hover:not(:disabled) { background:#C9A96E; color:#1a2332; }
        .co-submit:disabled { opacity:0.55; cursor:not-allowed; }

        .co-success {
          background:rgba(122,158,126,0.1); color:#3a7a42;
          border:1px solid rgba(122,158,126,0.3);
          border-radius:10px; padding:12px 16px;
          font-size:13px; font-weight:500;
          display:flex; align-items:center; gap:8px;
          animation:fadeIn 0.3s ease;
        }

        .co-hint {
          background:#f8f9fb; border-radius:12px; padding:16px 18px;
          font-size:12px; color:#8B9EA8; line-height:1.7;
          border-left:3px solid #C9A96E; max-width:520px;
        }
        .co-hint strong { color:#1a2332; font-weight:600; }

        @keyframes spin { to{transform:rotate(360deg)} }
        .co-spinner { animation:spin 0.8s linear infinite; display:inline-block; }
      `}</style>

      <div className="co-root">

        {/* Page header */}
        <div>
          <h1 className="co-title">Create Owner</h1>
          <p className="co-sub">Register a new hotel owner account</p>
          <span className="co-gold" />
        </div>

        {/* Success banner */}
        {success && (
          <div className="co-success">
            ✓ {success}
          </div>
        )}

        {/* Form card */}
        <div className="co-card">
          <p className="co-card-title">🔑 Owner Details</p>

          <form onSubmit={handleSubmit}>
            <div className="co-fields">

              <Field label="Full Name">
                <input
                  style={iStyle} type="text" name="name"
                  placeholder="e.g. Ravi Sharma"
                  required value={formData.name} onChange={handleChange}
                />
              </Field>

              <Field label="Email Address">
                <input
                  style={iStyle} type="email" name="email"
                  placeholder="owner@hotel.com"
                  required value={formData.email} onChange={handleChange}
                />
              </Field>

              <Field label="Password">
                <div className="co-pass-wrap">
                  <input
                    style={iStyle}
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Min. 8 characters"
                    required minLength={8}
                    value={formData.password} onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="co-eye-btn"
                    onClick={() => setShowPass((v) => !v)}
                    title={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? "🙈" : "👁"}
                  </button>
                </div>
              </Field>

              <button className="co-submit" type="submit" disabled={loading}>
                {loading
                  ? <><span className="co-spinner">⟳</span> Creating…</>
                  : "Create Owner Account"}
              </button>

            </div>
          </form>
        </div>

        {/* Info hint */}
        <div className="co-hint">
          <strong>Note:</strong> The owner will receive access to manage their assigned hotels.
          Share the login credentials securely — passwords cannot be retrieved after creation.
        </div>

      </div>
    </>
  );
}

export default CreateOwner;